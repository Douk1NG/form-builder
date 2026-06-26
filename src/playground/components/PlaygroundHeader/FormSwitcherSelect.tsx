import {
    Select,
    SelectActions,
    SelectActionButton,
    SelectContent,
    SelectItem,
    SelectItemAction,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from "@/components/form/components/select/composable/index"
import { Plus, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"

type FormSwitcherSelectProps = {
    value: string
    onValueChange: (value: string) => void
    options: { value: string, label: string }[]
    handleDeleteOption: (value: string) => void
    handleCreateNew: () => void
}

export const FormSwitcherSelect = ({
    value,
    onValueChange,
    options,
    handleDeleteOption,
    handleCreateNew
}: FormSwitcherSelectProps) => {

    const { t: translations } = useTranslation('translation', {
        keyPrefix: 'playground.builder.header.formSwitcher'
    })

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger placeholder={translations('placeholder')}>
                <SelectValue
                    options={options}
                    placeholder={translations('placeholder')}
                />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        label={option.label}
                    >
                        <SelectItemAction
                            icon={<Trash2 className="size-4" />}
                            onClick={() => handleDeleteOption(option.value)}
                            label={translations('delete', {
                                formName: option.label
                            })}
                            variant="destructive"
                        />
                    </SelectItem>
                ))}

                <SelectSeparator />

                <SelectActions>
                    <SelectActionButton
                        onClick={handleCreateNew}
                        icon={<Plus className="size-4" />}
                    >
                        {translations('dialog.create')}
                    </SelectActionButton>
                </SelectActions>
            </SelectContent>
        </Select>
    )
}