import { useState } from 'react'
import logo from './logo.svg'
import KeepAliveLayout, { useKeepOutlet } from './keepalive'
import './App.css'

import { Link, Outlet, RouterProvider, createBrowserRouter, useLocation, useOutlet } from 'react-router-dom';

const Layout = () => {
  const { pathname } = useLocation();
  // const element = useOutlet();
  const keepOutlet = useKeepOutlet();
  return (
    <div>
      <div>当前路由: {pathname}</div>
      {/* 通过 Outlet 指定渲染二级路由的地方 */}
      {/* <Outlet /> */}
      { keepOutlet }
    </div>
  )
}

const Aaa = () => {
  const [count, setCount] = useState(0);

  return <div>
    <p>{count}</p>
    <p>
      <button onClick={() => setCount(count => count + 1)}>加一</button>
    </p>
    <Link to='/bbb'>去 Bbb 页面</Link><br />
    <Link to='/ccc'>去 Ccc 页面</Link>
  </div>
};

const Bbb = () => {
  const [count, setCount] = useState(0);

  return <div>
    <p>{count}</p>
    <p><button onClick={() => setCount(count => count + 1)}>加一</button></p>
    <Link to='/'>去首页</Link>
  </div>
}

const Ccc = () => {
  return <div>
    <p>ccc</p>
    <Link to='/'>去首面</Link>
  </div>
};

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Aaa></Aaa>,
      },
      {
        path: "/bbb",
        element: <Bbb></Bbb>
      },
      {
        path: "/ccc",
        element: <Ccc></Ccc>
      }
    ]
  }
];

export const router = createBrowserRouter(routes);

function App() {
  return <KeepAliveLayout
    keepPaths={['/bbb']}
  ><RouterProvider router={router}/></KeepAliveLayout>
}

export default App
