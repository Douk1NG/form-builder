import type React from 'react'

export type PropertiesSectionHeaderProps = {
    icon: React.ReactNode
    title: string
    accentColor?: 'primary' | 'violet'
    rightAction?: React.ReactNode
}

const backgroundColors = {
    primary: 'bg-primary/10 text-primary',
    violet: 'bg-violet-500/10 text-violet-500',
}

export function PropertiesSectionHeader({
    icon,
    title,
    accentColor = 'primary',
    rightAction
}: PropertiesSectionHeaderProps) {
    return (
        <div className="sticky top-0 z-10 flex items-center justify-between pb-4 border-b border-border/40 bg-card/95 backdrop-blur-sm -mx-5 px-5 pt-0">
            <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${backgroundColors[accentColor]}`}>
                    {icon}
                </div>
                <h3 className="font-bold text-base tracking-tight">{title}</h3>
            </div>
            {rightAction}
        </div>
    )
}