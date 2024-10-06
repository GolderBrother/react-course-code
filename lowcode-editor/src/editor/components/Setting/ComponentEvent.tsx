import { Collapse, CollapseProps, Button } from "antd";
import { getComponentById, useComponentsStore } from "../../stores/components";
import { useComponentConfigStore } from "../../stores/component-config";
import { ActionConfig, ActionModal } from './ActionModal';
import { useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export function ComponentEvent() {
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<typeof ComponentEvent>();
  const [curAction, setCurAction] = useState<ActionConfig>();
  const [curActionIndex, setCurActionIndex] = useState<number>();
  const { curComponent, components, updateComponentProps } =
    useComponentsStore();
  const { componentConfig } = useComponentConfigStore();
  const defaultActiveKey = useMemo(
    () =>
      componentConfig[curComponent?.name ?? ""].events?.map(
        (item) => item.name
      ),
    [componentConfig, curComponent?.name]
  );
  if (!curComponent) return null;
  function editAction(config: ActionConfig, index: number) {
    if (!curComponent) {
      return;
    }
    setCurAction(config)
    setCurActionIndex(index)
    setActionModalOpen(true);
  }

  function deleteAction(event: typeof ComponentEvent, index: number) {
    if (!curComponent) {
      return;
    }

    const actions = curComponent.props[event.name]?.actions;

    if (index !== -1) {
      actions.splice(index, 1);

      updateComponentProps(curComponent.id, {
        [event.name]: {
          actions: actions,
        },
      });
    }
  }
  const showActionModal = () => {
    setActionModalOpen(true);
  };
  const hideActionModal = () => {
    setActionModalOpen(false);
  };
  const EditButton = ({ item, index }: {
    item: ActionConfig
    index: number
  }) => {
    return <div style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
      onClick={() => editAction(item, index)}
    ><EditOutlined /></div>
  }

  const DeleteButton = ({
    event,
    index
  }: {
    event: typeof ComponentEvent, index: number;
  }) => {
    return (
      <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
        onClick={() => deleteAction(event, index)}
      ><DeleteOutlined /></div>
    );
  }

  const items: CollapseProps["items"] = (
    componentConfig[curComponent.name].events || []
  ).map((event) => {
    return {
      key: event.name,
      label: (
        <div className="flex justify-between leading-[30px]">
          {event.label}
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation?.();
              setCurEvent(event);
              setCurAction(void 0)
              showActionModal();
            }}
          >
            添加动作
          </Button>
        </div>
      ),
      children: (
        <div>
          {(curComponent.props[event.name]?.actions || []).map(
            (item: ActionConfig, index: number) => {
              return (
                <div key={item.type + index}>
                  {item.type === "goToLink" ? (
                    <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                      <div className="text-[blue]">跳转链接</div>
                      <div>{item.url}</div>
                      <EditButton item={item} index={index} />
                      <DeleteButton event={event} index={index} />
                    </div>
                  ) : null}
                  {item.type === "showMessage" ? (
                    <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                      <div className="text-[blue]">消息弹窗</div>
                      <div>{item.config.type}</div>
                      <div>{item.config.text}</div>
                      <EditButton item={item} index={index} />
                      <DeleteButton event={event} index={index} />
                    </div>
                  ) : null}
                  {
                    item.type === 'customJS' ? <div key="customJS" className='border border-[#aaa] m-[10px] p-[10px] relative'>
                      <div className='text-[blue]'>自定义 JS</div>
                      <EditButton item={item} index={index} />
                      <DeleteButton event={event} index={index} />
                    </div> : null
                  }
                  {
                    item.type === 'componentMethod' ? <div key="componentMethod" className='border border-[#aaa] m-[10px] p-[10px] relative'>
                      <div className='text-[blue]'>组件方法</div>
                      <div>{getComponentById(item.config.componentId, components)?.desc}</div>
                      <div>{item.config.componentId}</div>
                      <div>{item.config.method}</div>
                      <div style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                        onClick={() => editAction(item, index)}
                      ><EditOutlined /></div>
                      <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                        onClick={() => deleteAction(event, index)}
                      ><DeleteOutlined /></div>
                    </div> : null
                  }

                </div>
              );
            }
          )}
        </div>
      ),
    };
  });

  function handleOk(config?: ActionConfig) {
    if (!config || !curEvent || !curComponent) {
      return;
    }
    // 保存的时候如果有 curAction，就是修改，没有的话才是新增。
    if (curAction) {
      const newActions = curComponent.props[curEvent.name]?.actions.map((item: ActionConfig, index: number) => (index === curActionIndex ? config : item));
      updateComponentProps(curComponent.id, {
        [curEvent.name]: {
          actions: newActions,
        },
      });
    } else {
      updateComponentProps(curComponent.id, {
        [curEvent.name]: {
          actions: [
            ...(curComponent.props[curEvent.name]?.actions || []),
            config,
          ],
        },
      });
    }

    setActionModalOpen(false);
  }

  function handleCancel() {
    hideActionModal();
  }

  return (
    <div className="px-[10px]">
      <Collapse
        className="mb-[10px]"
        defaultActiveKey={defaultActiveKey}
        items={items}
      />
      {/* eventConfig={curEvent!} */}
      <ActionModal
        visible={actionModalOpen}
        action={curAction}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
}
