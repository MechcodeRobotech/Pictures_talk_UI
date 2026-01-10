import React, { useRef, useState } from 'react';

const ALLOWED_EXTS = ['.mp3', '.wav', '.m4a', '.mp4', '.mov', '.webm'] as const;
const ALLOWED_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/mpeg3',
  'audio/x-mp3',
  'audio/x-mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/webm',
  'video/mp4',
  'video/quicktime',
  'video/webm',
] as const;
const MAX_SIZE_BYTES = 200 * 1024 * 1024;
const CHUNK_SIZE = 1024 * 1024;
const UPLOAD_DIR = 'uploads';

type DragDropUploadProps = {
  helperText: string;
  selectedFileName?: string | null;
  onFileSelect?: (file: File) => void;
  onValidationError?: (message: string) => void;
  onClear?: () => void;
};

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  helperText,
  selectedFileName,
  onFileSelect,
  onValidationError,
  onClear,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const acceptTypes = ALLOWED_TYPES.join(',');
  const acceptExts = ALLOWED_EXTS.join(',');

  const validateFile = (file: File) => {
    const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
    if (!ALLOWED_EXTS.includes(extension as (typeof ALLOWED_EXTS)[number])) {
      return `Unsupported file extension: ${extension}`;
    }
    const normalizedType = file.type.toLowerCase().split(';')[0];
    if (normalizedType && !ALLOWED_TYPES.includes(normalizedType as (typeof ALLOWED_TYPES)[number])) {
      return `Unsupported file type: ${file.type || 'unknown'}`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File size exceeds ${Math.round(MAX_SIZE_BYTES / (1024 * 1024))}MB limit`;
    }
    return null;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      onValidationError?.(error);
      event.target.value = '';
      return;
    }
    onFileSelect?.(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 1) {
      onValidationError?.('Please upload only one file.');
      return;
    }
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      onValidationError?.(error);
      return;
    }
    onFileSelect?.(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onClear?.();
  };

  return (
    <label
      className="cursor-pointer relative block"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      <div
        className={`w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 hover:border-primary transition-all group/upload ${
          isDragging ? 'border-primary bg-gray-50 dark:bg-white/5' : ''
        }`}
      >
        <span className="material-icons-round text-slate-300 dark:text-slate-600 mb-3 text-4xl group-hover/upload:text-primary transition-colors">cloud_upload</span>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[90%]" title={selectedFileName ?? helperText}>
          {selectedFileName ?? helperText}
        </p>
      </div>
      {selectedFileName && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 text-slate-400 hover:text-red-500 shadow-sm flex items-center justify-center transition-colors"
          aria-label="Clear selected file"
        >
          <span className="material-icons-round text-base">close</span>
        </button>
      )}
      <input
        className="hidden"
        type="file"
        multiple={false}
        accept={`${acceptTypes},${acceptExts}`}
        onChange={handleChange}
        ref={inputRef}
      />
    </label>
  );
};

export default DragDropUpload;
