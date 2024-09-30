import { CommonComponentProps } from '../../interface';
import { useMemo } from 'react';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';

const Container = ({ id, children, styles }: CommonComponentProps) => {
  const { canDrop, drop } = useMaterialDrop(['Button', 'Container'], id);
  const className = useMemo(() => `min-h-[100px] p-[20px] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`, [canDrop])

  return (
    <div
      data-component-id={id}
      ref={drop}
      className={className}
      style={styles}
    >{children}</div>
  )
}

export default Container;
