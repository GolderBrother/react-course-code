/* eslint-disable @typescript-eslint/ban-types */
import { useEffect } from 'react';

export const useLifeCycles = (mount: Function, unmount?: Function) => {
  useEffect(() => {
    if (mount) {
      mount();
    }
    return () => {
      if (unmount) {
        unmount();
      }
    };
  }, []);
};

