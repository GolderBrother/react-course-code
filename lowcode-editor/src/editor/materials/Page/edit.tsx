import { useMemo } from "react";
import { CommonComponentProps } from "../../interface";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";

function Page({ id, name, children, styles }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(['Button', 'Container', 'Modal', 'Table'], id);
  const style = useMemo(() => ({
    ...styles,
    // canDrop 的话加一个 border 的高亮
    border: canDrop ? '2px solid blue' : 'none',
  }), [canDrop, styles])
  return (
    <div
      data-component-id={id}
      ref={drop}
      className='p-[20px] h-[100%] box-border'
      style={style}
    >
      {children}
    </div>
  )
}

export default Page;
