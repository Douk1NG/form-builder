import { CircleX } from 'lucide-react';

import { Alert, AlertDescription } from '../ui/alert';

export default function FormAlert({ message }: { message: string }) {
    return (
        <Alert className='text-red-800 border-red-800 bg-red-500/20'>
            <AlertDescription className='italic flex items-center gap-2 select-none'>

            <CircleX className="h-4 w-4" />
                {message}
            </AlertDescription>
        </Alert>
    )
}
