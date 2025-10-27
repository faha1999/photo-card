'use client';

import { useEffect, useRef, useState, useCallback, MouseEvent } from 'react';
import {
  CardPreviewProps,
  Position,
  FilterSettings,
  CardState,
} from '../types';

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  grayscale: 0,
  sepia: 0,
};

export default function CardPreview({
  file,
  templateUrl,
  onConfirm,
  showGuides,
  onToggleGuides,
  filters: initialFilters,
}: CardPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [template, setTemplate] = useState<HTMLImageElement | null>(null);

  const [pos, setPos] = useState<Position>({ x: 540, y: 540 }); // image center
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });

  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  // ✅ Filters
  const [filters, setFilters] = useState(
    initialFilters || {
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      sepia: 0,
    },
  );

  // ✅ Background color
  const [bgColor, setBgColor] = useState('#ffffff');

  // ✅ Blend mode
  const [blendMode, setBlendMode] =
    useState<GlobalCompositeOperation>('source-over');

  useEffect(() => {
    if (image) saveState();
  }, [image]);

  // ✅ Undo/Redo stack
  const updatePos = (newPos: Position) => {
    saveState();
    setPos(newPos);
  };
  const updateScale = (newScale: number) => {
    saveState();
    setScale(newScale);
  };
  const updateRotation = (newRotation: number) => {
    saveState();
    setRotation(newRotation);
  };

  const [history, setHistory] = useState<CardState[]>([]);
  const [future, setFuture] = useState<CardState[]>([]);

  const saveState = useCallback(() => {
    setHistory((prev) => [
      ...prev,
      { pos, rotation, scale, filters, bgColor, blendMode },
    ]);
    setFuture([]); // clear redo stack
  }, [pos, rotation, scale, filters, bgColor, blendMode]);

  const undo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    if (!lastState) return;
    setFuture((f) => [lastState, ...f]);
    setHistory((h) => h.slice(0, -1));
    const prevState = history[history.length - 2] || history[0];
    if (prevState) {
      setPos(prevState.pos);
      setRotation(prevState.rotation);
      setScale(prevState.scale);
      setFilters(prevState.filters);
      setBgColor(prevState.bgColor);
      setBlendMode(prevState.blendMode);
    }
  };

  const redo = () => {
    if (future.length === 0) return;
    const nextState = future[0];
    if (!nextState) return;
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, nextState]);
    setPos(nextState.pos);
    setRotation(nextState.rotation);
    setScale(nextState.scale);
    setFilters(nextState.filters);
    setBgColor(nextState.bgColor);
    setBlendMode(nextState.blendMode);
  };

  // Snap-to-center logic
  const snapThreshold = 20; // px

  const getRotatedCoordinates = (
    x: number,
    y: number,
    rotation: number,
    width: number,
    height: number,
  ): Position => {
    const cx = width / 2;
    const cy = height / 2;
    let dx = x - cx;
    let dy = y - cy;
    const rad = (-rotation * Math.PI) / 180;
    const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
    return { x: rx + cx, y: ry + cy };
  };

  useEffect(() => {
    if (!file) return;
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!templateUrl) return;
    const img = new Image();
    img.onload = () => setTemplate(img);
    img.src = templateUrl;
  }, [templateUrl]);

  useEffect(() => {
    if (!image || !template || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    // ✅ Draw background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cw, ch);

    // Draw user image with filters and blend mode
    ctx.save();
    ctx.translate(cw / 2, ch / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    const drawX = pos.x - scaledWidth / 2;
    const drawY = pos.y - scaledHeight / 2;

    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
    `;
    ctx.globalCompositeOperation = blendMode;

    ctx.drawImage(
      image,
      drawX - cw / 2,
      drawY - ch / 2,
      scaledWidth,
      scaledHeight,
    );

    ctx.restore();

    // Reset blend mode for template
    ctx.globalCompositeOperation = 'source-over';

    // Draw template overlay
    ctx.filter = 'none';
    ctx.drawImage(template, 0, 0, cw, ch);

    // Draw guides
    if (showGuides) {
      // Draw center lines
      ctx.strokeStyle = 'rgba(65, 105, 225, 0.5)'; // royal blue with opacity
      ctx.lineWidth = 2;

      // Vertical center
      ctx.beginPath();
      ctx.setLineDash([5, 5]); // Create dashed line
      ctx.moveTo(cw / 2, 0);
      ctx.lineTo(cw / 2, ch);
      ctx.stroke();

      // Horizontal center
      ctx.beginPath();
      ctx.moveTo(0, ch / 2);
      ctx.lineTo(cw, ch / 2);
      ctx.stroke();

      // Reset line style
      ctx.setLineDash([]);

      // Draw rule of thirds
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo((cw * i) / 3, 0);
        ctx.lineTo((cw * i) / 3, ch);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (ch * i) / 3);
        ctx.lineTo(cw, (ch * i) / 3);
        ctx.stroke();
      }
    }
  }, [
    image,
    template,
    pos,
    rotation,
    scale,
    filters,
    showGuides,
    bgColor,
    blendMode,
  ]);

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotatedPos = getRotatedCoordinates(
      mouseX,
      mouseY,
      rotation,
      rect.width,
      rect.height,
    );
    setIsDragging(true);
    setOffset({ x: rotatedPos.x - pos.x, y: rotatedPos.y - pos.y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rotatedPos = getRotatedCoordinates(
      mouseX,
      mouseY,
      rotation,
      rect.width,
      rect.height,
    );

    let newX = rotatedPos.x - offset.x;
    let newY = rotatedPos.y - offset.y;

    // Snap-to-center
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    if (Math.abs(newX - cx) < snapThreshold) newX = cx;
    if (Math.abs(newY - cy) < snapThreshold) newY = cy;

    setPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging) saveState();
    setIsDragging(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setPos((p) => ({ ...p, y: p.y - 5 }));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setPos((p) => ({ ...p, y: p.y + 5 }));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPos((p) => ({ ...p, x: p.x - 5 }));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPos((p) => ({ ...p, x: p.x + 5 }));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [history, future]);

  const confirmPosition = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onConfirm(dataUrl, filters, bgColor, blendMode);
  };

  return (
    <div className="surface-card mx-auto mt-8 max-w-2xl p-6">
      <h3 className="mb-6 select-none text-center text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
        Adjust Image Position
      </h3>

      {/* Controls Panel */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <button
          onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
          className="rounded-md border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-indigo-700 transition dark:border-indigo-400/30 dark:bg-indigo-900/30 dark:text-indigo-200">
          ◀ Rotate
        </button>
        <button
          onClick={() => setRotation((r) => (r + 90) % 360)}
          className="rounded-md border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-indigo-700 transition dark:border-indigo-400/30 dark:bg-indigo-900/30 dark:text-indigo-200">
          Rotate ▶
        </button>
        <button
          onClick={() => setScale((s) => Math.min(s + 0.1, 3))}
          className="rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2 text-green-700 transition dark:border-green-400/30 dark:bg-green-900/20 dark:text-green-200">
          ＋ Zoom
        </button>
        <button
          onClick={() => setScale((s) => Math.max(s - 0.1, 0.1))}
          className="rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2 text-green-700 transition dark:border-green-400/30 dark:bg-green-900/20 dark:text-green-200">
          － Zoom
        </button>
        <button
          onClick={onToggleGuides}
          className={`px-3 py-2 ${
            showGuides
              ? 'border border-indigo-500/40 bg-indigo-500/10 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-900/30 dark:text-indigo-200'
              : 'border border-gray-400/40 bg-gray-100 text-gray-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200'
          } rounded-md transition`}>
          {showGuides ? 'Hide Guides' : 'Show Guides'}
        </button>

        {/* Background color picker */}
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm font-medium">Background Color</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="h-8 w-16 cursor-pointer rounded border bg-transparent"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>

        {/* Blend mode selector */}
        <div className="flex flex-col items-center">
          <label className="mb-1 text-sm font-medium">Blend Mode</label>
          <select
            value={blendMode}
            onChange={(e) =>
              setBlendMode(e.target.value as GlobalCompositeOperation)
            }
            className="input-surface rounded-md p-1">
            <option value="source-over">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="overlay">Overlay</option>
            <option value="screen">Screen</option>
          </select>
        </div>
      </div>

      {/* Guide Panel */}
      {showGuides && (
        <div className="mb-6 space-y-3 rounded-xl border border-indigo-300/50 bg-indigo-500/10 p-5 text-sm text-muted shadow-sm dark:border-indigo-400/40 dark:bg-indigo-900/20">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-200">
              Photo Card Guide
            </h4>
          </div>
          <ul className="grid gap-2 text-muted">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
              Drag your photo to adjust its position within the card
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
              Use arrow keys for precise adjustments
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
              Blue center lines help with alignment
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
              White lines show the rule of thirds for composition
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
              Adjust filters and blend modes for the perfect look
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
              Use Ctrl+Z / Ctrl+Y to undo/redo changes
            </li>
          </ul>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {(Object.keys(filters) as Array<keyof FilterSettings>).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium capitalize">{key}</label>
            <input
              type="range"
              min="0"
              max="200"
              value={filters[key]}
              onChange={(e) =>
                setFilters((f) => ({ ...f, [key]: Number(e.target.value) }))
              }
            />
          </div>
        ))}
      </div>

      {/* Canvas Preview */}
      <canvas
        ref={canvasRef}
        width={1080}
        height={1080}
        className="w-full cursor-move rounded-lg border shadow-md transition-colors"
        style={{ borderColor: 'var(--border)' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <button
        onClick={confirmPosition}
        className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-white shadow-lg transition hover:bg-indigo-700">
        Confirm Position & Save
      </button>
    </div>
  );
}
