'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { Plus, Trash2, CheckCircle2, Edit3, Save } from 'lucide-react';

import { TemplateManagerProps } from '../types';

export default function TemplateManager({
  selectedTemplate,
  setSelectedTemplate,
}: TemplateManagerProps) {
  interface Template {
    id?: string;
    path: string; // Now always a valid URL string (either static path or base64)
    name: string;
    src?: string; // Optional, for backward compatibility
  }

  const [templates, setTemplates] = useState<Template[]>([]);
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Load default templates + user templates from localStorage
  useEffect(() => {
    const defaultTemplates = [
      {
        id: 'template1',
        name: 'Default Template',
        path: '/templates/template.png',
      },
      { id: 'logo', name: 'Logo Template', path: '/templates/logo.png' },
    ];

    const stored = JSON.parse(localStorage.getItem('userTemplates') || '[]');
    setTemplates([...defaultTemplates, ...stored]);
    setUserTemplates(stored);
  }, []);

  // Handle file upload → convert to base64 → save to localStorage
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 10MB limit. Please choose a smaller file.');
      return;
    }

    // Validate file type
    if (file.type.toLowerCase() !== 'image/png') {
      alert(
        'Only PNG files are allowed for templates. Please choose a PNG file.',
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const newTemplate: Template = {
        id: Date.now().toString(),
        name: file.name,
        path: result, // Store the base64 data URL instead of blob URL
        src: result,
      };

      const updated = [...userTemplates, newTemplate];
      setUserTemplates(updated);
      setTemplates((prev) => [...prev, newTemplate]);
      localStorage.setItem('userTemplates', JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  // Delete template (only user-uploaded)
  const handleDelete = (id: string) => {
    const updated = userTemplates.filter((t) => t.id !== id);
    setUserTemplates(updated);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    localStorage.setItem('userTemplates', JSON.stringify(updated));
  };

  // Rename template
  const handleRename = (id: string) => {
    const updated = userTemplates.map((t) =>
      t.id === id ? { ...t, name: editName } : t,
    );
    setUserTemplates(updated);
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: editName } : t)),
    );
    localStorage.setItem('userTemplates', JSON.stringify(updated));
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="p-6 bg-white shadow rounded-xl border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Choose a Template
      </h2>

      {/* Upload Button */}
      <div className="mb-4">
        <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition w-fit">
          <Plus className="w-4 h-4" />
          Upload Template
          <input
            type="file"
            accept="image/png"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {templates.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedTemplate(t.path)}
            className={`relative rounded-lg overflow-hidden cursor-pointer group border ${
              selectedTemplate === t.path
                ? 'border-indigo-500 ring-2 ring-indigo-400'
                : 'border-gray-200 hover:border-indigo-300'
            }`}>
            <Image
              src={t.path}
              alt={t.name}
              width={200}
              height={200}
              priority={t.id === 'template1'} // Add priority to the first template
              className="object-cover w-full h-28"
              onError={() => {
                // Remove invalid templates from storage
                if (t.id && userTemplates.some((ut) => ut.id === t.id)) {
                  handleDelete(t.id);
                }
              }}
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              {selectedTemplate === t.path ? (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              ) : (
                <span className="text-white text-sm">{t.name}</span>
              )}
            </div>

            {/* User template actions */}
            {userTemplates.some((ut) => ut.id === t.id) && (
              <>
                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (t.id) handleDelete(t.id);
                  }}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Rename */}
                {editingId === t.id ? (
                  <div className="absolute bottom-2 left-2 bg-white rounded-lg p-1 flex gap-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-sm border px-2 py-1 rounded"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (t.id) handleRename(t.id);
                      }}
                      className="bg-green-500 text-white p-1 rounded">
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(t.id || null);
                      setEditName(t.name);
                    }}
                    className="absolute bottom-2 left-2 bg-yellow-500 text-white p-1 rounded-full opacity-80 hover:opacity-100">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
