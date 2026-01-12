import React from 'react';

const Sentiment: React.FC = () => (
  <div>
    <h4 className="font-bold text-secondary dark:text-white mb-4 flex items-center">
      <span className="material-icons-round text-lg mr-2 text-primary">bar_chart</span>
      Sentiment
    </h4>
    <div className="flex items-center gap-2 mb-3">
      <span className="material-icons-round text-green-500 text-sm">sentiment_satisfied_alt</span>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 w-[70%]"></div>
      </div>
      <span className="text-xs text-slate-400 dark:text-slate-500">70%</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="material-icons-round text-red-400 text-sm">sentiment_dissatisfied</span>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-red-400 w-[10%]"></div>
      </div>
      <span className="text-xs text-slate-400 dark:text-slate-500">10%</span>
    </div>
  </div>
);

export default Sentiment;
