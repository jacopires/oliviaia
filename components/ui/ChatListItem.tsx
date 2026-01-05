import React from 'react';
import { motion } from 'framer-motion';
import { GlowingAvatar } from './GlowingAvatar';
import { cn } from '../../lib/utils';

interface ChatListItemProps {
    chat: {
        id: string;
        name: string;
        avatar?: string;
        status: string;
        score: string;
        last_message_at: string;
        labels?: string[];
        is_typing?: boolean;
    };
    isActive: boolean;
    onClick: () => void;
    hasNewMessage?: boolean;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
    chat,
    isActive,
    onClick,
    hasNewMessage = false,
}) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const statusColors = {
        'Novo Lead': 'text-accent-blue',
        'Em Atendimento': 'text-primary',
        'Aguardando': 'text-accent-amber',
        'Encerrado': 'text-text-tertiary',
    };

    return (
        <motion.div
            className={cn(
                'group relative p-3 rounded-xl cursor-pointer transition-all',
                'hover:bg-white/5',
                isActive && 'bg-white/10 shadow-glow-green',
                hasNewMessage && !isActive && 'animate-pulse-slow'
            )}
            onClick={onClick}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            layout
        >
            {/* Glow effect for new messages */}
            {hasNewMessage && !isActive && (
                <motion.div
                    className="absolute inset-0 rounded-xl bg-primary/10 shadow-glow-green"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            <div className="relative flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                    {chat.avatar ? (
                        <GlowingAvatar
                            src={chat.avatar}
                            alt={chat.name}
                            size="md"
                            pulse={hasNewMessage}
                        />
                    ) : (
                        <div className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center',
                            'bg-gradient-to-br from-primary/20 to-accent-blue/20',
                            'border-2 border-primary/30',
                            hasNewMessage && 'shadow-glow-green animate-pulse-slow'
                        )}>
                            <span className="text-text-primary font-bold text-sm">
                                {getInitials(chat.name)}
                            </span>
                        </div>
                    )}

                    {/* Typing indicator */}
                    {chat.is_typing && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background-dark flex items-center justify-center">
                            <div className="flex gap-0.5">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 h-1 bg-background-dark rounded-full"
                                        animate={{ y: [-2, 0, -2] }}
                                        transition={{
                                            duration: 0.6,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-text-primary truncate">
                            {chat.name}
                        </p>
                        <span className="text-[10px] text-text-tertiary font-mono whitespace-nowrap ml-2">
                            {new Date(chat.last_message_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={cn(
                            'text-xs font-medium',
                            statusColors[chat.status as keyof typeof statusColors] || 'text-text-secondary'
                        )}>
                            {chat.status}
                        </span>

                        {chat.labels && chat.labels.length > 0 && (
                            <div className="flex gap-1">
                                {chat.labels.slice(0, 2).map((label, idx) => (
                                    <span
                                        key={idx}
                                        className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
