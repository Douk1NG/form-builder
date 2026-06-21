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

    if (!Component) {
        return (
            null
        );
    }

    return (
        <div className="w-full">
            <Label htmlFor={props.name}>{props.label}</Label>
            <Component {...props} />
            {!props.readOnly && (
                <p className='text-sm text-muted-foreground'>{props.description}</p>
            )}
        </div>
    )

}

export default Index
