import { useCallback, useEffect, useRef } from 'react';

export function useMountedState(): () => boolean {
  const mountedRef = useRef<boolean>(false);
  // 使用 useRef 而不是 useState 保存 mount 的值是因为修改 ref.current 并不会引起组件重新渲染。
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return get;
}
