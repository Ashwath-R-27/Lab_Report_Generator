"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import FloatingInput from "../components/Input";
import FloatingSelect, { FloatingSelectOption } from "../components/Select";
import BarcodeScannerModal from "../components/Scan";

const COURSE_OPTIONS: FloatingSelectOption[] = [
    { value: "cpp", label: "C++ Programming" },
    { value: "java", label: "Java Programming" },
    { value: "python", label: "Python OOP" },
];

export default function Lab310() {
    // Form States
    const [rollNo, setRollNo] = useState("");
    const [rollNoLocked, setRollNoLocked] = useState(false); // true once filled via scan
    const [scannerOpen, setScannerOpen] = useState(false);
    const [course, setCourse] = useState("");
    const [date, setDate] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ rollNo, course, date });
    };

    const handleScan = useCallback((value: string) => {
        setRollNo(value);
        setRollNoLocked(true);
        setScannerOpen(false);
    }, []);

    const handleClearScan = () => {
        setRollNo("");
        setRollNoLocked(false);
    };

    return (
        <div className="flex flex-col min-h-screen text-slate-100">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 p-5 px-8 text-white gap-6 flex items-center bg-gray-950/60 backdrop-blur-md font-bold border-b border-white/10">
                <div className="text-[15px] md:text-[20px] tracking-wide">23Z310 - OBJECT ORIENTED PROGRAMMING LABORATORY</div>
            </header>

            {/* Main Form Container */}
            <div className="pt-[100px] p-6 flex justify-center items-center flex-grow z-10">
                <motion.div
                    key="home-dashboard-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full max-w-lg"
                >
                    {/* Glassmorphic Form Card */}
                    <form
                        onSubmit={handleSubmit}
                        className="bg-black/40 border border-white/10 backdrop-blur-xl p-8 rounded-[24px] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col gap-8"
                    >
                        <div className="text-center">
                            <h2 className="text-xl font-semibold tracking-wide text-white/90">Report Generator</h2>
                            <p className="text-xs text-white/40 mt-1">Fill in the details to get your report.</p>
                        </div>

                        {/* INPUT 1: Roll No — typeable, or scanned + locked */}
                        <FloatingInput
                            id="rollNo"
                            label="Roll Number"
                            value={rollNo}
                            onChange={setRollNo}
                            required
                            readOnly={rollNoLocked}
                            rightSlot={
                                rollNoLocked ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-indigo-400" title="Locked — scanned value">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <rect x="4" y="10" width="16" height="10" rx="2" />
                                                <path d="M8 10V7a4 4 0 018 0v3" strokeLinecap="round" />
                                            </svg>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleClearScan}
                                            className="text-white/40 hover:text-white/80 transition-colors"
                                            title="Clear and type manually"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setScannerOpen(true)}
                                        className="text-white/40 hover:text-indigo-400 transition-colors"
                                        title="Scan barcode"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path d="M4 7V5a1 1 0 011-1h2M4 17v2a1 1 0 001 1h2M20 7V5a1 1 0 00-1-1h-2M20 17v2a1 1 0 01-1 1h-2M7 8v8M10 8v8M13 8v8M16 8v8" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )
                            }
                        />

                        {/* INPUT 2: Custom Select Dropdown */}
                        <FloatingSelect
                            id="course"
                            label="Select Lab Topic"
                            value={course}
                            onChange={setCourse}
                            options={COURSE_OPTIONS}
                            required
                        />

                        {/* INPUT 3: Date */}
                        <FloatingInput
                            id="date"
                            label="Select Date"
                            type="date"
                            value={date}
                            onChange={setDate}
                            required
                        />

                        {/* Action Button */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, translateY: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium py-3.5 rounded-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all duration-300"
                        >
                            Generate
                        </motion.button>
                    </form>
                </motion.div>
            </div>

            <BarcodeScannerModal
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onScan={handleScan}
            />
        </div>
    );
}