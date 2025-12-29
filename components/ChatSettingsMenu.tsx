import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, Share2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatSettingsMenuProps {
    chatId: string;
    chatTitle: string;
    onOpenRename: () => void;
    onDelete: () => void;
    onShare: () => void;
}

export const ChatSettingsMenu: React.FC<ChatSettingsMenuProps> = ({
    chatId,
    chatTitle,
    onOpenRename,
    onDelete,
    onShare
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setDeleteConfirm(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleDelete = () => {
        if (deleteConfirm) {
            onDelete();
            setIsOpen(false);
        } else {
            setDeleteConfirm(true);
            setTimeout(() => setDeleteConfirm(false), 3000);
        }
    };

    const handleShare = () => {
        onShare();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Menu Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Chat settings"
            >
                <MoreVertical size={20} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-40 overflow-hidden">
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    onOpenRename();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group/btn"
                            >
                                <Edit2 size={16} className="text-gray-400 group-hover/btn:text-gray-700" />
                                <span className="text-sm font-medium text-gray-700">Rename</span>
                            </button>

                            <button
                                onClick={handleShare}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group/btn"
                            >
                                <Share2 size={16} className="text-gray-400 group-hover/btn:text-gray-700" />
                                <span className="text-sm font-medium text-gray-700">Share</span>
                            </button>

                            <div className="border-t border-gray-100 my-1"></div>

                            <button
                                onClick={handleDelete}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${deleteConfirm
                                    ? 'bg-red-50 hover:bg-red-100'
                                    : 'hover:bg-gray-50'
                                    }`}
                            >
                                <Trash2 size={16} className={deleteConfirm ? 'text-red-600' : 'text-gray-400'} />
                                <span className={`text-sm font-medium ${deleteConfirm ? 'text-red-600' : 'text-gray-700'}`}>
                                    {deleteConfirm ? 'Click to confirm' : 'Delete'}
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
