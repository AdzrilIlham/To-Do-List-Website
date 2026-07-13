export default function ProgressBar({ progress, showLabel = true, size = 'md' }) {
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getProgressColor = () => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{progress}%</span>
        </div>
      )}
      <div
        className={`w-full ${heightClasses[size]} bg-gray-200 dark:bg-dark-surface rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress ${progress}%`}
      >
        <div
          className={`${heightClasses[size]} ${getProgressColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
