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
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        const defaultTemplates = await response.json();

        const stored = JSON.parse(
          localStorage.getItem('userTemplates') || '[]',
        );
        setTemplates([...defaultTemplates, ...stored]);
        setUserTemplates(stored);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
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
    <div className="surface-panel rounded-xl p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">Choose a Template</h2>

      {/* Upload Button */}
      <div className="mb-4">
        <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {templates.map((t) => {
          const isActive = selectedTemplate === t.path;
          const showActions = userTemplates.some((ut) => ut.id === t.id);

          return (
            <div
              key={t.id}
              onClick={() => setSelectedTemplate(t.path)}
              className={`group relative cursor-pointer overflow-hidden rounded-lg border transition ${
                isActive
                  ? 'border-indigo-500 ring-2 ring-indigo-400 dark:ring-indigo-500/60'
                  : 'hover:border-indigo-400/70'
              }`}
              style={
                isActive ? undefined : { borderColor: 'var(--border)' }
              }>
              <Image
                src={t.path}
                alt={t.name}
                width={200}
                height={200}
                priority={t.id === 'template1'} // Add priority to the first template
                className="h-28 w-full object-cover"
                onError={() => {
                  // Remove invalid templates from storage
                  if (t.id && userTemplates.some((ut) => ut.id === t.id)) {
                    handleDelete(t.id);
                  }
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                {isActive ? (
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                ) : (
                  <span className="text-sm text-white">{t.name}</span>
                )}
              </div>

              {/* User template actions */}
              {showActions && (
                <>
                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (t.id) handleDelete(t.id);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white opacity-80 transition hover:opacity-100">
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Rename */}
                  {editingId === t.id ? (
                    <div className="absolute bottom-2 left-2 flex gap-1 rounded-lg bg-white p-1 shadow-sm dark:bg-slate-900">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-surface rounded px-2 py-1 text-sm"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (t.id) handleRename(t.id);
                        }}
                        className="rounded bg-green-500 p-1 text-white">
                        <Save className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(t.id || null);
                        setEditName(t.name);
                      }}
                      className="absolute bottom-2 left-2 rounded-full bg-yellow-500 p-1 text-white opacity-80 transition hover:opacity-100">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
