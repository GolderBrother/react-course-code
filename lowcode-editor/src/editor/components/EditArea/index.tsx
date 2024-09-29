import React, { MouseEventHandler, useEffect, useState } from "react";
import { Component, useComponentsStore } from "../../stores/components";
import { useComponentConfigStore } from "../../stores/component-config";
import HoverMask from "../HoverMask";

export function EditArea() {
  // const {components, addComponent, deleteComponent, updateComponentProps} = useComponentsStore();
  const { components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const [hoverComponentId, setHoverComponentId] = useState<number>();

  const handleMouseOver: MouseEventHandler = (e) => {
    const path = e.nativeEvent.composedPath();

    for (let i = 0; i < path.length; i += 1) {
      const ele = path[i] as HTMLElement;

      const componentId = ele.dataset?.componentId;
      if (componentId) {
        setHoverComponentId(+componentId);
        return;
      }
    }
  }

  const handleMouseLeave: MouseEventHandler = () => {
    setHoverComponentId(undefined);
  }

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
  // return (
  //   <div className="h-[100%] edit-area" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}
  //   >
  //     {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
  //     {renderComponents(components)}
  //     {hoverComponentId && (
  //       <HoverMask
  //         containerClassName='edit-area'
  //         componentId={hoverComponentId}
  //       />
  //     )}

  //   </div>
  // );
  const handleClick = (e) => {
    console.log('click e', e)
  }
  return <div className="h-[100%] edit-area" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} onClick={handleClick}>
    {renderComponents(components)}
    {hoverComponentId && (
        <HoverMask
            portalWrapperClassName='portal-wrapper'
            containerClassName='edit-area'
            componentId={hoverComponentId}
        />
    )}
    <div className="portal-wrapper"></div>
</div>
}
