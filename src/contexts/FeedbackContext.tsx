import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type FeedbackType = 'worked' | 'not_worked';

export interface FeedbackEntry {
    id: string;
    targetId: string; // productId or recommendationId
    targetType: 'product' | 'recommendation';
    feedback: FeedbackType;
    contextData?: {
        crop?: string;
        stage?: string;
        symptoms?: string[];
    };
    timestamp: number;
}

interface FeedbackContextType {
    submitFeedback: (entry: Omit<FeedbackEntry, 'id' | 'timestamp'>) => void;
    getConfidenceScore: (targetId: string) => number; // Returns 0-100 score
    hasFeedback: (targetId: string) => FeedbackType | null;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [feedbackLogs, setFeedbackLogs] = useState<FeedbackEntry[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const savedLogs = localStorage.getItem('agricare_feedback_logs');
        if (savedLogs) {
            try {
                setFeedbackLogs(JSON.parse(savedLogs));
            } catch (e) {
                console.error("Failed to parse feedback logs", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('agricare_feedback_logs', JSON.stringify(feedbackLogs));
    }, [feedbackLogs]);

    const submitFeedback = (entry: Omit<FeedbackEntry, 'id' | 'timestamp'>) => {
        const newEntry: FeedbackEntry = {
            ...entry,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
        };

        setFeedbackLogs(prev => {
            // Remove existing feedback for the same target if it exists (allow changing vote)
            const filtered = prev.filter(item => item.targetId !== entry.targetId);
            return [...filtered, newEntry];
        });

        toast.success("Thanks for your feedback! This helps us improve.");
    };

    const getConfidenceScore = (targetId: string): number => {
        const targetLogs = feedbackLogs.filter(log => log.targetId === targetId);
        if (targetLogs.length === 0) return 0; // No data yet

        const positive = targetLogs.filter(log => log.feedback === 'worked').length;
        const total = targetLogs.length;

        // Simple percentage calculation
        return Math.round((positive / total) * 100);
    };

    const hasFeedback = (targetId: string): FeedbackType | null => {
        const log = feedbackLogs.find(l => l.targetId === targetId);
        return log ? log.feedback : null;
    };

    return (
        <FeedbackContext.Provider value={{ submitFeedback, getConfidenceScore, hasFeedback }}>
            {children}
        </FeedbackContext.Provider>
    );
};

export const useFeedback = () => {
    const context = useContext(FeedbackContext);
    if (context === undefined) {
        throw new Error('useFeedback must be used within a FeedbackProvider');
    }
    return context;
};
