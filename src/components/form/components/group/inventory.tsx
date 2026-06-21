import Field from '../../field';
import { useCallback, useState } from "react";
import { useFieldInheritance } from '../../../../hooks/use-field-inheritance';

import type { GroupField } from '../../../../types/form';

type Group = {
    id?: number;
    filters?: string[];
    quantity?: number;
    index?: number;
}

export default function Component({
    name,
    readOnly,
    inheritFrom,
    value: defaultValue = [{}]
}: GroupField) {
    const [groups, setGroups] = useState<Group[]>(defaultValue as Group[]);

    const inheritanceMethod = useCallback((value: unknown) => {
        if (!Array.isArray(value)) return;
        console.log(value)

    }, []);

    useFieldInheritance(inheritFrom, inheritanceMethod)

    // const addGroup = () => {
    //     setGroups(prevGroups => [...prevGroups, {}]);
    // };

    // const removeGroup = (indexToRemove: number) => {
    //     setGroups(prevGroups => prevGroups.filter((_, index) => index !== indexToRemove));
    // };

    const handleChange = (value: unknown, index: number, id: unknown) => {
        const updatedGroups = [...groups];
        const field = Array.isArray(value) ? 'filters' : 'price';

        updatedGroups[index] = {
            ...updatedGroups[index],
            id: id as number,
            [field]: value
        };

        setGroups(updatedGroups);
    };

    return (
        <div className="flex flex-col gap-4">
            {groups.map((group, index) => (
                <div
                    key={index}
                    className="flex items-end gap-2 border p-4 rounded relative"
                >
                    <div className="flex flex-1 gap-2 flex-col md:flex-row">
                        <Field
                            label="Filtros"
                            type="text"
                            value={group.filters}
                            {...(readOnly !== undefined ? { readOnly } : {})}
                        />
                        <Field
                            label="Cantidad"
                            id={`${name}_quantity_${index}`}
                            type="number"
                            value={group.quantity}
                            onChange={(value: unknown) => handleChange(value, index, group.id)}
                            {...(readOnly !== undefined ? { readOnly } : {})}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
