import { motion } from 'framer-motion';

export default function StatisticsCard({ title, value, icon: Icon, color = 'bg-primary', subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-dark-text">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
