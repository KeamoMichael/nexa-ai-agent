import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Trash2, Share2, Check, X } from 'lucide-react';

interface ChatSettingsMenuProps {
    chatId: string;
    chatTitle: string;
    onRename: (newTitle: string) => void;
    onDelete: () => void;
    onShare: () => void;
}

export const ChatSettingsMenu: React.FC<ChatSettingsMenuProps> = ({
    chatId,
    chatTitle,
    onRename,
    onDelete,
    onShare
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTitle, setNewTitle] = useState(chatTitle);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    // Focus input when renaming
    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isRenaming]);

    const handleRename = () => {
        if (newTitle.trim() && newTitle !== chatTitle) {
            onRename(newTitle.trim());
        }
        setIsRenaming(false);
        setIsOpen(false);
    };

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
            {/* Rename Modal Overlay */}
            {isRenaming && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-sans font-semibold text-gray-900 mb-4">Rename Chat</h3>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename();
                                if (e.key === 'Escape') setIsRenaming(false);
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-900"
                            placeholder="Enter chat title"
                        />
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setIsRenaming(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRename}
                                className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl font-medium text-white transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Chat settings"
            >
                <MoreVertical size={20} className="text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-40 overflow-hidden">
                    <div className="py-1">
                        <button
                            onClick={() => setIsRenaming(true)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                        >
                            <Edit2 size={16} className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Rename</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                        >
                            <Share2 size={16} className="text-gray-500" />
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
                            <Trash2 size={16} className={deleteConfirm ? 'text-red-600' : 'text-gray-500'} />
                            <span className={`text-sm font-medium ${deleteConfirm ? 'text-red-600' : 'text-gray-700'}`}>
                                {deleteConfirm ? 'Click to confirm' : 'Delete'}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
