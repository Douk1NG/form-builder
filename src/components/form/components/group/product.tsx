import { Trash2 } from 'lucide-react';
import Field from '../../field';
import {
    useCallback,
    useRef,
    useState
} from "react";

import { useFieldInheritance } from '../../../../hooks/use-field-inheritance';

import { Button } from '../../../ui/button';
import { getUniqueByKey } from '../../../../lib/utils';

import type { Option } from '../../../../types/select';
import type { GroupField } from '../../../../types/form';

type Group = {
    combination_id?: number;
    filters?: string[];
    price?: number;
    index?: number;
}

export default function Component({
    name,
    readOnly,
    inheritFrom,
    value: defaultValue = [{}],
    options: defaultOptions = []
}: GroupField) {
    const [groups, setGroups] = useState<Group[]>(defaultValue as Group[]);
    const [options, setOptions] = useState<Option[]>(defaultOptions || []);
    const inputRef = useRef<HTMLInputElement>(null);

    const inheritanceMethod = useCallback((value: unknown) => {
        if (!Array.isArray(value)) return;

        const uniqueFilters = getUniqueByKey(value as Option[], 'value');
        setOptions(uniqueFilters);

    }, []);

    useFieldInheritance(inheritFrom, inheritanceMethod)

    const addGroup = () => {
        setGroups(prevGroups => [...prevGroups, {}]);
    };

    const removeGroup = (indexToRemove: number) => {
        setGroups(prevGroups => prevGroups.filter((_, index) => index !== indexToRemove));
    };

    const handleChange = (value: unknown, index: number, id: unknown) => {
        const updatedGroups = [...groups];
        const field = Array.isArray(value) ? 'filters' : 'price';

        updatedGroups[index] = {
            ...updatedGroups[index],
            combination_id: id as number,
            [field]: value
        };

        setGroups(updatedGroups);
    };

    return (
        <div className="flex flex-col gap-4">
            {!readOnly && (
                <Button
                    type="button"
                    variant="secondary"
                    size="default"
                    onClick={addGroup}
                    className="cursor-pointer hover:text-green-800 hover:bg-green-50 w-fit self-end"
                >
                    Agregar
                </Button>
            )}
            <input
                ref={inputRef}
                type="hidden"
                name={name}
                value={JSON.stringify(groups)}
            />
            {groups.map((group, index) => (
                <div
                    key={index}
                    className="flex items-end gap-2 border p-4 rounded relative"
                >
                    <div className="flex flex-1 gap-2 flex-col md:flex-row">
                        <Field
                            label="Filtros"
                            id={`${name}_filters_${index}`}
                            options={options}
                            type="multiselect"
                            value={group.filters}
                            onChange={(value: unknown) => handleChange(value, index, group.combination_id)}
                            {...(readOnly !== undefined ? { readOnly } : {})}
                        />
                        <Field
                            label="Precio"
                            id={`${name}_price_${index}`}
                            type="currency"
                            value={group.price}
                            onChange={(value: unknown) => handleChange(value, index, group.combination_id)}
                            {...(readOnly !== undefined ? { readOnly } : {})}
                        />
                    </div>
                    {(!readOnly && groups.length > 1) && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeGroup(index)}
                            className="cursor-pointer absolute top-0 right-0 rounded-full hover:text-red-800 hover:bg-red-50"
                            title="Eliminar grupo"
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}
