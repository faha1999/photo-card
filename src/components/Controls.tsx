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
  const scaleOptions = [
    { value: 1, label: '1× (1080px)' },
    { value: 2, label: '2× (2160px)' },
    { value: 4, label: '4× (4320px)' },
  ];

  const filterKeys = Object.keys(filters) as Array<keyof FilterSettings>;

  return (
    <div className="surface-panel mt-6 grid grid-cols-1 gap-6 rounded-2xl p-6 shadow-md md:grid-cols-2 lg:grid-cols-3">
      {/* Scale */}
      <div>
        <h4 className="mb-2 font-semibold">Scale</h4>
        <div className="flex flex-wrap gap-3">
          {scaleOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1 transition hover:border-indigo-500"
              style={{ borderColor: 'var(--border)' }}>
              <input
                type="radio"
                checked={scale === opt.value}
                onChange={() => setScale(opt.value)}
                className="form-radio text-indigo-600"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* File Name */}
      <div>
        <h4 className="mb-2 font-semibold">File Name</h4>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name..."
          className="input-surface w-full rounded-lg p-2 focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Export Format */}
      <div>
        <h4 className="mb-2 font-semibold">Export Format</h4>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'png' | 'jpeg')}
          className="input-surface w-full rounded-lg p-2 shadow-sm hover:border-indigo-500 focus:ring-2 focus:ring-indigo-400">
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
        </select>
      </div>

      {/* Guides Toggle */}
      <div className="flex flex-col justify-center">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showGuides}
            onChange={() => setShowGuides((s) => !s)}
            className="form-checkbox h-5 w-5 text-indigo-600 dark:bg-slate-800 dark:border-slate-600"
          />
          <span className="font-medium">Show Guides</span>
        </label>
      </div>

      {/* Filters */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filterKeys.map((key) => (
          <div key={key} className="flex flex-col">
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
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
