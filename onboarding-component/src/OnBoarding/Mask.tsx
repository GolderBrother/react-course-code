import { CSSProperties, FC, useEffect, useState } from "react";
import { getMaskStyle } from "./getMaskStyle";
import "./index.scss";

interface MaskProps {
    element: HTMLElement;
    container?: HTMLElement;
    renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;
    onAnimationStart?: () => void;
    onAnimationEnd: () => void
}
export const Mask: FC<MaskProps> = (props) => {
    const {
        element,
        renderMaskContent,
        container,
        onAnimationStart,
        onAnimationEnd,
    } = props;
    const [style, setStyle] = useState<CSSProperties>();
    const calculateAndSetStyle = (element: HTMLElement, container: HTMLElement) => {
        // 这里传入的 element、container 分别是目标元素、遮罩层所在的容器
        // 计算 width、height、border-width 的样式
        const style = getMaskStyle(element, container || document.documentElement);
        setStyle(style);
    };
    useEffect(() => {
        // 在窗口改变大小的时候，需要重新计算 mask 样式
        const observer = new ResizeObserver(() => {
            calculateAndSetStyle(element, container || document.documentElement);
        });
        observer.observe(container || document.documentElement);

        return () => {
            observer.disconnect();
        }
    }, [container, element]);
    // 因为 mask 的样式变化有个动画（200ms过渡）的过程，要等动画结束计算的 style 才准确。
    // 所以给 Mask 组件加一个动画开始和结束的回调
    useEffect(() => {
        onAnimationStart?.();
        // 动画结束后，清除样式
        const timer = setTimeout(() => {
            onAnimationEnd?.();
        }, 200); //200ms过渡
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        }
    }, []);
    useEffect(() => {
        if (!element) return;
        // 把目标元素滚动到可视区域
        element.scrollIntoView({
            block: 'center', // 垂直方向
            inline: 'center' // 水平方向getMaskStyle
        });
        // 这里传入的 element、container 分别是目标元素、遮罩层所在的容器
        // 计算 width、height、border-width 的样式
        calculateAndSetStyle(element, container || document.documentElement);
    }, [container, element]);
    const getMaskContent = () => {
        if (!renderMaskContent) return null;
        // 在内部加了一个宽高为 100% 的 div，把它暴露出去，外部就可以用它来加 Popover 或者其他内容
        return renderMaskContent(<div className="mask-content" style={{
            width: '100%',
            height: '100%',
        }}>
        </div>);
    }
    return <div style={style} className="mask">{getMaskContent()}</div>
}