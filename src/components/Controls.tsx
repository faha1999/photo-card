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
    <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Scale */}
      <div>
        <h4 className="font-semibold mb-2 text-gray-700">Scale</h4>
        <div className="flex flex-wrap gap-3">
          {scaleOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer px-3 py-1 border rounded-lg hover:border-indigo-500 transition">
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
        <h4 className="font-semibold mb-2 text-gray-700">File Name</h4>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name..."
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
      </div>

      {/* Export Format */}
      <div>
        <h4 className="font-semibold mb-2 text-gray-700">Export Format</h4>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as 'png' | 'jpeg')}
          className="w-full border rounded-lg p-2 bg-white shadow-sm hover:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none">
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
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="text-gray-700 font-medium">Show Guides</span>
        </label>
      </div>

      {/* Filters */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filterKeys.map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm font-medium capitalize text-gray-700">
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
