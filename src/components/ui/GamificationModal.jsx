import { motion } from 'framer-motion';
import { FiLock, FiCheck } from 'react-icons/fi';
import Modal from './Modal';
import Avatar from './Avatar';
import { LEVELS } from '../../utils/avatarSystem';

export default function GamificationModal({ isOpen, onClose, score, level, nextLevel, progress, onTimeCount, lateCount }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profil Gamifikasi" size="md">
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Avatar level={level.level} size={80} />
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">{level.name}</h3>
            <p className="text-2xl font-bold text-primary mt-1">{score} EXP</p>
          </div>
        </div>

        <div className="space-y-2">
          {nextLevel ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {nextLevel.minPoints - score} EXP lagi untuk <span className="font-semibold">{nextLevel.name}</span>
            </p>
          ) : (
            <p className="text-xs text-yellow-500 font-semibold">Level Maksimum Tercapai!</p>
          )}
          <div className="w-full h-3 bg-gray-200 dark:bg-dark-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>0</span>
            <span>{nextLevel ? nextLevel.minPoints : level.minPoints}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{onTimeCount}</p>
            <p className="text-[10px] text-green-500 dark:text-green-400 font-medium">Tepat Waktu</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-red-500">{lateCount}</p>
            <p className="text-[10px] text-red-400 font-medium">Terlambat</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Tahapan Avatar</p>
          <div className="space-y-2">
            {LEVELS.map((lvl) => {
              const unlocked = score >= lvl.minPoints;
              const isActive = lvl.level === level.level;
              return (
                <div
                  key={lvl.level}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    isActive
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : unlocked
                        ? 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card'
                        : 'border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface opacity-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <Avatar level={lvl.level} size={44} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-dark-text">{lvl.name}</p>
                    <p className="text-[10px] text-gray-400">{lvl.minPoints} EXP</p>
                  </div>
                  <div className="flex-shrink-0">
                    {unlocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <FiCheck size={10} />
                        {isActive ? 'Aktif' : 'Tercapai'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 dark:bg-gray-700 text-gray-400">
                        <FiLock size={10} />
                        Terkunci
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}
