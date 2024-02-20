import { useMemo, type FC, useRef } from 'react';
import { Color } from './color';
import Handler from './Handler';
import Transform from './Transform';
import useColorDrag from './hooks/useColorDrag';
import { calculateColor, calculateOffset } from './utils';


const Palette: FC<{
    color: Color,
    onChange: (color: Color) => void;
}> = ({ color, onChange }) => {
    const computedStyle = useMemo(() => ({
        backgroundColor: `hsl(${color.toHsl().h},100%, 50%)`,
        backgroundImage:
            'linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))',
    }), [color]);
    const transformRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [offset, dragStartHandle] = useColorDrag({
        containerRef,
        color,
        targetRef: transformRef,
        onDragChange: (offsetValue: any) => {
            console.log(offsetValue);
            const newColor = calculateColor({
                offset: offsetValue,
                containerRef,
                targetRef: transformRef,
                color
            });
            onChange?.(newColor);
        },
        calculate: () => {
            return calculateOffset(containerRef, transformRef, color)
        }
    });

    return (
        <div 
        ref={containerRef}
        className="color-picker-panel-palette"
        onMouseDown={dragStartHandle}
    >
        <Transform ref={transformRef} offset={{x: offset.x, y: offset.y}}>
            <Handler color={color.toRgbString()}/>
        </Transform>
        <div 
            className={`color-picker-panel-palette-main`}
            style={computedStyle}
        />
    </div>
    );
};

export default Palette;
