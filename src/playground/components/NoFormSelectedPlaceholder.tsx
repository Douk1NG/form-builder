import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function NoFormSelectedPlaceholder() {
    const setCreateFormDialogOpen = useFormBuilderStore((state) => state.setCreateFormDialogOpen)

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10 gap-4">
            <p className="text-muted-foreground text-sm max-w-xs">
                To begin building your custom form layouts, start by creating a new form document.
            </p>
            <Button
                onClick={() => setCreateFormDialogOpen(true)}
                size="sm"
                className="gap-1.5 rounded-lg shadow-sm"
            >
                <Plus className="w-4 h-4" />
                Create Form
            </Button>
        </div>
    )
}