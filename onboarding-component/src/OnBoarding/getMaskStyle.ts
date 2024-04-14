export function getMaskStyle(element: HTMLElement, container: HTMLElement) {
    if (!element) return {}; 
    const { 
        width,
        height,
        top,
        left
     } = element.getBoundingClientRect();

     const elementTopWithScroll = top + container.scrollTop;
     const elementLeftWithScroll = left + container.scrollLeft;

     return {
        // width、height 就是容器的包含滚动区域的宽高。
        width: container.scrollWidth,
        height: container.scrollHeight,
        borderTopWidth: Math.max(0, elementTopWithScroll),
        borderLeftWidth: Math.max(0, elementLeftWithScroll),
        borderRightWidth: Math.max(0, container.scrollWidth - width - elementLeftWithScroll),
        borderBottomWidth: Math.max(0, container.scrollHeight - height - elementTopWithScroll),
     };
}