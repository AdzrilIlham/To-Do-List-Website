import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiGlobe, FiShield, FiZap, FiDatabase, FiCheckCircle, FiUser, FiMail, FiGithub } from 'react-icons/fi';

const techStack = [
  { name: 'React 19', desc: 'UI Framework modern', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40' },
  { name: 'Tailwind CSS v4', desc: 'Styling responsif & cepat', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/40' },
  { name: 'Supabase', desc: 'Backend & Autentikasi', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' },
  { name: 'Vite', desc: 'Build tool modern', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40' },
  { name: 'Framer Motion', desc: 'Animasi interaktif', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800/40' },
];

const features = [
  { icon: FiCheckCircle, title: 'Manajemen Tugas Interaktif', desc: 'Tambah, edit, tandai selesai, dan atur prioritas tugas harian dengan mudah.' },
  { icon: FiZap, title: 'Sistem Gamifikasi & XP', desc: 'Tingkatkan level dan dapatkan badge pencapaian setiap kali Anda menyelesaikan tugas.' },
  { icon: FiDatabase, title: 'Sinkronisasi Realtime', desc: 'Tugas tersimpan secara aman di Supabase dan dapat diakses dari mana saja.' },
  { icon: FiShield, title: 'Dukungan Cadangan Data', desc: 'Ekspor dan impor data tugas kapan saja untuk keamanan ekstra.' },
];

export default function About() {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-dark-text tracking-tight">Tentang Kami</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mengenal pengembang dan cerita dibalik pembuatan ToDoo</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 sm:p-8 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 relative z-10">
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-primary/20 dark:ring-primary/40 bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center shadow-md">
              {!imageError ? (
                <img
                  src="/profile.jpg"
                  alt="Adzril Ilham Ramadhan"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-3 text-center">
                  <FiUser className="w-12 h-12 text-primary mb-1" />
                  <span className="text-[10px] font-bold text-primary tracking-wider">ADZRIL</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
              Creator
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
                <FiCode size={12} /> Creator & Developer
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-text">
                Adzril Ilham Ramadhan
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Pengembang Tunggal Aplikasi ToDoo
              </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Halo! Saya adalah pembuat dan pengembang aplikasi <strong>ToDoo</strong>. Aplikasi ini saya rancang dan bangun sendiri secara mandiri untuk membantu pengguna mengelola kegiatan harian dengan lebih terstruktur, fokus, dan menyenangkan melalui sentuhan gamifikasi.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
              >
                <FiGithub size={14} /> GitHub
              </a>
              <a
                href="mailto:adzril774@gmail.com"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
              >
                <FiMail size={14} /> Kontak Email
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2">
          <FiGlobe className="text-primary" /> Mengapa ToDoo Dibuat?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-5 shadow-sm space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <item.icon size={18} />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-dark-text">{item.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 shadow-sm space-y-4"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text flex items-center gap-2">
          <FiCode className="text-primary" /> Teknologi yang Digunakan
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex flex-col gap-0.5 ${tech.color}`}
            >
              <span className="font-semibold">{tech.name}</span>
              <span className="text-[10px] opacity-80">{tech.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
