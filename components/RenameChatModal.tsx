import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RenameChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRename: (newTitle: string) => void;
    currentTitle: string;
}

export const RenameChatModal: React.FC<RenameChatModalProps> = ({
    isOpen,
    onClose,
    onRename,
    currentTitle
}) => {
    const [title, setTitle] = useState(currentTitle);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(currentTitle);
    }, [currentTitle, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Small timeout to allow animation to start/modal to render
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 50);
        }
    }, [isOpen]);

    const handleSave = () => {
        if (title.trim()) {
            onRename(title.trim());
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rename Chat</h3>
                    <input
                        ref={inputRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSave();
                            if (e.key === 'Escape') onClose();
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all text-gray-900 placeholder-gray-400"
                        placeholder="Chat title"
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors shadow-sm"
                        >
                            Save
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
