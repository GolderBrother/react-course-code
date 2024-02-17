// react-transition-group 是通过改变 className 来给组件加上的过渡效果的。

import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import "./app-react-transition-group.css";

function AppReactTransitionGroup() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 3000);
    return () => clearInterval(timer)
  }, []);
  return (
    <>
      <CSSTransition
        // 参数 in 设置为 true 就是触发进入的动画，设置为 false 就是触发离开的动画
        in={show}
        appear={true}
        // (1)当 in 变为 true 的时候，会触发进入的动画，依次给元素加上 .enter、.enter-active、.enter-done 的 className。
        // CSSTransition 组件会先设置 enter，再设置 enter-active，这样就触发动画了。
        // 然后到了 timeout 参数的时间，就会设置 enter-done 的 className。
        // (2)如果 in 的参数改为 false，就会触发离开动画
        timeout={1000}
      >
        <div id="box"></div>
      </CSSTransition>
      {/* 通过 className 从 enter 到 enter-active 到 enter-done 的变化，以及从 exit 到 exit-active 到 exit-done 的变化，就实现了进入和离开的动画。 */}
      <button onClick={() => setShow(!show)}>{show ? '离开' : '进入'}</button>
    </>
  );
}
export default AppReactTransitionGroup;