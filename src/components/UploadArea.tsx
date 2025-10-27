import { useCallback, useState, useEffect } from 'react';

import { UploadAreaProps } from '../types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_TEMPLATE_TYPES = ['image/png'];

export default function UploadArea({
  file,
  setFile,
  isTemplate = false,
}: UploadAreaProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>('');

  const onDragOver = useCallback((e: globalThis.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: globalThis.DragEvent) => {
    e.preventDefault();
    if (!e.relatedTarget || e.relatedTarget === document.body) {
      setDragOver(false);
    }
  }, []);

  const validateFile = useCallback(
    (file: File): string => {
      if (file.size > MAX_FILE_SIZE) {
        const message = 'File size exceeds 10MB limit';
        alert(message);
        return message;
      }

      const allowedTypes = isTemplate
        ? ALLOWED_TEMPLATE_TYPES
        : ALLOWED_IMAGE_TYPES;
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        const message = isTemplate
          ? 'Only PNG files are allowed for templates'
          : 'Only JPG, JPEG, and PNG files are allowed';
        alert(message);
        return message;
      }

      return '';
    },
    [isTemplate],
  );

  const onDrop = useCallback(
    (e: globalThis.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      setError('');

      const droppedFiles = e.dataTransfer?.files;
      if (droppedFiles && droppedFiles.length > 0) {
        const imageFile = Array.from(droppedFiles).find((file) =>
          isTemplate
            ? file.type === 'image/png'
            : file.type.startsWith('image/'),
        );

        if (imageFile) {
          const validationError = validateFile(imageFile);
          if (validationError) {
            setError(validationError);
            return;
          }

          setFile(imageFile);
          e.dataTransfer.clearData();
        }
      }
    },
    [setFile, isTemplate, validateFile],
  );

  useEffect(() => {
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('drop', onDrop);
    };
  }, [onDragOver, onDragLeave, onDrop]);

  return (
    <>
      <div
        className={`relative z-10 rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-300
        ${
          dragOver
            ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-300 dark:bg-indigo-950/40'
            : 'border-gray-300 bg-white dark:border-slate-600 dark:bg-slate-900'
        }
      `}>
        <input
          type="file"
          accept={isTemplate ? 'image/png' : 'image/jpeg,image/jpg,image/png'}
          id="upload"
          className="hidden"
          onChange={(e) => {
            setError('');
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              const validationError = validateFile(selectedFile);
              if (validationError) {
                setError(validationError);
                return;
              }
              setFile(selectedFile);
            }
          }}
        />
        <label htmlFor="upload" className="cursor-pointer">
          {file ? (
            <span className="font-medium">📷 {file.name}</span>
          ) : (
            <span className="text-muted">
              {isTemplate
                ? 'Click or drag a PNG template file here'
                : 'Click or drag a JPG or PNG photo here'}
            </span>
          )}
        </label>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {dragOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none select-none">
          <div
            className="absolute inset-0 bg-black opacity-80"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          <p className="relative z-10 text-white text-3xl font-semibold drop-shadow-lg">
            Drop anywhere on the screen
          </p>
        </div>
      )}
    </>
  );
}
