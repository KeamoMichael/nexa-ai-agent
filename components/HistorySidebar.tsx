import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, MoreVertical, Edit2, Trash2, Share2, Plus, Search } from 'lucide-react';
import { ChatHistory } from '../types';
import manusLogo from '../assets/manus logo.png';

interface HistorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    chats: ChatHistory[];
    activeChat: string;
    onSelectChat: (id: string) => void;
    onRenameChat: (id: string, newTitle: string) => void;
    onDeleteChat: (id: string) => void;
    onShareChat: (id: string) => void;
    onNewChat: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
    isOpen,
    onClose,
    chats,
    activeChat,
    onSelectChat,
    onRenameChat,
    onDeleteChat,
    onShareChat,
    onNewChat
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

    const SidebarContent = () => (
        <>
            {/* Header with Logo */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <img src={manusLogo} alt="Manus" className="w-6 h-6" />
                <span className="text-base font-sans font-semibold text-gray-900">manus</span>
            </div>

            {/* Action Buttons */}
            <div className="p-3 space-y-2 border-b border-gray-100">
                <button
                    onClick={() => {
                        onNewChat();
                        if (window.innerWidth < 768) onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                        <Plus size={18} className="text-gray-600 group-hover:text-gray-900" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">New task</span>
                </button>

                <button
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                        <Search size={18} className="text-gray-600 group-hover:text-gray-900" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Search</span>
                </button>
            </div>

            {/* Chat List - Ghost scrollbar */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {chats.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <MessageSquare size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="text-xs">No chats yet</p>
                    </div>
                ) : (
                    chats.map((chat) => (
                        <div key={chat.id} className="relative">
                            {renaming === chat.id ? (
                                <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-200">
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
                                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all ${chat.id === activeChat
                                            ? 'bg-gray-100'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <MessageSquare
                                        size={16}
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

                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMenuOpen(menuOpen === chat.id ? null : chat.id);
                                            }}
                                            className="p-1 rounded transition-all opacity-0 group-hover:opacity-100 hover:bg-gray-200"
                                        >
                                            <MoreVertical size={14} className="text-gray-600" />
                                        </button>

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
            <div className="p-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                    {chats.length} chat{chats.length !== 1 ? 's' : ''}
                </p>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Backdrop */}
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

            {/* Desktop Sidebar - Part of flow, animates width */}
            <motion.div
                initial={false}
                animate={{
                    width: isOpen ? '260px' : '0px',
                    transition: { type: 'spring', damping: 30, stiffness: 300 }
                }}
                className="hidden md:flex flex-col bg-white border-r border-gray-200 overflow-hidden h-full"
            >
                <div className="w-[260px] h-full flex flex-col">
                    <SidebarContent />
                </div>
            </motion.div>

            {/* Mobile Sidebar - Fixed overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed left-0 top-0 h-full w-[260px] bg-white border-r border-gray-200 z-50 flex flex-col shadow-lg md:hidden"
                    >
                        <SidebarContent />
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        /* Ghost scrollbar - visible only on hover */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 3px;
        }
        .overflow-y-auto:hover::-webkit-scrollbar-thumb {
          background: rgb(209, 213, 219);
        }
        .overflow-y-auto:hover::-webkit-scrollbar-thumb:hover {
          background: rgb(156, 163, 175);
        }
      `}</style>
        </>
    );
};
