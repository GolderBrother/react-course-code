import React, { useEffect } from "react";
import { Component, useComponentsStore } from "../../stores/components";
import { useComponentConfigStore } from "../../stores/component-config";

export function EditArea() {
  // const {components, addComponent, deleteComponent, updateComponentProps} = useComponentsStore();
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];
      if (!config?.component) {
        return null;
      }

      return React.createElement(
        config.component,
        // props 是配置里的 defaultProps 用 component.props 覆盖后的结果
        {
          key: component.id,
          id: component.id,
          name: component.name,
          ...config.defaultProps,
          ...component.props,
        },
        // components 是一个树形结构，我们 render 的时候也要递归渲染：
        renderComponents(component.children || [])
      );
    });
  }
  return (
    <div className="h-[100%]">
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
      {renderComponents(components)}
    </div>
  );
}
