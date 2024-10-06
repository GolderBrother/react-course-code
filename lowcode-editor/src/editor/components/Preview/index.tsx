import React from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponentsStore } from "../../stores/components"
import { message } from "antd";
import { ActionConfig } from "../Setting/ActionModal";

export function Preview() {
    const { components } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();
    function handleEvent(component: Component) {
        const props: Record<string, unknown> = {};

        componentConfig[component.name].events?.forEach((event) => {
            const eventConfig = component.props[event.name];
            if (eventConfig) {
                const eventHandler = () => {
                    eventConfig.actions.forEach((action: ActionConfig) => {
                        const { type, config } = action;
                        if (type === 'goToLink' && action.url) {
                            window.location.href = action.url;
                        } else if (type === 'showMessage' && action.config) {
                            const { text } = action.config;
                            if (config.type === 'info') {
                                message.info(text);
                            } else if (config.type === 'success') {
                                message.success(text);
                            } else if (config.type === 'warn') {
                                message.warning(text);
                            } else if (config.type === 'error') {
                                message.error(text);
                            }
                        } else if (type === 'customJS') {
                            if (action.code) {
                                const func = new Function('context', action.code);
                                func({
                                    name: component.name,
                                    props: component.props,
                                    showMessage(content: string) {
                                        message.success(content)
                                    }
                                });
                            }
                        }
                    })
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
