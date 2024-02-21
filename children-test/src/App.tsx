import React, { Children, FC, PropsWithChildren, ReactNode, useEffect } from 'react';
import './App.css';
interface AaaProps {
  children: React.ReactNode[]
}
// 直接用数组方法操作 children 有 3 个问题：

// 用数组的方法需要声明 children 为 ReactNode[] 类型，这样就必须传入多个元素才行，而 React.Children 不用
// 用数组的方法不会对 children 做拍平，而 React.Children 会
// 用数组的方法不能做排序，因为 children 的元素是只读的，而用 React.Children.toArray 转成数组就可以了
const Aaa: React.FC<AaaProps> = (props) => {
  const { children = [] } = props;
  // props.children 的元素是只读的，不能重新赋值，所以也就不能排序
  const arr = React.Children.toArray(children);
  // console.log(children.sort()); // 不行
  console.log(arr.sort()); // 可以
  return <div className="container">
    {/* React.Children.map 会把 children 拍平，而数组的方法不会。 */}
    {/* {Children.map(children, (child) => {
      return <div className="item">{child}</div>
    })} */}
    {/* {
      children?.map(child => <div className="item">{child}</div>)
    } */}
  </div>
}
const Aaa2: FC<AaaProps> = (props) => {
  const { children } = props;

  useEffect(() => {
    // 计数
    const count = React.Children.count(children);

    console.log('count', count);

    // 遍历
    React.Children.forEach(children, (item, index) => {
      console.log('item' + index, item);
    });

    // only 是如果 children 不是一个元素就报错
    const first = React.Children.only(children);
    console.log('first', first);
  }, []);

  return <div className='container'>
  </div>
}


// 替代 props.children 有两种方案：

// 把对 children 的修改封装成一个组件，使用者用它来手动包装
// 声明一个 props 来接受数据，内部基于它来渲染，而且还可以传入 render props 让使用者定制渲染逻辑

// function App() {
//   return (
//     <div className="App">
//       <Aaa>{
//         [<a href="#">111</a>,
//         <a href="#">222</a>,
//         [<a href="#">333</a>, <a href="#">444</a>]]}</Aaa>
//     </div>
//   );
// }

// interface RowListProps {
//   children?: React.ReactNode
// }
// const RowList: FC<RowListProps> = (props) => {
//   const { children } = props;
//   return <div className="row-list">
//     {
//       Children.map(children, (child, index) => {
//         return <div className="row-item">{child}</div>
//       })
//     }
//   </div>
// }

// const Row: FC<PropsWithChildren> = (props) => {
//   const { children } = props;
//   return <div className='row'>
//     {children}
//   </div>
// }

// const RowList: FC<PropsWithChildren> = (props) => {
//   const { children } = props;

//   return <div className='row-list'>
//     {children}
//   </div>
// }

// function App() {
//   return (
//     <div className="App">
//       {/* <RowList>
//         {33}
//         {22}
//         {11}
//       </RowList> */}
//       {/* 替代方式1：把对 children 包装的那一层封装个组件，然后外面自己来包装。 */}
//       <RowList>
//         <Row>
//           <div>111</div>
//         </Row>
//         <Row>
//           <div>222</div>
//         </Row>
//         <Row>
//           <div>333</div>
//         </Row>
//       </RowList>
//     </div>
//   );
// }


// 替代方式2：不使用 children 传入具体内容，而是自己定义一个 prop

// interface RowListProps extends PropsWithChildren {
//   items: Array<{
//     id: number,
//     content: ReactNode
//   }>
// }
// const RowList: FC<RowListProps> = (props) => {
//   const { items } = props;

//   return <div className='row-list'>
//     {
//       items.map(item => {
//         return <div className='row' key={item.id}>{item.content}</div>
//       })
//     }
//   </div>
// }

// function App() {
//   return <RowList items={[
//     {
//       id: 1,
//       content: <div>111</div>
//     },
//     {
//       id: 2,
//       content: <div>222</div>
//     },
//     {
//       id: 3,
//       content: <div>333</div>
//     }
//   ]}>
//   </RowList>
// }

// 还可以通过 render props 来定制渲染逻辑

interface Item {
  id: number,
  content: ReactNode
}
interface RowListProps extends PropsWithChildren {
  items: Array<Item>,
  renderItem: (item: Item) => ReactNode
}
const RowList: FC<RowListProps> = (props) => {
  const { items, renderItem } = props;

  return <div className='row-list'>
    {
      items.map(item => {
        return renderItem(item);
      })
    }
  </div>
}
function App() {
  return <RowList items={[
    {
      id: 1,
      content: <div>111</div>
    },
    {
      id: 2,
      content: <div>222</div>
    },
    {
      id: 3,
      content: <div>333</div>
    }
  ]}
    renderItem={(item) => {
      return <div className='row' key={item.id}>
        <div className='box'>
          {item.content}
        </div>
      </div>
    }}
  >
  </RowList>
}

export default App;
