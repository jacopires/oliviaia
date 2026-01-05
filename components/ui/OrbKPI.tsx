import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface OrbKPIProps {
    value: string | number;
    label: string;
    color?: 'green' | 'blue' | 'amber';
    size?: 'sm' | 'md' | 'lg';
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

export const OrbKPI: React.FC<OrbKPIProps> = ({
    value,
    label,
    color = 'green',
    size = 'md',
    trend,
    trendValue,
}) => {
    const colors = {
        green: 'from-primary/30 to-primary/10 shadow-glow-green',
        blue: 'from-accent-blue/30 to-accent-blue/10 shadow-glow-blue',
        amber: 'from-accent-amber/30 to-accent-amber/10 shadow-glow-amber',
    };

    const sizes = {
        sm: 'w-32 h-32',
        md: 'w-40 h-40',
        lg: 'w-48 h-48',
    };

    const textSizes = {
        sm: 'text-3xl',
        md: 'text-4xl',
        lg: 'text-5xl',
    };

    const trendColors = {
        up: 'text-primary',
        down: 'text-red-400',
        neutral: 'text-text-secondary',
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <motion.div
                className={cn(
                    'orb flex items-center justify-center',
                    colors[color],
                    sizes[size]
                )}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
            >
                <motion.div
                    className={cn('font-display font-bold', textSizes[size])}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {value}
                </motion.div>
            </motion.div>

            <div className="flex flex-col items-center gap-1">
                <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                    {label}
                </p>
                {trend && trendValue && (
                    <p className={cn('text-xs font-semibold', trendColors[trend])}>
                        {trend === 'up' && '↑'} {trend === 'down' && '↓'} {trendValue}
                    </p>
                )}
            </div>
        </div>
    );
};
