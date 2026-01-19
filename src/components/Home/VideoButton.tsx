import React from 'react';

const ALLOWED_EXTS = ['.mp4', '.ogg'] as const;
const ALLOWED_TYPES = [
  'video/mp4',
  'video/ogg',
  'application/ogg',
] as const;
const MIN_SIZE_BYTES = 50 * 1024;
const MAX_VIDEO_SIZE_FREE_BYTES = 100 * 1024 * 1024;
const MAX_VIDEO_SIZE_PRO_BYTES = Math.round(1.5 * 1024 * 1024 * 1024);
const USER_PLAN = (import.meta.env.VITE_USER_PLAN || '').toLowerCase();
const IS_PRO_PLAN = ['pro', 'business', 'enterprise'].includes(USER_PLAN);
const MAX_SIZE_BYTES = IS_PRO_PLAN ? MAX_VIDEO_SIZE_PRO_BYTES : MAX_VIDEO_SIZE_FREE_BYTES;

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
