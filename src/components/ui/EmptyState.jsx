export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-dark-surface flex items-center justify-center mb-6">
          <Icon size={40} className="text-gray-300 dark:text-gray-600" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {title || 'Belum ada tugas'}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-sm">
        {description || 'Belum ada tugas. Tambahkan tugas pertamamu.'}
      </p>
    </div>
  );
}
