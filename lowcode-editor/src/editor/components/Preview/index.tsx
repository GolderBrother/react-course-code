import React from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponentsStore } from "../../stores/components"
import { message } from "antd";

export function Preview() {
    const { components } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();
    function handleEvent(component: Component) {
        const props: Record<string, unknown> = {};

        componentConfig[component.name].events?.forEach((event) => {
            const eventConfig = component.props[event.name];

            if (eventConfig) {
                const { type } = eventConfig;
                const eventHandler = () => {
                    if (type === 'goToLink' && eventConfig.url) {
                        window.location.href = eventConfig.url;
                    } else if (type === 'showMessage' && eventConfig.config) {
                        const { text } = eventConfig.config;
                        if (eventConfig.config.type === 'info') {
                            message.info(text);
                        } else if (eventConfig.config.type === 'success') {
                            message.success(text);
                        } else if (eventConfig.config.type === 'warn') {
                            message.warning(text);
                        } else if (eventConfig.config.type === 'error') {
                            message.error(text);
                        }
                    }
                }
                props[event.name] = eventHandler;
            }
        })
        return props;
    }

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
                    ...handleEvent(component)
                },
                renderComponents(component.children || [])
            )
        })
    }

    return <div>
        {renderComponents(components)}
    </div>
}
