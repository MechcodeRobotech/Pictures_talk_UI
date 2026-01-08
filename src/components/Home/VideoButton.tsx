import React from 'react';

type VideoButtonProps = {
  label: string;
};

const VideoButton: React.FC<VideoButtonProps> = ({ label }) => {
  return (
    <button className="flex flex-col items-center group/btn">
      <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-3 group-hover/btn:bg-primary group-hover/btn:scale-110 transition-all duration-300 shadow-sm">
        <span className="material-icons-round text-4xl text-primary group-hover/btn:text-white">play_arrow</span>
      </div>
      <span className="font-semibold text-secondary dark:text-slate-200">{label}</span>
    </button>
  );
};

export default VideoButton;
