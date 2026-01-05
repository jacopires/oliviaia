import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
    sender: 'ai' | 'user' | 'agent';
    text: string;
    media_url?: string;
    media_type?: 'image' | 'video' | 'audio' | 'document';
    created_at: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    sender,
    text,
    media_url,
    media_type,
    created_at,
}) => {
    const isUser = sender === 'user';
    const isAgent = sender === 'agent';

    return (
        <motion.div
            className={cn(
                'flex mb-4',
                isUser ? 'justify-end' : 'justify-start'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className={cn(
                'max-w-[70%] flex flex-col gap-1',
                isUser && 'items-end'
            )}>
                {/* Message Bubble */}
                <div className={cn(
                    'px-4 py-2.5 rounded-2xl',
                    'backdrop-blur-xl',
                    isUser
                        ? 'bg-primary/20 text-text-primary rounded-br-sm shadow-glow-green'
                        : isAgent
                            ? 'bg-accent-blue/20 text-text-primary rounded-bl-sm shadow-glow-blue'
                            : 'bg-white/5 text-text-primary rounded-bl-sm'
                )}>
                    {/* Media */}
                    {media_url && (
                        <div className="mb-2">
                            {media_type === 'image' && (
                                <img
                                    src={media_url}
                                    alt="Media"
                                    className="max-w-full rounded-lg"
                                />
                            )}
                            {media_type === 'video' && (
                                <video
                                    src={media_url}
                                    controls
                                    className="max-w-full rounded-lg"
                                />
                            )}
                            {media_type === 'audio' && (
                                <audio src={media_url} controls className="w-full" />
                            )}
                            {media_type === 'document' && (
                                <a
                                    href={media_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <span className="material-symbols-outlined text-sm">description</span>
                                    Documento
                                </a>
                            )}
                        </div>
                    )}

                    {/* Text */}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {text}
                    </p>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-text-tertiary font-mono px-2">
                    {new Date(created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            </div>
        </motion.div>
    );
};
