import { useEffect, useRef, useState } from 'react';
import { TransformOffset } from '../Transform';
import { Color } from '../color';

// MouseEvent 是 ts 内置的鼠标事件类型，而 React.MouseEvent 是 react 提供鼠标事件类型。
type EventType =
    | MouseEvent
    | React.MouseEvent<Element, MouseEvent>

type EventHandle = (e: EventType) => void;

interface useColorDragProps {
    offset?: TransformOffset;
    color: Color;
    containerRef: React.RefObject<HTMLDivElement>;
    targetRef: React.RefObject<HTMLDivElement>;
    direction?: 'x' | 'y';
    onDragChange?: (offset: TransformOffset) => void;
    calculate?: () => TransformOffset;
}

function useColorDrag(
    props: useColorDragProps,
): [TransformOffset, EventHandle] {
    const {
        offset,
        color,
        targetRef,
        containerRef,
        direction,
        onDragChange,
        calculate
    } = props;

    // 保存 offset 的 state，
    const [offsetValue, setOffsetValue] = useState(offset || { x: 0, y: 0 });
    // 保存是否在拖动中的标记
    const dragRef = useRef({
        flag: false
    });


    useEffect(() => {
        if (dragRef.current.flag === false) {
          const calcOffset = calculate?.();
          if (calcOffset) {
            setOffsetValue(calcOffset);
          }
        }
      }, [color]);
      
    useEffect(() => {
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragStop);
    }, []);

    /**
     * 实现拖动过程中的 offset 的计算
     * @param e 
     */
    const updateOffset: EventHandle = e => {
        // e.pageX 和 e.pageY 是距离页面顶部和左边的距离。
        // 减去 scrollLeft 和 scrollTop 之后就是离可视区域顶部和左边的距离了。
        // 然后减去 handler 圆点点的半径。
        // 这样算出来的就是按住 handler 圆点的中心拖动的效果。
        // 但是拖动不能超出 container 的区域，所以用 Math.max 来限制在 0 到 width、height 之间拖动。
        // 这里如果传入的 direction 参数是 x，那么就只能横向拖动，是为了下面的 Slider 准备的：
        const scrollXOffset = document.documentElement.scrollLeft || document.body.scrollLeft;
        const scrollYOffset = document.documentElement.scrollTop || document.body.scrollTop;
    
        const pageX = e.pageX - scrollXOffset;
        const pageY = e.pageY - scrollYOffset;
    
        const { 
            x: rectX,
            y: rectY,
            width,
            height
        } = containerRef.current!.getBoundingClientRect();
    
        const { 
            width: targetWidth,
            height: targetHeight
        } = targetRef.current!.getBoundingClientRect();
    
        const centerOffsetX = targetWidth / 2;
        const centerOffsetY = targetHeight / 2;
    
        const offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
        const offsetY = Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;
    
        const calcOffset = {
            x: offsetX,
            y: direction === 'x' ? offsetValue.y : offsetY,
        };
    
        setOffsetValue(calcOffset);
        onDragChange?.(calcOffset);
    };
    

    // mouseup 的时候去掉事件监听器。
    const onDragStop: EventHandle = e => {
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragStop);

        dragRef.current.flag = false;
    };

    // mousemove 的时候根据 event 修改 offset。
    const onDragMove: EventHandle = e => {
        e.preventDefault();
        updateOffset(e);
    };

    const onDragStart: EventHandle = e => {
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragStop);

        dragRef.current.flag = true;
    };

    return [offsetValue, onDragStart];
}

export default useColorDrag;
