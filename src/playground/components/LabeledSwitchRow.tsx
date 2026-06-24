import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export type LabeledSwitchRowProps = {
    id: string
    label: string
    description: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}

export function LabeledSwitchRow({ id, label, description, checked, onCheckedChange }: LabeledSwitchRowProps) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-border/50 transition-all">
            <div className="space-y-0.5">
                <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
        </div>
    )
}