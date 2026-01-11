"use client";

import { useState } from "react";
import { WifiOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type OfflineBannerProps = {
    isOffline: boolean;
};

export default function OfflineBanner({ isOffline }: OfflineBannerProps) {
    const [dismissed, setDismissed] = useState(false);

    if (!isOffline || dismissed) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-[1000] bg-amber-500 dark:bg-amber-600 text-white px-4 py-2 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/20 rounded-full">
                        <WifiOff className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium">
                        You&apos;re offline. Showing cached data.
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDismissed(true)}
                    className="h-7 w-7 hover:bg-white/20 text-white"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
