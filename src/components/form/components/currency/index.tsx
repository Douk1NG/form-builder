import CurrencyInput from 'react-currency-input-field';
import { cn } from '../../../../lib/utils';
import { safeParseFloat } from '../../../../utils/safeParse';
import type { CurrencyField } from '../../../../types/form';
import { useLocale } from 'next-intl';
import { useDebouncedCallback } from 'use-debounce'
import { useCallback } from 'react';
import { useFieldInheritance } from '../../../../hooks/use-field-inheritance';
import { useState } from 'react';

export default function Component({
    inheritFrom,
    value,
    id,
    name,
    readOnly,
    disabled,
    onChange
}: CurrencyField) {
    const locale = useLocale();
    const [initialValue, setInitialValue] = useState(value)

    const intlConfig = {
        locale: 'es-CO',
        currency: 'COP',
        step: 1000
    }

    if (locale === 'en') {
        intlConfig.locale = 'en-US';
        intlConfig.currency = 'USD';
        intlConfig.step = 1;
    }

    const handleChange = useDebouncedCallback((_value?: string, _name?: string, values?: Record<string, unknown>) => {
        onChange?.(values?.['float']);
    }, 400)

    const inheritanceMethod = useCallback((value: unknown) => {
        setInitialValue(value)
    }, [])

    useFieldInheritance(inheritFrom, inheritanceMethod)

    return (
        <CurrencyInput
            {...(id ?? name ? { id: id ?? name } : {})}
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            )}
            intlConfig={intlConfig}
            step={intlConfig.step}
            allowNegativeValue={false}
            {...(name ? { name } : {})}
            onValueChange={handleChange}
            value={safeParseFloat(initialValue) as number}
            readOnly={readOnly}
            disabled={disabled}
        />
    )
}
