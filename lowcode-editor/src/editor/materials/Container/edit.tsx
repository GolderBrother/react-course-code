import { CommonComponentProps } from '../../interface';
import { useEffect, useMemo, useRef } from 'react';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';
import { useDrag } from 'react-dnd';

const Container = ({ id, children, styles }: CommonComponentProps) => {
  const divRef = useRef<HTMLDivElement | null>(null)
  const { canDrop, drop } = useMaterialDrop(['Button', 'Container', 'Modal', 'Table'], id);
  const className = useMemo(() => `min-h-[100px] p-[20px] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`, [canDrop])
  const [_, drag] = useDrag({
    type: 'Button',
    item: {
      type: 'Button',
      dragType: 'move',
      id
    }
  });

  useEffect(() => {
    // 要同时给 div 绑定 drag、drop 的处理，所以用 useRef 拿到 ref 之后再绑定
    drop(divRef)
    drag(divRef)
  }, [drag, drop])
  return (
    <div
      data-component-id={id}
      ref={divRef}
      className={className}
      style={styles}
    >{children}</div>
  )
}

export default Container;
