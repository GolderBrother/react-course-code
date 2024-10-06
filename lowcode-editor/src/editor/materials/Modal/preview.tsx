import { Modal as AntdModal } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { CommonComponentProps } from '../../interface';

export interface ModalRef {
  open: () => void
  close: () => void
}

const Modal: React.ForwardRefRenderFunction<ModalRef, CommonComponentProps> = ({ children, title, onOk, onCancel, styles }, ref) => {

  // 通过 forwardRef + useImperativeHandle 暴露一些方法，然后给到其他组件使用，最后在 action 里配置 componentId、methods、params 来调用
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setOpen(true);
      },
      close: () => {
        setOpen(false);
      }
    }
  }, []);

  return (
    <AntdModal
      open={open}
      title={title}
      style={styles}
      onCancel={() => {
        onCancel?.();
        setOpen(false);
      }}
      onOk={() => {
        onOk?.();
      }}
      destroyOnClose
    >
      {children}
    </AntdModal>
  );
}

export default forwardRef(Modal);
