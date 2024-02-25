import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { useDrag, useDragLayer, useDrop } from 'react-dnd';
import classnames from 'classnames';
import { getEmptyImage } from 'react-dnd-html5-backend';

interface ItemType {
  color: string;
}
interface BoxProps {
  color: string
}
function DragLayer() {
  // useDragLayer 的回调函数会传入 monitor，可以拿到拖拽的实时坐标，用来设置自定义预览效果
  const { isDragging, item, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset()
  }));
  if (!isDragging) return null;
  const style = {
    left: currentOffset?.x,
    top: currentOffset?.y,
  };
  return <div className="drag-layer" style={style}>{item.color}</div>

}
function Box(props: BoxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  // useDrag 的第三个参数就是处理预览元素的
  const [{
    dragging
  }, drag, dragPreview] = useDrag({
    type: 'box',
    item: {
      color: props.color
    },
    collect(monitor) {
      return {
        dragging: monitor.isDragging()
      };
    }
  });
  const style = useMemo(() => {
    return {
      background: props.color || 'blue'
    }
  }, [props.color]);
  const cs = classnames('box', {
    'dragging': dragging
  });

  useEffect(() => {
    drag(ref);
    dragPreview(getEmptyImage(), { captureDraggingState: true });
  }, [drag, dragPreview]);
  return <div ref={ref} className={cs} style={style}>dragging:{dragging}</div>
}

function Container() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [boxes, setBoxes] = useState<ItemType[]>([]);
  // 用 useDrop 让它可以接受拖拽过来的元素。
  const [, drop] = useDrop(() => {
    return {
      // 接收 useDrag 的时候声明的 type 的元素。
      accept: 'box',
      drop(item: ItemType) {
        const newBoxes = [...boxes, item];
        console.log('newBoxes', newBoxes);
        // setBoxes(newBoxes);
        setBoxes((boxes) => [...boxes, item])
      },
    };
  });
  useEffect(() => {
    drop(ref);
  }, [drop]);
  return <div ref={drop} className="container">
    {
      boxes.map((item, index) => <Box key={index} color={item.color}></Box>)
    }
  </div>
}

function App() {
  return <div>
    <Container></Container>
    <Box color='blue'></Box>
    <Box color='red'></Box>
    <Box color='green'></Box>
    <DragLayer></DragLayer>
  </div>
}

export default App;
