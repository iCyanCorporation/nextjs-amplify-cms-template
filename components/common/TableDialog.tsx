"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface TableDialogProps {
    isOpen: boolean;
    onClose: () => void;
    tableHtml: string;
    tableTitle?: string;
}

export function TableDialog({ isOpen, onClose, tableHtml, tableTitle }: TableDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] w-full">
                <DialogTitle className="text-xl font-bold">
                    {tableTitle || "Table View"}
                </DialogTitle>

                <div
                    className="markdownContent w-full max-w-[90vw] max-h-[70vh]"
                    dangerouslySetInnerHTML={{ __html: tableHtml }}
                />
            </DialogContent>
        </Dialog>
    );
}
