"use client";

import { AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ErrorFallbackProps = {
    error: Error | null;
    onReset?: () => void;
    section?: string;
};

export default function ErrorFallback({
    error,
    onReset,
    section,
}: ErrorFallbackProps) {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center gap-4">
                <div className="p-3 bg-destructive/10 rounded-full">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-destructive">
                        {section ? `Error loading ${section}` : "Something went wrong"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                        {error?.message || "An unexpected error occurred. Please try again."}
                    </p>
                </div>

                <div className="flex items-center gap-3 mt-2">
                    {onReset && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onReset}
                            className="gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Try Again
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh Page
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
