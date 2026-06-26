import { Blocks } from 'lucide-react'

export function FormBuilderLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10">
                <Blocks className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
                Form Builder
            </span>
        </div>
    )
}