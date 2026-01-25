import React from 'react';
import { ThumbsUp, ThumbsDown, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFeedback, FeedbackType } from '@/contexts/FeedbackContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from "@/lib/utils";

interface FeedbackButtonsProps {
    targetId: string;
    targetType: 'product' | 'recommendation';
    contextData?: {
        crop?: string;
        stage?: string;
        symptoms?: string[];
    };
    className?: string;
    variant?: 'minimal' | 'full';
}

export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
    targetId,
    targetType,
    contextData,
    className,
    variant = 'full'
}) => {
    const { submitFeedback, hasFeedback } = useFeedback();
    const { language } = useLanguage();

    const currentVote = hasFeedback(targetId);

    const handleVote = (vote: FeedbackType) => {
        submitFeedback({
            targetId,
            targetType,
            feedback: vote,
            contextData
        });
    };

    const isWorked = currentVote === 'worked';
    const isNotWorked = currentVote === 'not_worked';

    if (variant === 'minimal') {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote('worked')}
                    className={cn(
                        "h-8 px-2 transition-all",
                        isWorked ? "bg-green-100 border-green-500 text-green-700 hover:bg-green-100" : "hover:bg-gray-100 text-gray-500"
                    )}
                >
                    <ThumbsUp className={cn("w-4 h-4 mr-1", isWorked && "fill-current")} />
                    {language === 'HI' ? 'फायदेमंद' : 'Worked'}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote('not_worked')}
                    className={cn(
                        "h-8 px-2 transition-all",
                        isNotWorked ? "bg-red-100 border-red-500 text-red-700 hover:bg-red-100" : "hover:bg-gray-100 text-gray-500"
                    )}
                >
                    <ThumbsDown className={cn("w-4 h-4 mr-1", isNotWorked && "fill-current")} />
                    {language === 'HI' ? 'बेअसर' : 'Failed'}
                </Button>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col sm:flex-row gap-3 p-4 bg-gray-50/80 rounded-xl border border-dashed border-gray-200", className)}>
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                    {language === 'HI' ? 'क्या यह सलाह मददगार थी?' : 'Did this recommendation help?'}
                </p>
                <p className="text-xs text-gray-500">
                    {language === 'HI' ? 'आपकी राय हमें बेहतर बनाने में मदद करती है' : 'Your feedback improves AI suggestions'}
                </p>
            </div>
            <div className="flex gap-2 shrink-0">
                <Button
                    variant={isWorked ? "default" : "outline"}
                    onClick={() => handleVote('worked')}
                    className={cn(
                        "gap-2 transition-all",
                        isWorked ? "bg-green-600 hover:bg-green-700 border-transparent shadow-md shadow-green-200" : "hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                    )}
                >
                    {isWorked ? <Check className="w-4 h-4" /> : <ThumbsUp className="w-4 h-4" />}
                    {language === 'HI' ? 'काम किया' : 'Worked'}
                </Button>
                <Button
                    variant={isNotWorked ? "destructive" : "outline"}
                    onClick={() => handleVote('not_worked')}
                    className={cn(
                        "gap-2 transition-all",
                        !isNotWorked && "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    )}
                >
                    {isNotWorked ? <X className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                    {language === 'HI' ? 'काम नहीं किया' : 'Did not work'}
                </Button>
            </div>
        </div>
    );
};
