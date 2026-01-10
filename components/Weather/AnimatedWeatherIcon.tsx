"use client";

import { useEffect, useState } from "react";

type AnimatedWeatherIconProps = {
    weatherId: number;
    isNight?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
};

const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
};

export default function AnimatedWeatherIcon({
    weatherId,
    isNight = false,
    size = "md",
    className = "",
}: AnimatedWeatherIconProps) {
    const iconSize = sizeMap[size];
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div style={{ width: iconSize, height: iconSize }} />;
    }

    // Determine weather type from OpenWeatherMap codes
    const getWeatherType = (id: number) => {
        if (id >= 200 && id < 300) return "thunderstorm";
        if (id >= 300 && id < 400) return "drizzle";
        if (id >= 500 && id < 600) return "rain";
        if (id >= 600 && id < 700) return "snow";
        if (id >= 700 && id < 800) return "fog";
        if (id === 800) return "clear";
        if (id > 800 && id < 900) return "clouds";
        return "clear";
    };

    const weatherType = getWeatherType(weatherId);

    return (
        <div
            className={`relative ${className}`}
            style={{ width: iconSize, height: iconSize }}
        >
            <svg
                viewBox="0 0 100 100"
                width={iconSize}
                height={iconSize}
                className="overflow-visible"
            >
                <defs>
                    {/* Gradients */}
                    <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                    <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E8E8E8" />
                        <stop offset="100%" stopColor="#B8B8B8" />
                    </linearGradient>
                    <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F0F0F0" />
                        <stop offset="100%" stopColor="#D0D0D0" />
                    </linearGradient>
                    <linearGradient id="darkCloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8E99A4" />
                        <stop offset="100%" stopColor="#5C6670" />
                    </linearGradient>
                    <linearGradient id="rainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4FC3F7" />
                        <stop offset="100%" stopColor="#2196F3" />
                    </linearGradient>
                    <linearGradient id="snowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="100%" stopColor="#E3F2FD" />
                    </linearGradient>
                </defs>

                <style>
                    {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.6; }
            }
            @keyframes float {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(5px); }
            }
            @keyframes fall {
              0% { transform: translateY(-10px); opacity: 0; }
              20% { opacity: 1; }
              100% { transform: translateY(30px); opacity: 0; }
            }
            @keyframes flash {
              0%, 90%, 100% { opacity: 0; }
              92%, 95% { opacity: 1; }
            }
            @keyframes drift {
              0%, 100% { opacity: 0.7; transform: translateX(-3px); }
              50% { opacity: 0.4; transform: translateX(3px); }
            }
            .sun-rays { animation: spin 20s linear infinite; transform-origin: 50px 50px; }
            .sun-core { animation: pulse 3s ease-in-out infinite; }
            .moon { animation: pulse 4s ease-in-out infinite; }
            .cloud { animation: float 4s ease-in-out infinite; }
            .cloud-2 { animation: float 5s ease-in-out infinite; animation-delay: 1s; }
            .rain-drop { animation: fall 1s linear infinite; }
            .rain-drop-1 { animation-delay: 0s; }
            .rain-drop-2 { animation-delay: 0.2s; }
            .rain-drop-3 { animation-delay: 0.4s; }
            .rain-drop-4 { animation-delay: 0.6s; }
            .rain-drop-5 { animation-delay: 0.8s; }
            .snow-flake { animation: fall 2s linear infinite; }
            .snow-flake-1 { animation-delay: 0s; }
            .snow-flake-2 { animation-delay: 0.5s; }
            .snow-flake-3 { animation-delay: 1s; }
            .snow-flake-4 { animation-delay: 1.5s; }
            .lightning { animation: flash 3s linear infinite; }
            .fog-layer { animation: drift 4s ease-in-out infinite; }
            .fog-layer-2 { animation-delay: 1s; }
            .fog-layer-3 { animation-delay: 2s; }
          `}
                </style>

                {/* Clear Sky */}
                {weatherType === "clear" && !isNight && (
                    <g>
                        {/* Sun rays */}
                        <g className="sun-rays">
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                                <line
                                    key={i}
                                    x1="50"
                                    y1="15"
                                    x2="50"
                                    y2="25"
                                    stroke="#FFD700"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    transform={`rotate(${angle} 50 50)`}
                                />
                            ))}
                        </g>
                        {/* Sun core */}
                        <circle
                            className="sun-core"
                            cx="50"
                            cy="50"
                            r="18"
                            fill="url(#sunGradient)"
                        />
                    </g>
                )}

                {/* Clear Night */}
                {weatherType === "clear" && isNight && (
                    <g className="moon">
                        <circle cx="50" cy="50" r="20" fill="url(#moonGradient)" />
                        <circle cx="58" cy="45" r="18" fill="#1a1a2e" />
                        {/* Stars */}
                        <circle cx="20" cy="25" r="1.5" fill="#fff" opacity="0.8" />
                        <circle cx="80" cy="20" r="1" fill="#fff" opacity="0.6" />
                        <circle cx="75" cy="75" r="1.5" fill="#fff" opacity="0.7" />
                        <circle cx="25" cy="70" r="1" fill="#fff" opacity="0.5" />
                    </g>
                )}

                {/* Clouds */}
                {weatherType === "clouds" && (
                    <g>
                        {!isNight && (
                            <circle cx="25" cy="45" r="12" fill="#FFD700" opacity="0.6" />
                        )}
                        <g className="cloud">
                            <ellipse cx="55" cy="55" rx="25" ry="15" fill="url(#cloudGradient)" />
                            <circle cx="40" cy="50" r="15" fill="url(#cloudGradient)" />
                            <circle cx="65" cy="48" r="12" fill="url(#cloudGradient)" />
                        </g>
                        <g className="cloud-2" opacity="0.7">
                            <ellipse cx="35" cy="65" rx="18" ry="10" fill="url(#cloudGradient)" />
                            <circle cx="25" cy="62" r="10" fill="url(#cloudGradient)" />
                        </g>
                    </g>
                )}

                {/* Drizzle */}
                {weatherType === "drizzle" && (
                    <g>
                        <g className="cloud">
                            <ellipse cx="50" cy="40" rx="25" ry="15" fill="url(#cloudGradient)" />
                            <circle cx="35" cy="35" r="15" fill="url(#cloudGradient)" />
                            <circle cx="60" cy="33" r="12" fill="url(#cloudGradient)" />
                        </g>
                        {/* Light rain drops */}
                        {[30, 45, 60, 70].map((x, i) => (
                            <circle
                                key={i}
                                className={`rain-drop rain-drop-${i + 1}`}
                                cx={x}
                                cy="60"
                                r="2"
                                fill="url(#rainGradient)"
                            />
                        ))}
                    </g>
                )}

                {/* Rain */}
                {weatherType === "rain" && (
                    <g>
                        <g className="cloud">
                            <ellipse cx="50" cy="35" rx="28" ry="18" fill="url(#darkCloudGradient)" />
                            <circle cx="32" cy="30" r="16" fill="url(#darkCloudGradient)" />
                            <circle cx="65" cy="28" r="14" fill="url(#darkCloudGradient)" />
                        </g>
                        {/* Rain drops */}
                        {[25, 38, 50, 62, 75].map((x, i) => (
                            <line
                                key={i}
                                className={`rain-drop rain-drop-${i + 1}`}
                                x1={x}
                                y1="55"
                                x2={x - 3}
                                y2="70"
                                stroke="url(#rainGradient)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        ))}
                    </g>
                )}

                {/* Thunderstorm */}
                {weatherType === "thunderstorm" && (
                    <g>
                        <g className="cloud">
                            <ellipse cx="50" cy="30" rx="30" ry="18" fill="url(#darkCloudGradient)" />
                            <circle cx="30" cy="25" r="16" fill="url(#darkCloudGradient)" />
                            <circle cx="68" cy="23" r="14" fill="url(#darkCloudGradient)" />
                        </g>
                        {/* Lightning bolt */}
                        <polygon
                            className="lightning"
                            points="50,45 42,60 48,60 40,80 55,55 48,55"
                            fill="#FFE135"
                        />
                        {/* Rain drops */}
                        {[28, 65, 78].map((x, i) => (
                            <line
                                key={i}
                                className={`rain-drop rain-drop-${i + 1}`}
                                x1={x}
                                y1="50"
                                x2={x - 2}
                                y2="65"
                                stroke="url(#rainGradient)"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        ))}
                    </g>
                )}

                {/* Snow */}
                {weatherType === "snow" && (
                    <g>
                        <g className="cloud">
                            <ellipse cx="50" cy="35" rx="25" ry="15" fill="url(#cloudGradient)" />
                            <circle cx="35" cy="30" r="15" fill="url(#cloudGradient)" />
                            <circle cx="62" cy="28" r="12" fill="url(#cloudGradient)" />
                        </g>
                        {/* Snowflakes */}
                        {[30, 45, 55, 70].map((x, i) => (
                            <g key={i} className={`snow-flake snow-flake-${i + 1}`}>
                                <circle cx={x} cy="55" r="3" fill="url(#snowGradient)" />
                                <line x1={x - 4} y1="55" x2={x + 4} y2="55" stroke="#fff" strokeWidth="1" />
                                <line x1={x} y1="51" x2={x} y2="59" stroke="#fff" strokeWidth="1" />
                            </g>
                        ))}
                    </g>
                )}

                {/* Fog/Mist */}
                {weatherType === "fog" && (
                    <g>
                        <rect
                            className="fog-layer"
                            x="10"
                            y="30"
                            width="80"
                            height="8"
                            rx="4"
                            fill="#B0BEC5"
                            opacity="0.7"
                        />
                        <rect
                            className="fog-layer fog-layer-2"
                            x="15"
                            y="45"
                            width="70"
                            height="8"
                            rx="4"
                            fill="#B0BEC5"
                            opacity="0.6"
                        />
                        <rect
                            className="fog-layer fog-layer-3"
                            x="20"
                            y="60"
                            width="60"
                            height="8"
                            rx="4"
                            fill="#B0BEC5"
                            opacity="0.5"
                        />
                    </g>
                )}
            </svg>
        </div>
    );
}
