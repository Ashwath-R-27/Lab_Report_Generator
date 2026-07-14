"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type FloatingSelectOption = {
    value: string;
    label: string;
};

type FloatingSelectProps = {
    id: string;
    label: string;
    value: string;
    options: FloatingSelectOption[];
    onChange: (value: string) => void;
    required?: boolean;
};

export default function FloatingSelect({
    id,
    label,
    value,
    options,
    onChange,
    required,
}: FloatingSelectProps) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value) ?? null;
    const filled = Boolean(selected);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        if (open) {
            const idx = options.findIndex((o) => o.value === value);
            setActiveIndex(idx >= 0 ? idx : 0);
        }
    }, [open, options, value]);

    function handleKeyDown(e: React.KeyboardEvent) {
        if (!open) {
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
            }
            return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            const opt = options[activeIndex];
            if (opt) {
                onChange(opt.value);
                setOpen(false);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    }

    return (
        <div className="relative group" ref={rootRef}>
            <button
                type="button"
                id={id}
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                onClick={() => setOpen((o) => !o)}
                onKeyDown={handleKeyDown}
                className={`peer w-full bg-white/5 border rounded-xl px-4 pt-6 pb-2 text-left text-white outline-none transition-all duration-200 flex items-center justify-between ${
                    open
                        ? "border-indigo-500/80 ring-1 ring-indigo-500/30"
                        : "border-white/10"
                }`}
            >
                <span>{selected ? selected.label : "\u00A0"}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 shrink-0 text-white/40 transition-transform duration-200 ${
                        open ? "rotate-180 text-indigo-400" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <label
                htmlFor={id}
                className={`absolute left-4 top-4 text-white/40 text-sm transition-all duration-200 pointer-events-none origin-left ${
                    filled || open ? "-translate-y-2.5 scale-75" : "translate-y-0 scale-100"
                } ${open ? "text-indigo-400" : filled ? "text-indigo-400" : ""}`}
            >
                {label}
                {required && <span className="text-indigo-400/70">*</span>}
            </label>

            <AnimatePresence>
                {open && (
                    <motion.ul
                        role="listbox"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                    >
                        {options.map((opt, idx) => {
                            const isActive = idx === activeIndex;
                            const isSelected = opt.value === value;
                            return (
                                <li
                                    key={opt.value}
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseEnter={() => setActiveIndex(idx)}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                    className={`cursor-pointer px-4 py-3 text-sm transition-colors duration-100 ${
                                        isSelected
                                            ? "bg-indigo-500/20 text-white"
                                            : isActive
                                            ? "bg-white/5 text-white"
                                            : "text-white/70"
                                    }`}
                                >
                                    {opt.label}
                                </li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}