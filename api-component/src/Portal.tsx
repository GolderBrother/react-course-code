import { forwardRef, useEffect, useMemo, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
    attach?: HTMLElement | string;
    children: React.ReactNode;
}

const Portal = forwardRef((props: PortalProps, ref) => {
    // 接收 attach、children 参数，attach 就是挂载到的 dom 节点，默认是 document.body
    const {
        attach = document.body,
        children
    } = props;

    // 在 attach 的元素下添加一个 dom 节点作为容器
    const container = useMemo(() => {
        const el = document.createElement('div');
        el.className = `portal-wrapper`;
        return el;
    }, []);

    useEffect(() => {
        const parentElement = getAttach(attach);
        parentElement?.appendChild?.(container);

        return () => {
            // 当组件销毁时，删除这个容器 dom。
            parentElement?.removeChild?.(container);
        };
    }, [container, attach]);

    // 通过 forwardRef + useImperativeHandle 把容器 dom 返回出去
    useImperativeHandle(ref, () => container);

    // 用 createPortal 把 children 渲染到 container 节点下
    return createPortal(children, container);
});

export default Portal;

// 提供一个 getAttach 方法，如果传入的是 string，就作为选择器来找到对应的 dom，如果是 HTMLElement，则直接作为挂载节点，否则，返回 document.body：
export function getAttach(attach: PortalProps['attach']) {
    if (typeof attach === 'string') {
        return document.querySelector(attach);
    }
    if (typeof attach === 'object' && attach instanceof window.HTMLElement) {
        return attach;
    }

    return document.body;
}
