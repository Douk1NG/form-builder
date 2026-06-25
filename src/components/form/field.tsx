import Text from "./components/text";
import Textarea from "./components/textarea";
import Currency from "./components/currency";
import MultiSelect from "./components/multiselect";
import Switch from "./components/switch";
import Tagbox from "./components/tagbox";
import Select from "./components/select";
import ImageUploader from "./components/image-uploader";
import GroupInventory from "./components/group/inventory";
import GroupProduct from "./components/group/product";
import Number from "./components/number";
import { Label } from '../ui/label';
import type { Field } from '../../types/form';
import type { JSX } from "react";

// todo: the translation system needs to be reviewed considering the form translations are not part of i18n system but user defined, this means the form is multi language by nature and not tied to i18n library but bc we are using i18n to get the current language we have to use it somehow without breaking the multi language and type safety, this is a temporary workaround, pending review
import { resolveLocalizedString } from '../../utils/locales';

const Components = {
    text: Text,
    textarea: Textarea,
    currency: Currency,
    multiselect: MultiSelect,
    switch: Switch,
    tagbox: Tagbox,
    select: Select,
    image: ImageUploader,
    group_variant_inventory: GroupInventory,
    group_variant_product: GroupProduct,
    number: Number
};

const Index = <T extends Field>(props: T) => {
    const Component = Components[props.type] as (props: T) => JSX.Element;
    const {
        label,
        description,
        name,
        readOnly
    } = props;

    if (!Component) {
        return (
            null
        );
    }

    return (
        <div className="w-full space-y-2.5">
            <Label
                htmlFor={name}
                className="text-base font-medium"
            >
                {resolveLocalizedString(label)}
            </Label>
            <Component {...props} />
            {!readOnly && description && (
                <p className="text-sm text-muted-foreground/80 mt-1">
                    {resolveLocalizedString(description)}
                </p>
            )}
        </div>
    )

}

export default Index
