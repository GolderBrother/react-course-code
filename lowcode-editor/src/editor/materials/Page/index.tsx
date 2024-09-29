import { useMemo } from "react";
import { CommonComponentProps } from "../../interface";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";

function Page({ id, name, children }: CommonComponentProps) {
  const {canDrop, drop } = useMaterialDrop(['Button', 'Container'], id);
  const style = useMemo(() => ({
    // canDrop 的话加一个 border 的高亮
    border: canDrop ? '2px solid blue' : 'none',
  }), [canDrop])
  return (
    <div
      ref={drop}
      className='p-[20px] h-[100%] box-border'
      style={style}
    >
      {children}
    </div>
  )
}

export default Page;
