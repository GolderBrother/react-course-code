import React from "react";
import classnames from "classnames";
import './index.scss';

export interface BaseIconProps {
    className?: string;
    style?: React.CSSProperties;
    size?: string | string[];
    spin?: boolean;
};
export type IconProps = BaseIconProps & Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

/**
 * 获取图标宽度
 * size 可以传 [10px, 10px] 分别指定宽高，也可以传 10px 来同时指定宽高，所以要做下处理。
 * @param size 
 * @returns 
 */
export const getSize = (size: IconProps['size']) => {
    if (Array.isArray(size) && size.length === 2) return size as string[];
    const width = (size as string) || '1em';
    const height = (size as string) || '1em';

    return [width, height];
};
// 使用 forwardRef 来把 svg 的 ref 转发出去
export const Icon = React.forwardRef<SVGSVGElement, React.PropsWithChildren<IconProps>>((props: IconProps, ref) => {
    const {
        className,
        style,
        children,
        spin,
        // size 默认为 1em 也就是用 font-size 的大小
        size = '1em',
        ...rest
    } = props;

    const [width, height] = getSize(size);
    const cs = classnames('icon', {
        'icon-spin': spin
    }, className);
    return <svg
        ref={ref}
        fill="currentColor"
        className={cs}
        style={style}
        width={width}
        height={height}
        {...rest}
    >
        {children}
    </svg>



});