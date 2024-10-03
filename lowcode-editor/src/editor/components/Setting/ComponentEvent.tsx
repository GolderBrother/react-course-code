import { Collapse, CollapseProps, Button } from "antd";
import { useComponentsStore } from "../../stores/components";
import { useComponentConfigStore } from "../../stores/component-config";
import { GoToLinkConfig } from "./actions/GoToLink";
import { ShowMessageConfig } from "./actions/ShowMessage";
import { useMemo, useState } from "react";
import { ActionModal } from "./ActionModal";
import { DeleteOutlined } from "@ant-design/icons";

export function ComponentEvent() {
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<typeof ComponentEvent>();
  const { curComponent, updateComponentProps } =
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
            (item: GoToLinkConfig | ShowMessageConfig, index: number) => {
              return (
                <div key={item.type + index}>
                  {item.type === "goToLink" ? (
                    <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                      <div className="text-[blue]">跳转链接</div>
                      <div>{item.url}</div>
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          cursor: "pointer",
                        }}
                        onClick={() => deleteAction(event, index)}
                      >
                        <DeleteOutlined />
                      </div>
                    </div>
                  ) : null}
                  {item.type === "showMessage" ? (
                    <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                      <div className="text-[blue]">消息弹窗</div>
                      <div>{item.config.type}</div>
                      <div>{item.config.text}</div>
                      <div style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                        onClick={() => deleteAction(event, index)}
                      ><DeleteOutlined /></div>
                    </div>
                  ) : null}
                </div>
              );
            }
          )}
        </div>
      ),
    };
  });

  function handleOk(config?: GoToLinkConfig | ShowMessageConfig) {
    if (!config || !curEvent || !curComponent) {
      return;
    }

    updateComponentProps(curComponent.id, {
      [curEvent.name]: {
        actions: [
          ...(curComponent.props[curEvent.name]?.actions || []),
          config,
        ],
      },
    });

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
      <ActionModal
        visible={actionModalOpen}
        eventConfig={curEvent!}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
    </div>
  );
}
