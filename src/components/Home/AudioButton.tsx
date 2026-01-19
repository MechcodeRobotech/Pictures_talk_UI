import React from 'react';

const ALLOWED_EXTS = ['.mp3', '.wav', '.m4a', '.ogg'] as const;
const ALLOWED_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/mpeg3',
  'audio/x-mp3',
  'audio/x-mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/ogg',
  'application/ogg',
] as const;
const MIN_SIZE_BYTES = 50 * 1024;
const MAX_SIZE_BYTES = 200 * 1024 * 1024;

type AudioButtonProps = {
  label: string;
  onFileSelect?: (file: File) => void;
  onValidationError?: (message: string) => void;
};

const AudioButton: React.FC<AudioButtonProps> = ({
  label,
  onFileSelect,
  onValidationError,
}) => {
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
    if (file.size < MIN_SIZE_BYTES) {
      return `File size must be at least ${Math.round(MIN_SIZE_BYTES / 1024)}KB`;
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

  return (
    <label className="flex flex-col items-center group/btn cursor-pointer">
      <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover/btn:bg-secondary group-hover/btn:scale-110 transition-all duration-300 shadow-sm">
        <span className="material-icons-round text-4xl text-secondary dark:text-blue-300 group-hover/btn:text-white">mic</span>
      </div>
      <span className="font-semibold text-secondary dark:text-slate-200">{label}</span>
      <input
        className="hidden"
        type="file"
        multiple={false}
        accept={`${acceptTypes},${acceptExts}`}
        onChange={handleChange}
      />
    </label>
  );
};

export default AudioButton;
