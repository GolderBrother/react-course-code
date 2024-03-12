# 实现了 Message 组件。

它的核心就是一个列表元素的增删改，然后用 react-transition-group 加上过渡动画。

这个列表可以通过 createPortal 渲染到 body 下。

但是难点在于如何在 api 的方式来动态添加这个组件。

acro desigin 等都是用重新渲染一个 root 的方式来做的，但是这种会报警告，不建议用。

我们是通过 forwardRef + context 转发来实现的：

唯一要注意的问题就是需要直接修改 ref.current，而不是用 useImperativeHandle 来修改。

useImperative 的好处是可以在依赖数组改变的时候重新执行回调函数来修改 ref，但坏处是它不是同步修改 ref 的，有的时候不太合适。

这样，Message 组件就完成了。

这个组件还是比较复杂的，涉及到 ref 转发，context ，过渡动画，portal 等，还封装了两个自定义 hook，大家可以自己写一遍。

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
