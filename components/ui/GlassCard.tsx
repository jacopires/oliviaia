import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glow?: 'green' | 'blue' | 'amber' | 'none';
    onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className,
    hover = false,
    glow = 'none',
    onClick,
}) => {
    const glowClass = {
        green: 'hover:shadow-glow-green',
        blue: 'hover:shadow-glow-blue',
        amber: 'hover:shadow-glow-amber',
        none: '',
    }[glow];

    return (
        <motion.div
            className={cn(
                'glass-card',
                hover && 'cursor-pointer transition-all duration-300',
                glowClass,
                className
            )}
            whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
            whileTap={hover ? { scale: 0.98 } : undefined}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};
