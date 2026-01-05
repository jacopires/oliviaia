import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlowingAvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg';
    status?: 'online' | 'offline' | 'away';
    pulse?: boolean;
}

export const GlowingAvatar: React.FC<GlowingAvatarProps> = ({
    src,
    alt = 'Avatar',
    fallback,
    size = 'md',
    status,
    pulse = false,
}) => {
    const sizes = {
        sm: 'w-10 h-10',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const statusColors = {
        online: 'bg-primary shadow-glow-green',
        offline: 'bg-gray-500',
        away: 'bg-accent-amber shadow-glow-amber',
    };

    return (
        <div className="relative">
            <motion.div
                className={cn(
                    'rounded-full overflow-hidden border-2 border-primary/30',
                    sizes[size],
                    pulse && 'animate-pulse-slow'
                )}
                whileHover={{ scale: 1.05 }}
            >
                {src ? (
                    <img src={src} alt={alt} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent-blue/20 flex items-center justify-center">
                        <span className="text-text-primary font-bold text-sm">
                            {fallback || alt.substring(0, 2).toUpperCase()}
                        </span>
                    </div>
                )}
            </motion.div>

            {status && (
                <div
                    className={cn(
                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background-dark',
                        statusColors[status]
                    )}
                />
            )}
        </div>
    );
};
