"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Card from "./componets/Cards";

export default function Home() {
    const [currentView, setCurrentView] = useState("home");

    // VIEW 1: LABS GRID
    if (currentView === "labs") {
        return (
            <div className="flex flex-col min-h-screen">
                {/* DYNAMIC FIXED HEADER */}
                <header className="fixed top-0 left-0 w-full z-50 p-5 px-8 text-white gap-6 flex items-center bg-gray-950/60 backdrop-blur-md font-bold border-b border-gray-100/50">
                    <div className="text-[22px]">Lab Report Generator</div>
                </header>

                {/* Main page content body padded below fixed header bounds */}
                <div className="pt-[84px] p-6">
                    <button 
                        type="button"
                        onClick={() => setCurrentView("home")} 
                        className="mb-6 text-sm text-rose-400 font-medium py-2 px-4 bg-stone-800 rounded-md cursor-pointer active:scale-95 transition-transform"
                    >
                        ← Back to Dashboard
                    </button>
                    
                    <motion.div 
                        key="labs-grid-view" 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5"
                    >
                        <Card head="Object Oriented Programming" para="23Z310 - Object Oriented Programming Laboratory" link="/dashboard/Lab/23Z310" />
                        <Card head="Data Structures" para="23Z311 - Data Structures Laboratory" link="/dashboard/Lab/23Z311" />
                    </motion.div>
                </div>
            </div>
        );
    }

    // VIEW 2: DEFAULT HOME DASHBOARD
    return (
        <div className="flex flex-col min-h-screen">
            {/* DYNAMIC FIXED HEADER */}
            <header className="fixed top-0 left-0 w-full z-50 p-5 px-8 text-white gap-6 flex items-center bg-gray-950/60 backdrop-blur-md font-bold border-b border-gray-100/50">
                <div className="text-[22px]">Home Page</div>
            </header>

            {/* Main page content body padded below fixed header bounds */}
            <div className="pt-[104px] p-6">
                <motion.div 
                    key="home-dashboard-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5"
                >
                    <button 
                        type="button"
                        onClick={() => setCurrentView("labs")}
                        className="group relative block text-left w-full overflow-hidden bg-black/50 rounded-[20px] ring-1 ring-gray-200 ring-inset cursor-pointer transform-gpu active:scale-[0.98] select-none text-white"
                    >
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[200%] aspect-square rounded-full bg-rose-600/90 opacity-0 scale-0 transition-all duration-600 ease-out md:group-hover:scale-100 md:group-hover:opacity-100 pointer-events-none" />

                        <div className="relative z-10 p-[25px]">
                            <h3 className="py-2 font-bold text-[20px]">Lab Report Generator</h3>
                            <p className="text-sm text-gray-300">Generate your reports here.</p>
                        </div>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}