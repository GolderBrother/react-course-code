import React, { FC, ReactElement, useCallback } from 'react';
import copy from 'copy-to-clipboard';

interface CopyToClipboardOptions {
    debug?: boolean;
    message?: string;
    format?: string;
}

interface CopyToClipboardProps {
    text: string;
    children: ReactElement;
    onCopy?: (text: string, result: boolean) => void;
    options?: CopyToClipboardOptions;
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({ text, onCopy, options, children, ...props }) => {
    const onClick = useCallback((event: any) => {
        const elem = React.Children.only(children);
        // 执行复制
        const result = copy(text, options);

        // 执行复制成功后的回调函数
        if (onCopy) {
            onCopy(text, result);
        }

        // 调用元素原来的 onClick 事件
        if (elem && elem.props && typeof elem.props.onClick === 'function') {
            elem.props.onClick(event);
        }
    }, [text, onCopy, options, children]);

    //   React.Children.only 是用来断言 children 只有一个元素，如果不是就报错
    const elem = React.Children.only(children);

    return React.cloneElement(elem, { ...props, onClick });
};