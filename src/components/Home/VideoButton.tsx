import React from 'react';

const ALLOWED_EXTS = ['.mp4', '.mov', '.webm', '.mp3'] as const;
const ALLOWED_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'audio/mpeg',
  'audio/mp3',
  'audio/mpeg3',
  'audio/x-mp3',
  'audio/x-mpeg',
] as const;
const MAX_SIZE_BYTES = 200 * 1024 * 1024;

type VideoButtonProps = {
  label: string;
  onFileSelect?: (file: File) => void;
  onValidationError?: (message: string) => void;
};

const VideoButton: React.FC<VideoButtonProps> = ({
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
      <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-3 group-hover/btn:bg-primary group-hover/btn:scale-110 transition-all duration-300 shadow-sm">
        <span className="material-icons-round text-4xl text-primary group-hover/btn:text-white">play_arrow</span>
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

export default VideoButton;
