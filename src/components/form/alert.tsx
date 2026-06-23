import { CircleX } from 'lucide-react';

import { Alert, AlertDescription } from '../ui/alert';

type FormAlertProps = {
    message: string
    translate?: (key: string) => string
}

const defaultTranslate = (key: string) => key

export default function FormAlert({ message, translate = defaultTranslate }: FormAlertProps) {
    return (
        <Alert className='text-red-800 border-red-800 bg-red-500/20'>
            <AlertDescription className='italic flex items-center gap-2 select-none'>

            <CircleX className="h-4 w-4" />
                {translate(message)}
            </AlertDescription>
        </Alert>
    )
}
