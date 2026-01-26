import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/contexts/LanguageContext';

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orderNumber: string;
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    orderNumber,
}) => {
    const { t } = useLanguage();

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-[400px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-display font-bold">
                        {t.orderTracking.confirmCancelTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="pt-2">
                        <span className="font-semibold text-foreground">
                            {t.orderTracking.orderId}: {orderNumber}
                        </span>
                        <br />
                        {t.orderTracking.confirmCancelMessage}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel onClick={onClose} className="rounded-xl border-2">
                        {t.orderTracking.details === 'विवरण' ? 'वापस जाएं' : 'Go Back'}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                    >
                        {t.orderTracking.cancelOrder}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
