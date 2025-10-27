'use client';

import { useState } from 'react';
import { FilterSettings } from '../types';
import UploadArea from '../components/UploadArea';
import Controls from '../components/Controls';
import CardPreview from '../components/CardPreview';
import TemplateManager from '../components/TemplateManager';

const STAGE_KEYS = ['upload', 'template', 'adjust', 'export'] as const;
type StageKey = (typeof STAGE_KEYS)[number];
type StepState = 'complete' | 'current' | 'upcoming';

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
  const [hasExported, setHasExported] = useState(false);

  const handleGenerate = () => {
    if (!file) {
      alert('Please upload a photo first.');
      return;
    }
    setHasExported(false);
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
          setHasExported(true);
        };
      } else {
        a.href = previewDataUrl;
        a.download = `${fileName || 'photo-card'}-${scale}x.${extension}`;
        a.click();
        setIsLoading(false);
        setHasExported(true);
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
    setHasExported(false);
  };

  const handleResetAdjustments = () => {
    setScale(1);
    setIsAdjusting(true);
    setPreviewDataUrl(null);
    setFilters({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0 });
    setHasExported(false);
  };

  const hasUpload = Boolean(file);
  const hasPreview = Boolean(previewDataUrl);
  const defaultTemplatePath = '/templates/template.png';
  const isDefaultTemplate = selectedTemplate === defaultTemplatePath;
  const truncatedFileName =
    file?.name && file.name.length > 28
      ? `${file.name.slice(0, 25)}...`
      : file?.name || null;

  let currentStage: StageKey;
  if (hasExported) {
    currentStage = 'export';
  } else if (!hasUpload) {
    currentStage = 'upload';
  } else if (isAdjusting) {
    currentStage = 'adjust';
  } else if (hasPreview) {
    currentStage = 'export';
  } else {
    currentStage = 'template';
  }

  const currentStageIndex = STAGE_KEYS.indexOf(currentStage);
  const workflowSteps = STAGE_KEYS.map((key, index) => {
    let state: StepState;
    if (hasExported) {
      state = 'complete';
    } else {
      state =
        index < currentStageIndex
          ? 'complete'
          : index === currentStageIndex
            ? 'current'
            : 'upcoming';
    }

    let title = '';
    let description = '';

    if (key === 'upload') {
      title = 'Upload photo';
      description = hasUpload
        ? truncatedFileName || 'Photo ready to edit'
        : 'Add a JPG or PNG to begin';
    } else if (key === 'template') {
      title = 'Choose template';
      description = !hasUpload
        ? 'Unlocks after upload'
        : isDefaultTemplate
          ? 'Default Studio template selected'
          : 'Custom template applied';
    } else if (key === 'adjust') {
      title = 'Adjust composition';
      description = isAdjusting
        ? 'Fine-tuning in progress'
        : hasPreview
          ? 'Saved with your latest adjustments'
          : 'Generate a card to tweak placement';
    } else {
      title = 'Export';
      description = hasPreview
        ? hasExported
          ? `Downloaded as ${exportFormat.toUpperCase()}`
          : `Ready as ${exportFormat.toUpperCase()}`
        : 'Download once your preview is ready';
      if (hasExported) {
        state = 'complete';
      }
    }

    return { key, title, description, state };
  });

  const completedCount = workflowSteps.filter((step) => step.state === 'complete').length;
  const currentStepTitle =
    workflowSteps[currentStageIndex]?.title ?? workflowSteps[0]?.title ?? 'Upload photo';

  return (
    <div className="min-h-screen py-10 transition-colors duration-300">
      <div className="flex w-full flex-col gap-8 px-4 sm:px-5 lg:flex-row lg:px-6 xl:px-10 2xl:px-14">
        <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-24 lg:basis-[320px] lg:flex-none">
          <section className="surface-card overflow-hidden rounded-2xl">
            <header className="border-b border-[color:var(--border)] bg-[rgba(99,102,241,0.08)]/20 px-6 py-4 dark:bg-[rgba(79,70,229,0.18)]">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-400">
                Setup
              </p>
              <h2 className="mt-2 text-lg font-semibold">
                Upload your photo
              </h2>
              <p className="text-sm text-muted">
                Bring in a crisp JPG or PNG to craft a gallery-ready card.
              </p>
            </header>
            <div className="space-y-5 px-6 py-6">
              <UploadArea file={file} setFile={setFile} />
              <dl className="grid grid-cols-1 gap-3 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-[0.65rem] font-semibold text-indigo-500">
                    1
                  </span>
                  <div>
                    <dt className="font-semibold text-[color:var(--text-primary)]">
                      Supported formats
                    </dt>
                    <dd>JPG, JPEG, PNG up to 10 MB</dd>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-[0.65rem] font-semibold text-indigo-500">
                    2
                  </span>
                  <div>
                    <dt className="font-semibold text-[color:var(--text-primary)]">
                      Templates
                    </dt>
                    <dd>Use transparent PNG overlays for blends</dd>
                  </div>
                </div>
              </dl>
            </div>
          </section>

          <section className="surface-card overflow-hidden rounded-2xl">
            <header className="flex items-center justify-between border-b border-[color:var(--border)] px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">
                  Actions
                </p>
                <h3 className="mt-1 text-lg font-semibold">Quick controls</h3>
              </div>
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-alt)] px-3 py-1 text-xs font-semibold text-muted">
                {hasPreview ? 'Preview ready' : hasUpload ? 'Awaiting preview' : 'Start by uploading'}
              </span>
            </header>
            <div className="space-y-4 px-6 py-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={handleGenerate}
                  disabled={!file}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:saturate-50 sm:col-span-2">
                  {isAdjusting ? 'Adjusting...' : 'Generate Card'}
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!previewDataUrl || isLoading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500/90 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
                  {isLoading
                    ? 'Preparing download...'
                    : `Download (${exportFormat.toUpperCase()})`}
                </button>

                <button
                  onClick={handleNewCard}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300/60 px-5 py-3 text-sm font-semibold transition hover:border-slate-200 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-transparent dark:border-slate-600/70 dark:hover:border-slate-400 dark:hover:text-indigo-200">
                  New Card
                </button>

                {isAdjusting && (
                  <button
                    onClick={handleResetAdjustments}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-amber-400/60 px-5 py-3 text-sm font-semibold text-amber-500 transition hover:border-amber-300 hover:bg-amber-400/10 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent dark:text-amber-300">
                    Reset Adjustments
                  </button>
                )}
              </div>
              <p className="text-xs text-muted">
                Tip: Save multiple exports in different formats by switching the dropdown above before downloading.
              </p>
            </div>
          </section>

          <TemplateManager
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />

          <Controls
            scale={scale}
            setScale={setScale}
            filters={filters}
            setFilters={setFilters}
            fileName={fileName}
            setFileName={setFileName}
            showGuides={showGuides}
            setShowGuides={setShowGuides}
            exportFormat={exportFormat}
            setExportFormat={setExportFormat}
          />

          
          
        </aside>

        <section className="relative space-y-6 lg:flex-[2.4]">
          <section className="surface-card overflow-hidden rounded-2xl p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">
                  Workflow
                </p>
                <h3 className="mt-1 text-lg font-semibold">Production status</h3>
              </div>
              <div className="flex flex-col items-start gap-2 text-xs text-muted sm:flex-row sm:items-center sm:gap-3">
                <span className="inline-flex items-center gap-2 font-semibold text-indigo-400">
                  <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                  Current: {currentStepTitle}
                </span>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 font-semibold text-indigo-500">
                  {completedCount} / {STAGE_KEYS.length} complete
                </span>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {workflowSteps.map((step, index) => {
                const borderClasses =
                  step.state === 'complete'
                    ? 'border-emerald-400/60 bg-emerald-400/10'
                    : step.state === 'current'
                      ? 'border-indigo-500/60 bg-indigo-500/10'
                      : 'border-[color:var(--border)] bg-[color:var(--surface-alt)]';
                const cardShadow =
                  step.state === 'current'
                    ? 'shadow-lg shadow-indigo-500/25'
                    : 'shadow-sm shadow-transparent';
                const statusLabel =
                  step.state === 'complete'
                    ? 'Complete'
                    : step.state === 'current'
                      ? 'In progress'
                      : 'Waiting';
                const progressWidth =
                  step.state === 'complete'
                    ? '100%'
                    : step.state === 'current'
                      ? '65%'
                      : '8%';
                const gradientClass =
                  step.state === 'complete'
                    ? 'from-emerald-400 via-emerald-500 to-emerald-300'
                    : step.state === 'current'
                      ? 'from-indigo-400 via-purple-500 to-sky-400'
                      : 'from-slate-400 via-slate-500 to-slate-400/60';
                return (
                  <div
                    key={step.key}
                    className={`relative overflow-hidden rounded-2xl border px-4 py-5 transition ${borderClasses} ${cardShadow}`}>
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted">
                          Step {index + 1}
                        </p>
                        <h4 className="mt-1 text-sm font-semibold text-[color:var(--text-primary)]">
                          {step.title}
                        </h4>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold ${
                          step.state === 'complete'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : step.state === 'current'
                              ? 'bg-indigo-500/15 text-indigo-400'
                              : 'bg-[color:var(--surface)] text-muted'
                        }`}>
                        {statusLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted">{step.description}</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full border border-indigo-500/20 bg-[color:var(--surface)]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-700 ease-out`}
                        style={{ width: progressWidth }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          {isAdjusting && file ? (
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
              className="lg:sticky lg:top-24"
            />
          ) : (
            <div className="surface-card flex min-h-[420px] flex-col items-center justify-center gap-4 p-10 text-center">
              <span className="inline-flex items-center rounded-full border border-indigo-400/60 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-indigo-400">
                Studio Workspace
              </span>
              <h2 className="text-2xl font-semibold">
                Your live canvas appears here
              </h2>
              <p className="max-w-md text-sm text-muted">
                Upload a photo on the left, choose a template, then hit{' '}
                <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                  Generate Card
                </span>{' '}
                to start positioning your artwork.
              </p>
              {file && (
                <button
                  onClick={handleGenerate}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent">
                  Resume Adjustment
                </button>
              )}
            </div>
          )}

          {previewDataUrl && (
            <div className="surface-card overflow-hidden p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Final render</h3>
                  <p className="text-sm text-muted">
                    Exported as {exportFormat.toUpperCase()} at {scale}× scale.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                  Ready
                </span>
              </div>
              <div
                className="mt-5 overflow-hidden rounded-xl border shadow-inner"
                style={{ borderColor: 'var(--border)' }}>
                <img
                  src={previewDataUrl}
                  alt="Photo card preview"
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
