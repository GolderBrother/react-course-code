import React, { useRef } from 'react';
import './App.css';
import { animated, useSprings } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

const pages = [
  'https://images.pexels.com/photos/62689/pexels-photo-62689.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/733853/pexels-photo-733853.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/4016596/pexels-photo-4016596.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/924675/pexels-photo-924675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
]

function ViewPager() {
  const index = useRef(0);
  const width = window.innerWidth;
  // 改变 x 和 scale 属性。
  const [props, api] = useSprings(pages.length + 1, (i) => ({
    // 这里我们设置的 x，但是 react-spring 用 translate3d 来实现的
    x: i * width,
    scale: i === 0 ? 1 : i === pages.length ? 0.8 : 1,
  }));
  // movement 是拖动距离 [x, y]
  // direction 是拖动方向 [x, y]，1 代表向左（向上）、-1 代表向右（向下）。
  // active 是当前是否在拖动。
  // cancel 方法可以中止事件。
  const bindProps = useDrag(({
    active,
    movement: [mx],
    direction: [xDir],
    cancel
  }) => {
    if (active && Math.abs(mx) > width / 2) {
      // 当正在拖动并且拖动的距离超过了宽度的一半，就改变 index。
      // 改变 index 之后调用 cancel，就不再处理后续 drag 事件了。

      // index 根据移动的方向来计算，xDir 大于 0，就是向左，index 减一，反之加一
      let newIndex = index.current + (xDir > 0 ? -1 : 1);
      if (newIndex < 0) newIndex = 0;
      if (newIndex > pages.length - 1) newIndex = pages.length - 1;
      index.current = newIndex;
      cancel()
    }
    api.start(i => {
      // 根据拖动距离来计算每个元素的 x 和 scale：
      // x 根据和当前 index 的差值 * width 计算，然后加上拖动的距离。
      const x = (i - index.current) * width + (active ? mx : 0);
      const scale = active ? 1 - Math.abs(mx) / width / 2 : 1;
      return { x, scale };
    })
  });
  return (
    <div className="wrapper">
      {
        props.map(({ x, scale }, i) => (
          <animated.div
            className="page"
            {...bindProps()}
            key={i}
            style={{
              x
            }}
          >
            <animated.div style={{
              scale,
              backgroundImage: `url(${pages[i]})`,
            }}>

            </animated.div>
          </animated.div>))
      }
    </div>
  );
};

export default ViewPager;