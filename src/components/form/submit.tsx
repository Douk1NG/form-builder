import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

type FormSubmitButtonProps = {
    isPending: boolean
    label?: string
    translate?: (key: string) => string
}

const defaultTranslate = (key: string) => key

export default function FormSubmitButton({ isPending, label, translate = defaultTranslate }: FormSubmitButtonProps) {
    const buttonLabel = label ?? translate('form.submit')

    return (
        <div className='flex justify-end gap-4'>
            <Button
                type='submit'
                disabled={isPending}
                className='cursor-pointer'
                title={buttonLabel}
            >
                <div className='flex items-center gap-2'>
                    {isPending && <Loader2 className='animate-spin mr-2 h-4 w-4' />}
                    {buttonLabel}
                </div>
            </Button>
        </div>
    )
}
