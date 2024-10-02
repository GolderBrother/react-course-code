import React from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponentsStore } from "../../stores/components"

export function Preview() {
    const { components } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();

    function renderComponents(components: Component[]): React.ReactNode {
        return components.map((component: Component) => {
            const config = componentConfig?.[component.name]

            if (!config?.preview) {
                return null;
            }
            
            return React.createElement(
                config.preview,
                {
                    key: component.id,
                    id: component.id,
                    name: component.name,
                    styles: component.styles,
                    ...config.defaultProps,
                    ...component.props,
                },
                renderComponents(component.children || [])
            )
        })
    }

    return <div>
        {renderComponents(components)}
    </div>
}
