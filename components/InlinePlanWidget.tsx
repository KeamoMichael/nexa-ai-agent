import React, { useState } from 'react';
import { Search, Globe, Terminal, Loader2, CheckCircle, Circle, FileText } from 'lucide-react';
import { Plan } from '../types';
import taskCompleteIcon from '../assets/task complete2.png';

interface InlinePlanWidgetProps {
    plan: Plan;
}

export const InlinePlanWidget: React.FC<InlinePlanWidgetProps> = ({ plan }) => {
    // Helper to determine icon based on log text
    const getLogIcon = (text: string, isCompleted: boolean) => {
        const lower = text.toLowerCase();
        const iconClass = isCompleted ? "text-gray-400" : "text-gray-500";

        if (lower.includes('searching') || lower.includes('google')) return <Search size={12} className={iconClass} />;
        if (lower.includes('browsing') || lower.includes('reading') || lower.includes('navigating')) return <Globe size={12} className={iconClass} />;
        if (lower.includes('executing') || lower.includes('command') || lower.includes('running')) return <Terminal size={12} className={iconClass} />;
        if (lower.includes('writing') || lower.includes('editing') || lower.includes('saving')) return <FileText size={12} className={iconClass} />;

        // Default fallback
        if (isCompleted) return <CheckCircle size={12} className="text-gray-400" />;
        return <Loader2 size={12} className="text-gray-400 animate-spin" />;
    };

    const activeStep = plan.steps.find(s => s.status === 'active') || plan.steps[plan.steps.length - 1];

    return (
        <div className="w-full max-w-full my-3">
            {/* Steps List */}
            <div className="space-y-0 relative ml-0.5">
                {/* Vertical Guide Line */}
                <div className="absolute left-[8px] top-2 bottom-4 w-[1px] bg-gray-100" />

                {plan.steps.map((step) => {
                    const isActive = step.status === 'active';
                    const isCompleted = step.status === 'completed';

                    return (
                        <div key={step.id} className="relative pb-5 last:pb-0">
                            <div className="flex items-start gap-4 relative z-10">
                                {/* Step Icon */}
                                <div className="mt-0.5 bg-transparent">
                                    {isCompleted ? (
                                        <img src={taskCompleteIcon} alt="Complete" className="w-[18px] h-[18px] object-contain" />
                                    ) : isActive ? (
                                        <Circle size={18} className="text-gray-300 stroke-[2px]" />
                                    ) : (
                                        <Circle size={18} className="text-gray-100 stroke-[1px]" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Step Description */}
                                    <p className={`text-[14px] leading-snug ${isActive ? 'bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800 bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent font-medium' : isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {step.description}
                                    </p>
                                    {/* Logs - History view (Pill Container for both states) */}
                                    {(isActive || isCompleted) && step.logs.length > 0 && (
                                        <div className="mt-3">
                                            <div className={`border-[1.5px] rounded-xl px-3 py-2.5 space-y-2.5 ${isActive ? 'bg-white border-gray-100 shadow-sm' : 'bg-[#F9F9F9] border-gray-200/60'}`}>
                                                {step.logs.map((log, i) => (
                                                    <div key={i} className={`flex items-center gap-2.5 text-xs font-mono animate-in fade-in slide-in-from-top-1 duration-300 ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                                                        <div className="shrink-0">
                                                            {getLogIcon(log, isCompleted)}
                                                        </div>
                                                        <span className="truncate">{log}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Thinking Indicator */}
            {!plan.isComplete && (
                <div className="flex items-center gap-2 mt-4 ml-0.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-gray-400">Processing...</span>
                </div>
            )}
        </div>
    );
};