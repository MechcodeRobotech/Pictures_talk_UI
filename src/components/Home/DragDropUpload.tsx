import React from 'react';

type DragDropUploadProps = {
  helperText: string;
};

const DragDropUpload: React.FC<DragDropUploadProps> = ({ helperText }) => {
  return (
    <label className="cursor-pointer">
      <div className="w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 hover:border-primary transition-all group/upload">
        <span className="material-icons-round text-slate-300 dark:text-slate-600 mb-3 text-4xl group-hover/upload:text-primary transition-colors">cloud_upload</span>
        <p className="text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
      </div>
      <input className="hidden" type="file" />
    </label>
  );
};

export default DragDropUpload;
