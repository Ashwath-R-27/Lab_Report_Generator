"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md bg-stone-900/40 border border-white/10 backdrop-blur-md p-8 rounded-[24px] shadow-2xl"
      >
        {/* Glow accent */}
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-400 mb-8 text-sm balance">
          The page you are looking for doesn't exist or has been moved to a different laboratory directory.
        </p>

        <Link 
          href="/dashboard"
          className="inline-block w-full py-3 px-6 text-sm font-medium text-white bg-blue-600 rounded-xl cursor-pointer hover:bg-blue-500 active:scale-[0.98] transition-all duration-200 select-none"
        >
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}