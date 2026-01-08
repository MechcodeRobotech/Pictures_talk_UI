import React from 'react';

type AudioButtonProps = {
  label: string;
};

const AudioButton: React.FC<AudioButtonProps> = ({ label }) => {
  return (
    <button className="flex flex-col items-center group/btn">
      <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3 group-hover/btn:bg-secondary group-hover/btn:scale-110 transition-all duration-300 shadow-sm">
        <span className="material-icons-round text-4xl text-secondary dark:text-blue-300 group-hover/btn:text-white">mic</span>
      </div>
      <span className="font-semibold text-secondary dark:text-slate-200">{label}</span>
    </button>
  );
};

export default AudioButton;
