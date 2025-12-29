import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, MoreVertical, Edit2, Trash2, Share2 } from 'lucide-react';
import { ChatHistory } from '../types';

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    chats: ChatHistory[];
    activeChat: string;
    onSelectChat: (id: string) => void;
    onRenameChat: (id: string, newTitle: string) => void;
    onDeleteChat: (id: string) => void;
    onShareChat: (id: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
    isOpen,
    onClose,
    chats,
    activeChat,
    onSelectChat,
    onRenameChat,
    onDeleteChat,
    onShareChat
}) => {
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [renaming, setRenaming] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const handleMenuAction = (chatId: string, action: 'rename' | 'delete' | 'share', e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuOpen(null);

        if (action === 'rename') {
            const chat = chats.find(c => c.id === chatId);
            if (chat) {
                setRenameValue(chat.title);
                setRenaming(chatId);
            }
        } else if (action === 'delete') {
            if (deleteConfirm === chatId) {
                onDeleteChat(chatId);
                setDeleteConfirm(null);
            } else {
                setDeleteConfirm(chatId);
                setTimeout(() => setDeleteConfirm(null), 3000);
            }
        } else if (action === 'share') {
            onShareChat(chatId);
        }
    };

    const handleRename = (chatId: string) => {
        if (renameValue.trim()) {
            onRenameChat(chatId, renameValue.trim());
        }
        setRenaming(null);
    };

    return (
        <>
            {/* Mobile Overlay Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed left-0 top-0 h-full w-full md:w-[260px] bg-white border-r border-gray-200 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h2 className="text-lg font-sans font-semibold text-gray-900">Chat History</h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Chat List - Ghost scrollbar (show on hover) */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
                            {chats.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No chat history yet</p>
                                </div>
                            ) : (
                                chats.map((chat) => (
                                    <div key={chat.id} className="relative">
                                        {/* Rename Input */}
                                        {renaming === chat.id ? (
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                <input
                                                    type="text"
                                                    value={renameValue}
                                                    onChange={(e) => setRenameValue(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleRename(chat.id);
                                                        if (e.key === 'Escape') setRenaming(null);
                                                    }}
                                                    onBlur={() => handleRename(chat.id)}
                                                    autoFocus
                                                    className="w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => {
                                                    onSelectChat(chat.id);
                                                    if (window.innerWidth < 768) onClose();
                                                }}
                                                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${chat.id === activeChat
                                                        ? 'bg-gray-100 border border-gray-200'
                                                        : 'hover:bg-gray-50 border border-transparent'
                                                    }`}
                                            >
                                                <MessageSquare
                                                    size={18}
                                                    className={chat.id === activeChat ? 'text-gray-900' : 'text-gray-400'}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium truncate ${chat.id === activeChat ? 'text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                        {chat.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {formatDate(chat.updatedAt)}
                                                    </p>
                                                </div>

                                                {/* Three-dot menu (show on hover) */}
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMenuOpen(menuOpen === chat.id ? null : chat.id);
                                                        }}
                                                        className="p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-gray-200 text-gray-400"
                                                    >
                                                        <MoreVertical size={14} />
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {menuOpen === chat.id && (
                                                        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                                                            <button
                                                                onClick={(e) => handleMenuAction(chat.id, 'rename', e)}
                                                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left text-sm text-gray-700"
                                                            >
                                                                <Edit2 size={14} />
                                                                Rename
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleMenuAction(chat.id, 'share', e)}
                                                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left text-sm text-gray-700"
                                                            >
                                                                <Share2 size={14} />
                                                                Share
                                                            </button>
                                                            <div className="border-t border-gray-100"></div>
                                                            <button
                                                                onClick={(e) => handleMenuAction(chat.id, 'delete', e)}
                                                                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm ${deleteConfirm === chat.id
                                                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                        : 'text-gray-700 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                <Trash2 size={14} />
                                                                {deleteConfirm === chat.id ? 'Click to confirm' : 'Delete'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100">
                            <p className="text-xs text-gray-400 text-center">
                                {chats.length} chat{chats.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        /* Ghost scrollbar - visible only on hover */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 3px;
        }
        .scrollbar-thin:hover::-webkit-scrollbar-thumb {
          background: rgb(209, 213, 219);
        }
        .scrollbar-thin:hover::-webkit-scrollbar-thumb:hover {
          background: rgb(156, 163, 175);
        }
      `}</style>
        </>
    );
};
