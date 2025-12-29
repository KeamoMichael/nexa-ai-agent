import React, { useState } from 'react';
import { ChevronDown, Menu, Check } from 'lucide-react';
import { Model, MODELS } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatSettingsMenu } from './ChatSettingsMenu';

interface TopBarProps {
  currentModel: Model;
  setCurrentModel: (m: Model) => void;
  onToggleHistory: () => void;
  chatId: string;
  chatTitle: string;
  onRenameChat: (newTitle: string) => void;
  onDeleteChat: () => void;
  onShareChat: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentModel,
  setCurrentModel,
  onToggleHistory,
  chatId,
  chatTitle,
  onRenameChat,
  onDeleteChat,
  onShareChat
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#F9F9F9]/90 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {/* History Toggle Button */}
        <button
          onClick={onToggleHistory}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Toggle history"
        >
          <Menu size={20} className="text-gray-600" />
        </button>

        {/* Model Selector */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-800 hover:opacity-70 transition-opacity"
          >
            {currentModel.name}
            <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/5 z-10"
                />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden"
                >
                  {MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setCurrentModel(model);
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 relative"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{model.name}</span>
                        </div>
                        {currentModel.id === model.id && <Check size={16} className="text-black" />}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{model.description}</p>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Settings Menu */}
      <ChatSettingsMenu
        chatId={chatId}
        chatTitle={chatTitle}
        onRename={onRenameChat}
        onDelete={onDeleteChat}
        onShare={onShareChat}
      />
    </div>
  );
};