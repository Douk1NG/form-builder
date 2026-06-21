import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

export default function FormSubmitButton({ isPending, translate = (key: string) => key }: { isPending: boolean, translate?: (key: string) => string }) {
        return (
        <div className='flex justify-end gap-4'>
            <Button
                type='submit'
                disabled={isPending}
                className='cursor-pointer'
                title={translate('layout.sidebar.save')}
            >
                <div className='flex items-center gap-2'>
                    {isPending && <Loader2 className='animate-spin mr-2 h-4 w-4' />}
                    {translate('layout.sidebar.save')}
                </div>
            </Button>
        </div>
    )
}
