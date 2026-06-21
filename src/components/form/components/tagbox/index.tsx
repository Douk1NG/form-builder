'use client'
import { CircleX } from 'lucide-react';
import { Input } from '../../../ui/input'
import { useTagbox } from '../../../../hooks/use-tagbox'
import { Button } from '../../../ui/button'
import type { TagboxField } from '../../../../types/form'
import type { Tag } from '../../../../types/tagbox'

export default function Tagbox({
    name,
    value = [],
    placeholder = '',
    readOnly = false
}: TagboxField) {
    const {
        tags,
        inputValue,
        isInputEmpty,
        handleInputChange,
        handleKeyDown,
        addTag,
        removeTag
    } = useTagbox(value as Tag[])

    const translations = {
        add: 'Add',
        remove: 'Remove'
    }

    return (
        <div className="space-y-4">
            <div className="flex space-x-2">
                <Input
                    id={name}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="grow"
                    readOnly={readOnly}
                />
                <Button
                    onClick={addTag}
                    type="button"
                    disabled={isInputEmpty}
                    className="cursor-pointer"
                >
                    {translations.add}
                </Button>
            </div>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-25">
                {tags.length > 0 && tags.map(tag => (
                    <div
                        key={tag.label}
                        className="flex items-center bg-primary text-primary-foreground px-2 py-1 rounded-md max-h-7.5"
                    >
                        <span className="mr-1">{tag.label}</span>

                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-4 w-4 p-0 hover:bg-primary-foreground hover:text-primary cursor-pointer"
                            onClick={() => removeTag(tag.label)}
                            title={translations.remove}
                            disabled={readOnly}
                        >
                            <CircleX height={16} width={16} />
                        </Button>
                    </div>
                ))}
            </div>
            <input
                type="hidden"
                name={name}
                value={JSON.stringify(tags)}
            />
        </div>
    )
}
