import { ControlsProps, ScaleOption, FilterSettings } from '../types';

export default function Controls({
  scale,
  setScale,
  fileName,
  setFileName,
  filters,
  setFilters,
  showGuides,
  setShowGuides,
  exportFormat,
  setExportFormat,
}: ControlsProps) {
  const scaleOptions: ScaleOption[] = [
    { value: 1, label: '1× (1080px)' },
    { value: 2, label: '2× (2160px)' },
    { value: 4, label: '4× (4320px)' },
  ];

  const filterKeys = Object.keys(filters) as Array<keyof FilterSettings>;

  return (
    <section className="surface-card overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between border-b border-[color:var(--border)] px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">
            Controls
          </p>
          <h3 className="mt-1 text-lg font-semibold">Fine-tune your card</h3>
        </div>
        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-500">
          {scale}× Scale
        </span>
      </header>
      <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Scale */}
        <div className="space-y-3">
          <h4 className="font-semibold">Scale</h4>
          <div className="flex flex-wrap gap-3">
            {scaleOptions.map((opt) => {
              const isActive = scale === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 dark:text-indigo-200'
                      : 'border-[color:var(--border)] hover:border-indigo-400'
                  }`}>
                  <input
                    type="radio"
                    checked={isActive}
                    onChange={() => setScale(opt.value)}
                    className="h-4 w-4 accent-indigo-500 focus:ring-indigo-400"
                  />
                  <span>{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* File Name */}
        <div className="space-y-3">
          <h4 className="font-semibold">File name</h4>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name..."
            className="input-surface w-full rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Export Format */}
        <div className="space-y-3">
          <h4 className="font-semibold">Export format</h4>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'png' | 'jpeg')}
            className="input-surface w-full rounded-lg p-2 shadow-sm hover:border-indigo-500 focus:ring-2 focus:ring-indigo-400">
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
          </select>
        </div>

        {/* Guides Toggle */}
        <div className="space-y-3">
          <h4 className="font-semibold">Guides</h4>
          <label className="inline-flex w-full cursor-pointer items-center justify-between rounded-xl border border-[color:var(--border)] px-3 py-2 transition hover:border-indigo-400/60 hover:bg-indigo-500/10">
            <span className="font-medium">Show composition guides</span>
            <input
              type="checkbox"
              checked={showGuides}
              onChange={() => setShowGuides((s) => !s)}
              className="h-5 w-5 rounded-md border border-[color:var(--border)] bg-transparent accent-indigo-500 focus:ring-indigo-400"
            />
          </label>
        </div>

        {/* Filters */}
        <div className="col-span-1 space-y-4 md:col-span-2 lg:col-span-3">
          <h4 className="font-semibold">Filters</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filterKeys.map((key) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="text-sm font-medium capitalize text-muted">
                  {key}
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters[key]}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, [key]: Number(e.target.value) }))
                  }
                  className="w-full accent-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
