import { useDrop } from "react-dnd";
import { useComponentConfigStore } from "../stores/component-config";
import { getComponentById, useComponentsStore } from "../stores/components";
export interface ItemType {
  type: string;
  dragType?: 'move' | 'add',
  id: number
}
export function useMaterialDrop(accept: string[], id: number) {
  const { addComponent, deleteComponent, components } = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: ItemType, monitor) => {
      // 保证只 drop 一次。
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return;
      }

      if (item.dragType === 'move') {
        // 移动组件
        const component = getComponentById(item.id, components)!;
        if (id === item.id) return; // 不能移动到自身
        // 先删除后新增
        deleteComponent(item.id);
        addComponent(component, id)
      } else {
        // 添加组件
        const { defaultProps: props, desc, styles = {} } = componentConfig[item.type] || {};
        addComponent({
          id: new Date().getTime(),
          name: item.type,
          desc,
          props,
          styles
        }, id)
      }

    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return { canDrop, drop }
}
