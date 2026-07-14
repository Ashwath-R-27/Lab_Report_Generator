"use client";

import { useState } from "react";

type FloatingInputProps = {
    id: string;
    label: string;
    type?: "text" | "date";
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    readOnly?: boolean;
    /** Optional icon/button rendered inside the field on the right (e.g. a scan button). */
    rightSlot?: React.ReactNode;
};

export default function FloatingInput({
    id,
    label,
    type = "text",
    value,
    onChange,
    required,
    readOnly,
    rightSlot,
}: FloatingInputProps) {
    const [focused, setFocused] = useState(false);
    const floated = focused || value.length > 0;

    return (
        <div className="relative group">
            <input
                id={id}
                type={type}
                maxLength={6}
                value={value}
                readOnly={readOnly}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={`w-full uppercase bg-white/5 border rounded-xl px-4 pt-6 pb-2 text-white outline-none transition-all duration-200 [color-scheme:dark] ${
                    rightSlot ? "pr-12" : ""
                } ${
                    focused
                        ? "border-indigo-500/80 ring-1 ring-indigo-500/30"
                        : "border-white/10"
                } ${readOnly ? "cursor-default text-white/80" : ""}`}
                required={required}
            />
            <label
                htmlFor={id}
                className={`absolute left-4 text-white/40 text-sm transition-all duration-200 pointer-events-none origin-left ${
                    floated ? "top-2.5 -translate-y-0 scale-75" : "top-4 scale-100"
                } ${focused ? "text-indigo-400" : floated ? "text-indigo-400/80" : ""}`}
            >
                {label}
            </label>
            {rightSlot && (
                <div className="absolute right-3 top-0 flex h-full items-center">
                    {rightSlot}
                </div>
            )}
        </div>
    );
}