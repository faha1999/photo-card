'use client';

import { useState } from 'react';
import { FilterSettings } from '../types';
import UploadArea from '../components/UploadArea';
import Controls from '../components/Controls';
import CardPreview from '../components/CardPreview';
import TemplateManager from '../components/TemplateManager';

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    '/templates/template.png',
  );

  // Filters
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    sepia: 0,
  });

  // Guides toggle
  const [showGuides, setShowGuides] = useState<boolean>(true);

  // Filename input
  const [fileName, setFileName] = useState<string>('photo-card');

  // Export format: png or jpeg
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');

  const handleGenerate = () => {
    if (!file) return alert('Please upload a photo first.');
    setIsAdjusting(true);
  };

  const handleDownload = () => {
    if (!previewDataUrl) return;
    setIsLoading(true);
    setTimeout(() => {
      const a = document.createElement('a');
      // Update download URL according to export format
      const mimeType = exportFormat === 'jpeg' ? 'image/jpeg' : 'image/png';
      const extension = exportFormat === 'jpeg' ? 'jpg' : 'png';

      // Convert canvas data URL to desired format if JPEG
      if (
        exportFormat === 'jpeg' &&
        previewDataUrl.startsWith('data:image/png')
      ) {
        const img = new Image();
        img.src = previewDataUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(img, 0, 0);
          a.href = canvas.toDataURL('image/jpeg', 0.92); // 92% quality
          a.download = `${fileName || 'photo-card'}-${scale}x.${extension}`;
          a.click();
          setIsLoading(false);
        };
      } else {
        a.href = previewDataUrl;
        a.download = `${fileName || 'photo-card'}-${scale}x.${extension}`;
        a.click();
        setIsLoading(false);
      }
    }, 500);
  };

  const handleNewCard = () => {
    setFile(null);
    setScale(1);
    setPreviewDataUrl(null);
    setIsAdjusting(false);
    setSelectedTemplate('/templates/template.png');
    setFilters({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0 });
    setFileName('photo-card');
    setExportFormat('png');
  };

  const handleResetAdjustments = () => {
    setScale(1);
    setIsAdjusting(true);
    setPreviewDataUrl(null);
    setFilters({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0 });
  };

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50 min-h-screen">
      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
        {/* Upload */}
        <UploadArea file={file} setFile={setFile} />

        {/* Template Manager */}
        <div className="mt-6">
          <TemplateManager
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        </div>

        {/* Controls */}
        <Controls
          scale={scale}
          setScale={setScale}
          filters={filters}
          setFilters={setFilters}
          fileName={fileName}
          setFileName={setFileName}
          showGuides={showGuides}
          setShowGuides={setShowGuides}
          // ✅ New prop for export format
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
        />

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 mt-6 justify-center">
          <button
            onClick={handleGenerate}
            disabled={!file}
            className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:bg-gray-400">
            {isAdjusting ? 'Adjusting...' : 'Generate Card'}
          </button>

          <button
            onClick={handleDownload}
            disabled={!previewDataUrl || isLoading}
            className="px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:bg-gray-400">
            {isLoading
              ? 'Downloading...'
              : `Download (${exportFormat.toUpperCase()})`}
          </button>

          <button
            onClick={handleNewCard}
            className="px-5 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition">
            New Card
          </button>

          {isAdjusting && (
            <button
              onClick={handleResetAdjustments}
              className="px-5 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition">
              Reset Adjustments
            </button>
          )}
        </div>

        {/* Show adjustment interface */}
        {isAdjusting && file && (
          <CardPreview
            file={file}
            templateUrl={selectedTemplate}
            filters={filters}
            showGuides={showGuides}
            onToggleGuides={() => setShowGuides((s) => !s)}
            onConfirm={(finalDataUrl) => {
              setPreviewDataUrl(finalDataUrl);
              setIsAdjusting(false);
            }}
          />
        )}

        {/* Final preview */}
        {previewDataUrl && !isAdjusting && (
          <div className="mt-6 max-w-md mx-auto text-center">
            <h3 className="font-semibold mb-4 text-xl text-gray-800">
              Final Preview
            </h3>
            <img
              src={previewDataUrl}
              alt="Photo card preview"
              className="rounded-xl border shadow-md w-full h-auto object-contain"
            />
          </div>
        )}
      </section>
    </div>
  );
}
