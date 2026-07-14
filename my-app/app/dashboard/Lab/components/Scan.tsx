"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type BarcodeScannerModalProps = {
    open: boolean;
    onClose: () => void;
    onScan: (value: string) => void;
};

const SCANNER_REGION_ID = "roll-no-barcode-scanner-region";

export default function BarcodeScannerModal({ open, onClose, onScan }: BarcodeScannerModalProps) {
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scannerRef = useRef<any>(null);
    // Tracks whether `instance.start()` has actually resolved, so we never
    // call `.stop()` on a scanner that isn't running (or is already stopped).
    const isRunningRef = useRef(false);

    useEffect(() => {
        if (!open) return;

        let cancelled = false;
        setError(null);

        // Stops + clears the scanner exactly once, guarded by isRunningRef.
        // Safe to call multiple times (success callback, close button, unmount)
        // without ever throwing "Cannot stop, scanner is not running or paused".
        const safeStop = async () => {
            const instance = scannerRef.current;
            if (!instance || !isRunningRef.current) return;
            isRunningRef.current = false;
            try {
                await instance.stop();
                await instance.clear();
            } catch {
                // scanner was already stopped/cleared — nothing to do
            } finally {
                if (scannerRef.current === instance) {
                    scannerRef.current = null;
                }
            }
        };

        // html5-qrcode is loaded dynamically so this component only pulls it in
        // when the scanner is actually opened.
        import("html5-qrcode")
            .then(({ Html5Qrcode }) => {
                if (cancelled) return;
                const instance = new Html5Qrcode(SCANNER_REGION_ID);
                scannerRef.current = instance;

                const decodeSuccess = (decodedText: string) => {
                    onScan(decodedText);
                    void safeStop();
                };
                const decodeErrorNoop = () => {
                    // per-frame decode errors are expected while aiming — ignore
                };
                const config = { fps: 10, qrbox: { width: 260, height: 140 } };

                const onStarted = () => {
                    if (cancelled) {
                        // modal was closed while the camera was still starting up
                        void safeStop();
                    } else {
                        isRunningRef.current = true;
                    }
                };

                // Try the simple facingMode request first...
                instance
                    .start({ facingMode: "environment" }, config, decodeSuccess, decodeErrorNoop)
                    .then(onStarted)
                    .catch(async (err: unknown) => {
                        if (cancelled) return;

                        // ...if the device rejects that exact constraint (common on some
                        // Android/Chrome combinations — throws OverconstrainedError even
                        // when a rear camera exists), fall back to enumerating cameras
                        // and picking one explicitly by deviceId.
                        try {
                            const cameras = await Html5Qrcode.getCameras();
                            if (!cameras || cameras.length === 0) {
                                throw new Error("no-camera-found");
                            }
                            const rear =
                                cameras.find((c: { label: string }) => /back|rear|environment/i.test(c.label)) ??
                                cameras[cameras.length - 1];

                            await instance.start(rear.id, config, decodeSuccess, decodeErrorNoop);
                            onStarted();
                        } catch (fallbackErr: unknown) {
                            if (cancelled) return;
                            const name =
                                (err as { name?: string })?.name ??
                                (fallbackErr as { name?: string })?.name ??
                                "UnknownError";

                            const messages: Record<string, string> = {
                                NotAllowedError:
                                    "Camera permission is blocked for this site. Check your browser's site settings and allow camera access.",
                                NotFoundError:
                                    "No camera was found on this device.",
                                NotReadableError:
                                    "The camera is already in use by another app or tab. Close it and try again.",
                                OverconstrainedError:
                                    "Couldn't find a matching rear camera on this device.",
                                "no-camera-found": "No camera was found on this device.",
                            };

                            setError(
                                messages[name] ??
                                    `Couldn't access the camera (${name}). Make sure you're on HTTPS and camera permission is allowed.`
                            );
                        }
                    });
            })
            .catch(() => {
                setError("Scanner failed to load. Make sure the html5-qrcode package is installed.");
            });

        return () => {
            cancelled = true;
            void safeStop();
        };
    }, [open, onScan]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm bg-black/60 border border-white/10 backdrop-blur-xl rounded-[24px] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 flex flex-col gap-4"
                    >
                        <div className="text-center">
                            <h3 className="text-base font-semibold text-white/90">Scan Roll Number</h3>
                            <p className="text-xs text-white/40 mt-1">Align the barcode within the frame</p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-indigo-500/40">
                            <div id={SCANNER_REGION_ID} className="w-full [&_video]:w-full [&_video]:rounded-xl" />
                        </div>

                        {error && (
                            <p className="text-xs text-rose-400 text-center">{error}</p>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full bg-white/5 border border-white/10 text-white/80 font-medium py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}