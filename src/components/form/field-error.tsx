import { CircleX } from 'lucide-react';
import { cn } from '../../lib/utils'

type FieldErrorProps = {
    error?: string
    className?: string
}

const FieldError = ({ error, className }: FieldErrorProps) => {
    if (!error) return null

    return (
        <p
            className={cn(
                'text-sm text-red-500 flex items-center gap-1.5',
                className
            )}
        >
            <CircleX className="h-4 w-4" />
            {error}
        </p>

    )
}

export default FieldError
