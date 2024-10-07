import React from "react";
import { useComponentConfigStore } from "../../stores/component-config";
import { Component, useComponentsStore } from "../../stores/components";
import { message } from "antd";
import { ActionConfig } from "../Setting/ActionModal";

export function Preview() {
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const componentRefs = React.useRef<Record<string, Record<string, unknown>>>({});
  function handleEvent(component: Component) {
    const props: Record<string, unknown> = {};

    componentConfig[component.name].events?.forEach((event) => {
      const eventConfig = component.props[event.name];
      if (eventConfig) {
        const eventHandler = (...args: unknown[]) => {
          eventConfig.actions.forEach((action: ActionConfig) => {
            const { type, config } = action;
            if (type === "goToLink" && action.url) {
              window.location.href = action.url;
            } else if (type === "showMessage" && action.config) {
              const { text } = action.config;
              if (config.type === "info") {
                message.info(text);
              } else if (config.type === "success") {
                message.success(text);
              } else if (config.type === "warn") {
                message.warning(text);
              } else if (config.type === "error") {
                message.error(text);
              }
            } else if (type === "customJS") {
              if (action.code) {
                const func = new Function('context', 'args', action.code);
                func({
                  name: component.name,
                  props: component.props,
                  showMessage(content: string) {
                    message.success(content)
                  }
                }, args);
              }
            } else if (type === "componentMethod") {
              // 收集所有的 refs，按照 id 来索引
              const component = componentRefs.current[action.config.componentId];
              // 调用方法的时候根据 componentId 和 method 来调用
              const fn = component[action.config.method];
              if (typeof fn === 'function') {
                fn(...args);
              }
            }
          });
        };
        props[event.name] = eventHandler;
      }
    });
    return props;
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

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
          ref: (ref: Record<string, unknown>) =>
            (componentRefs.current[component.id] = ref),
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        },
        renderComponents(component.children || [])
      );
    });
  }

  return <div>{renderComponents(components)}</div>;
}
