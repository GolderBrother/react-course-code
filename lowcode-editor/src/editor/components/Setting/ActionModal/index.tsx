import { Modal, Segmented } from "antd";
import { useMemo, useState } from "react";
import { GoToLink, GoToLinkConfig } from "../actions/GoToLink";
import { ShowMessage, ShowMessageConfig } from "../actions/ShowMessage";
// import { ComponentEvent } from "../../../stores/component-config";
import { CustomJS, CustomJSConfig } from "../actions/CustomJS";
import { ComponentMethod, ComponentMethodConfig } from "../actions/ComponentMethod";

export interface ActionModalProps {
  action?: ActionConfig
  // eventConfig: ComponentEvent;
  visible: boolean;
  handleOk: (config?: ActionConfig) => void;
  handleCancel: () => void;
}

export type ActionConfig =
  | GoToLinkConfig
  | ShowMessageConfig
  | CustomJSConfig
  | ComponentMethodConfig;

export function ActionModal(props: ActionModalProps) {
  const { action, visible, handleOk, handleCancel } = props;
  const [key, setKey] = useState<string>("GoToLink");
  const [curConfig, setCurConfig] = useState<ActionConfig>();
  const goToLinkDefaultValue = useMemo(() => {
    return action?.type === 'goToLink' ? action.url : ''
  }, [action?.url, action?.type])
  const showMessageDefaultValue = useMemo(() => {
    return action?.type === 'showMessage' ? action.config : undefined
  }, [action?.config, action?.type])
  const customJSDefaultValue = useMemo(() => {
    return action?.type === 'customJS' ? action.code : ''
  }, [action?.code, action?.type])
  return (
    <Modal
      title="事件动作配置"
      width={800}
      open={visible}
      okText="添加"
      cancelText="取消"
      onOk={() => handleOk(curConfig)}
      onCancel={handleCancel}
    >
      <div className="h-[500px]">
        <Segmented
          value={key}
          onChange={setKey}
          block
          options={["GoToLink", "ShowMessage", "ComponentMethod", "CustomJS"]}
        />
        {key === "GoToLink" && (
          <GoToLink
            value={goToLinkDefaultValue}
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
        {key === "ShowMessage" && (
          <ShowMessage
            value={showMessageDefaultValue}
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
        {
          key === 'ComponentMethod' && <ComponentMethod key="showMessage" value={action?.type === 'componentMethod' ? action.config : undefined} onChange={(config) => {
            setCurConfig(config);
          }} />
        }
        {key === "CustomJS" && (
          <CustomJS
            value={customJSDefaultValue}
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
      </div>
    </Modal>
  );
}
