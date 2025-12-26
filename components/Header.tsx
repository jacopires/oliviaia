import React from 'react';

interface HeaderProps {
    title: string;
    subtitle: string;
    tag?: {
        label: string;
        active?: boolean;
    };
    actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, tag, actions }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                        {title}
                    </h2>
                    {tag && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${tag.active
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : 'bg-white/5 text-text-secondary border-white/10'
                            }`}>
                            {tag.active && <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>}
                            {tag.label}
                        </span>
                    )}
                </div>
                <p className="text-slate-500 dark:text-gray-400 text-base md:text-lg">
                    {subtitle}
                </p>
            </div>
            {actions && (
                <div className="flex items-center gap-3 self-start md:self-end">
                    {actions}
                </div>
            )}
        </div>
    );
};

export default Header;
