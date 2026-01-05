import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FloatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    glow?: boolean;
    icon?: React.ReactNode;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    glow = false,
    icon,
    className,
    disabled,
    ...props
}) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        success: 'bg-primary text-background-dark hover:shadow-glow-green',
        danger: 'bg-red-500 text-white hover:shadow-glow-amber',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            className={cn(
                'btn-floating',
                variants[variant],
                sizes[size],
                glow && 'shadow-glow-green',
                disabled && 'opacity-50 cursor-not-allowed',
                'flex items-center gap-2',
                className
            )}
            whileHover={!disabled ? { y: -2, scale: 1.02 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
            disabled={disabled}
            {...props}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </motion.button>
    );
};
