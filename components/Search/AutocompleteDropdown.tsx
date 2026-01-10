"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Suggestion } from "@/types/types";

type AutocompleteDropdownProps = {
    suggestions: Suggestion[];
    loading: boolean;
    onSelect: (suggestion: Suggestion) => void;
    onClose: () => void;
    highlightText?: string;
};

export default function AutocompleteDropdown({
    suggestions,
    loading,
    onSelect,
    onClose,
    highlightText = "",
}: AutocompleteDropdownProps) {
    const [activeIndex, setActiveIndex] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);

    // Reset active index when suggestions change
    useEffect(() => {
        setActiveIndex(-1);
    }, [suggestions]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (suggestions.length === 0) return;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev < suggestions.length - 1 ? prev + 1 : 0
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev > 0 ? prev - 1 : suggestions.length - 1
                    );
                    break;
                case "Enter":
                    e.preventDefault();
                    if (activeIndex >= 0 && activeIndex < suggestions.length) {
                        onSelect(suggestions[activeIndex]);
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [suggestions, activeIndex, onSelect, onClose]);

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const activeItem = listRef.current.children[activeIndex] as HTMLElement;
            activeItem?.scrollIntoView({ block: "nearest" });
        }
    }, [activeIndex]);

    // Highlight matching text
    const highlightMatch = (text: string) => {
        if (!highlightText) return text;

        const regex = new RegExp(`(${highlightText})`, "gi");
        const parts = text.split(regex);

        return parts.map((part, i) =>
            regex.test(part) ? (
                <span key={i} className="font-semibold text-primary">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    if (loading) {
        return (
            <div className="bg-card border rounded-xl shadow-xl p-4">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Searching locations...</span>
                </div>
            </div>
        );
    }

    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="bg-card border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <ul
                ref={listRef}
                className="max-h-[300px] overflow-y-auto"
                role="listbox"
            >
                {suggestions.map((suggestion, index) => (
                    <li
                        key={`${suggestion.lat}-${suggestion.lng}`}
                        role="option"
                        aria-selected={index === activeIndex}
                        className={`
              flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
              ${index === activeIndex
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted"
                            }
              ${index !== suggestions.length - 1 ? "border-b border-border/50" : ""}
            `}
                        onClick={() => onSelect(suggestion)}
                        onMouseEnter={() => setActiveIndex(index)}
                    >
                        <div className="shrink-0 p-1.5 bg-muted rounded-full">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm truncate">
                            {highlightMatch(suggestion.display)}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="px-4 py-2 bg-muted/50 border-t text-[10px] text-muted-foreground flex items-center justify-between">
                <span>↑↓ to navigate</span>
                <span>Enter to select</span>
                <span>Esc to close</span>
            </div>
        </div>
    );
}
