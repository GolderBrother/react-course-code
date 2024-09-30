import { useMemo } from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { MaterialItem } from "../MaterialItem";

export function Material() {
    const { componentConfig } = useComponentConfigStore();

    const components = useMemo(() => {
        // 不需要展示页面组件
        return Object.values(componentConfig).filter((item) => item.name !== 'Page')
            ;
    }, [componentConfig]);

    return components.map((item, index) => {
        return <MaterialItem desc={item.desc} name={item.name} key={item.name + index} />
    })

}
