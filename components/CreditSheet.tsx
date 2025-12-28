import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, RefreshCw, Calendar, ArrowUpRight } from 'lucide-react';

interface CreditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  credits: number;
}

export const CreditSheet: React.FC<CreditSheetProps> = ({ isOpen, onClose, credits }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-[#F9F9F9] w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
            <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
            </button>
            <h2 className="font-semibold text-lg">Usage</h2>
            <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
            {/* Credit Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 font-medium">Free Plan</span>
                    <button className="bg-black text-white text-xs px-3 py-1.5 rounded-full font-medium">Upgrade</button>
                </div>
                
                <div className="flex items-baseline gap-1 my-4">
                    <Sparkles className="text-gray-900 w-5 h-5 mr-1" />
                    <span className="text-3xl font-bold text-gray-900">{credits}</span>
                    <span className="text-gray-400 text-sm font-medium">credits available</span>
                </div>

                <div className="space-y-3">
                     <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <RefreshCw size={14} />
                            <span>Free credits</span>
                        </div>
                        <span>767</span>
                     </div>
                     <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>Daily refresh</span>
                        </div>
                        <span>300</span>
                     </div>
                </div>
            </div>

            {/* History */}
            <h3 className="font-bold text-lg mb-4 text-gray-900">Usage details</h3>
            <div className="space-y-6">
                {[
                    { title: "Research on AI Companies", date: "Wednesday", amount: -111 },
                    { title: "Generate Logo Concept", date: "Wednesday", amount: -19 },
                    { title: "Summarize Podcast", date: "Tuesday", amount: -109 },
                    { title: "Plan Travel Itinerary", date: "Tuesday", amount: -27 },
                    { title: "Python Script Debugging", date: "Monday", amount: -432 },
                ].map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                        <div>
                            <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.amount}</span>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                 <div>
                    <p className="font-medium text-sm">Bonus for new users</p>
                    <p className="text-xs text-gray-400 mt-1">Tuesday</p>
                 </div>
                 <span className="text-sm font-medium text-green-600">+1000</span>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
