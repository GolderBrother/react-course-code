import { useContext } from 'react';
import { ConfigContext } from './ConfigProvider';
import { MessageRef } from '..';

export function useMessage(): MessageRef {
    // 从 context 中拿到 messageRef，返回其中的 api。
    const { messageRef } = useContext(ConfigContext);

    if (!messageRef) {
        throw new Error('请在最外层添加 ConfigProvider 组件');
    }

    return messageRef.current!;
}
