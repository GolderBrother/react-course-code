# 使用 react-dnd 实现了拖拽排序

## 1、react-dnd 主要就是 useDrag、useDrop、useDragLayout 这 3 个 API。

## 2、拖拽api说明

- useDrag 是给元素添加拖拽，指定 item、type、collect 等参数。

- useDrop 是给拖拽释放到的元素添加 drop，指定 accept、drop、hover、collect 等参数。

- useDragLayout 是自定义预览，可以通过 monitor 拿到拖拽的实时位置。

  - 使用 useDrag 处理拖拽的元素，使用 useDrop 处理 drop 的元素，使用 useDragLayer 处理自定义预览元素
    在根组件使用 DndProvider 设置 context 来传递数据
    useDrag 可以传入 type、item、collect 等。type 标识类型，同类型才可以 drop。item 是传递的数据。collect 接收 monitor，可以取拖拽的状态比如 isDragging 返回。
    useDrag 返回三个值，第一个值是 collect 函数返回值，第二个是处理 drag 的元素的函数，第三个值是处理预览元素的函数
    useDrop 可以传入 accept、drop 等。accept 是可以 drop 的类型。drop 回调函数可以拿到 item，也就是 drag 元素的数据
    useDragLayer 的回调函数会传入 monitor，可以拿到拖拽的实时坐标，用来设置自定义预览效果

## 3、拖拽效果实现

- 此外，最外层还要加上 DndProvider，用来组件之间传递数据。

- 其实各种拖拽功能的实现思路比较固定：什么元素可以拖拽，什么元素可以 drop，drop 或者 hover 的时候修改数据触发重新渲染就好了。

- 比如拖拽排序就是 hover 的时候互换两个 index 的对应的数据，然后 setState 触发渲染。

- 用 react-dnd，我们能实现各种基于拖拽的功能。

## 4、启动
```bash
npm install
npm run start
```