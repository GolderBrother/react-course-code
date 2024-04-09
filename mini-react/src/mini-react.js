(() => {
  // 为什么有两个 root 呢？

  // 因为初始渲染会生成一个 fiber 链表，然后后面 setState 更新会再生成一个新的 fiber 链表，两个 fiber 链表要做一些对比里决定对 dom 节点的增删改，所以都要保存。

  // 用 nextUnitOfWork 指向下一个要处理的 fiber 节点
  let nextUnitOfWork = null;
  // 当前正在处理的 fiber 链表的根 wipRoot
  let wipRoot = null;
  // 之前的历史 fiber 链表的根 currentRoot
  let currentRoot = null;
  // 要删除的节点
  let deletions = null;

  // 从 wipRoot 开始，逐渐 reconcile 构建新的 fiber 节点
  // 根据 FunctionComponent 还是原生标签（HostComponent）来分别执行函数和创建 dom
  // 并且还对新旧的 fiber 节点做了 diff，搭上增删改标记。
  function render(element, container) {
    wipRoot = {
      dom: container,
      props: {
        children: [element],
      },
      alternate: currentRoot,
    };
    // render的时候初始化
    deletions = [];
    nextUnitOfWork = wipRoot;
  }

  function workLoop(deadline) {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
      nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      // 每次跑的时候判断下 timeRemaining 是否接近 0，是的话就中断循环，等下次 requestIdleCallback 的回调再继续处理 nextUnitOfWork 指向的 fiber 节点
      shouldYield = deadline.timeRemaining() < 1;
    }

    // requestIdleCallback 在不断进行，每次处理一部分 fiber 的 reconcile。
    // 我们只要在 reconcile 结束，也就是没有 nextUnitOfWork 的时候执行 commit 就行了
    if (!nextUnitOfWork && wipRoot) {
      commitRoot();
    }

    requestIdleCallback(workLoop);
  }

  requestIdleCallback(workLoop);

  /**
   * 先把需要删除的节点都删掉，然后遍历 fiber 链表，处理其它节点
   */
  function commitRoot() {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    // 处理 effect
    commitEffectHooks();
    currentRoot = wipRoot;
    wipRoot = null;
  }

  function commitEffectHooks() {
    function runCleanup(fiber) {
      if (!fiber) return;

      // 先遍历一遍执行所有的 cleanup 函数，然后再次遍历执行 effect 函数。
      fiber.alternate?.effectHooks?.forEach((hook, index) => {
        const deps = fiber.effectHooks[index].deps;

        // 当没有传入 deps 数组，或者 deps 数组和上次不一致时，就执行 cleanup 函数
        if (!hook.deps || !isDepsEqual(hook.deps, deps)) {
          hook.cleanup?.();
        }
      });

      // 遍历 fiber 链表也是递归处理每个节点，每个节点递归处理 child、sibling
      runCleanup(fiber.child);
      runCleanup(fiber.sibling);
    }

    function run(fiber) {
      if (!fiber) return;

      fiber.effectHooks?.forEach((newHook, index) => {
        // 当没有 alternate 的时候，就是首次渲染，直接执行所有的 effect。
        if (!fiber.alternate) {
          newHook.cleanup = newHook.callback();
          return;
        }

        // 否则，如果没传入 deps 或者 deps 数组变化的时候再执行 effect 函数
        if (!newHook.deps) {
          newHook.cleanup = newHook.callback();
        }

        if (newHook.deps.length > 0) {
          const oldHook = fiber.alternate?.effectHooks[index];

          if (!isDepsEqual(oldHook.deps, newHook.deps)) {
            newHook.cleanup = newHook.callback();
          }
        }
      });

      run(fiber.child);
      run(fiber.sibling);
    }

    // 当没有传入 deps 数组，或者 deps 数组和上次不一致时，就执行 cleanup 函数
    runCleanup(wipRoot);
    // 之后才会重新执行 effect
    run(wipRoot);
  }

  function isDepsEqual(deps, newDeps) {
    if (deps.length !== newDeps.length) {
      return false;
    }

    for (let i = 0; i < deps.length; i++) {
      if (deps[i] !== newDeps[i]) {
        return false;
      }
    }
    return true;
  }

  function commitWork(fiber) {
    if (!fiber) {
      return;
    }

    // 不断向上找，找到可以挂载的 dom 节点。
    let domParentFiber = fiber.return;
    while (!domParentFiber.dom) {
      domParentFiber = domParentFiber.return;
    }

    const domParent = domParentFiber.dom;

    // 按照增增删改的 effectTag 来分别做处理。
    if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
      domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === "DELETION") {
      commitDeletion(fiber, domParent);
    }

    // 按照 child、sibling 的顺序来递归遍历 fiber 链表
    commitWork(fiber.child);
    commitWork(fiber.sibling);
  }

  function commitDeletion(fiber, domParent) {
    // 删除的时候，如果当前 fiber 节点没有对应的 dom，就不断 child 向下找。
    if (fiber.dom) {
      domParent.removeChild(fiber.dom);
    } else {
      commitDeletion(fiber.child, domParent);
    }
  }

  requestIdleCallback(workLoop);

  function performUnitOfWork(fiber) {
    // 处理每个 fiber 节点的时候，要根据类型做不同的处理
    const isFunctionComponent = fiber.type instanceof Function;
    // 判断下是函数组件（FunctionComponent），还是原生标签（HostComponent），分别做处理
    if (isFunctionComponent) {
      // 函数组件就是传入 props 调用它，并且函数组件的返回值就是要继续 reconcile 的节点
      updateFunctionComponent(fiber);
    } else {
      // 对于原生标签（HostComponent），就是创建它对应的 dom 节点
      updateHostComponent(fiber);
    }

    // 子 => 弟 => 父 => 子 => 弟 => 父
    // 按照 child、sibling、return 的顺序返回下一个要处理的 fiber 节点
    if (fiber.child) return fiber.child;
    let nextFiber = fiber;
    // 通过这种顺序来把 fiber 树变为链表的形式
    while (nextFiber) {
      if (nextFiber.sibling) return nextFiber.sibling;
      nextFiber = nextFiber.return;
    }
  }

  let wipFiber = null;
  let stateHookIndex = null;

  function updateFunctionComponent(fiber) {
    // 用 wipFiber 指向当前处理的 fiber（之前的 nextUnitOfWork 是指向下一个要处理的 fiber 节点）
    wipFiber = fiber;
    stateHookIndex = 0;
    // useState 的 state 和 useEffect 的 effect 存在 Fiber 上
    // 用一个 stateHooks 数组来存储 useState 的 hook 的值，用 effectHooks 数组存储 useEffect 的 hook 的值。
    wipFiber.stateHooks = [];
    wipFiber.effectHooks = [];

    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
  }

  function updateHostComponent(fiber) {
    // 对于原生标签（HostComponent），就是创建它对应的 dom 节点
    if (!fiber.dom) {
      fiber.dom = createDOM(fiber);
    }
    reconcileChildren(fiber, fiber.props.children);
  }

  /**
   * reconcile子节点
   * @param {*} wipFiber
   * @param {*} elements
   */
  function reconcileChildren(wipFiber, elements) {
    let index = 0;
    // 拿到 alternate 的 child，依次取 sibling，逐一和新的 fiber 节点对比
    let oldFiber = wipFiber.alternate?.child;
    let prevSibling = null;

    while (index < elements.length || oldFiber != null) {
      const element = elements[index];
      let newFiber = null;

      // diff 两个 fiber 链表也比较简单，就是判断节点 type 是不是一样。
      const sameType = oldFiber && element && element.type === oldFiber.type;
      // 当 reconcile 创建新的 fiber 树的时候，就可以和之前的做 diff，判断是新增、修改、删除，打上对应的标记(effectTag)

      // 如果一样，就是修改(v)
      if (sameType) {
        newFiber = {
          // 类型
          type: oldFiber.type,
          // 参数
          props: element.props,
          dom: oldFiber.dom,
          return: wipFiber,
          // 旧的 fiber 节点
          alternate: oldFiber,
          // 增删改的标记
          effectTag: "UPDATE",
        };
      }

      // 不一样，那就是删除(DELETION)或者新增(PLACEMENT)，打上对应的标记
      if (element && !sameType) {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          return: wipFiber,
          alternate: null,
          effectTag: "PLACEMENT",
        };
      }

      if (oldFiber && !sameType) {
        oldFiber.effectTag = "DELETION";
        deletions.push(oldFiber);
      }

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      // 根据对比结果来创建新的 fiber 节点，也是先 child 后 sibling 的方式：
      if (index === 0) {
        wipFiber.child = newFiber;
      } else if (element) {
        prevSibling.sibling = newFiber;
      }

      prevSibling = newFiber;
      index++;
    }
  }

  function createDOM(fiber) {
    const dom =
      fiber.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type);
    updateDom(dom, {}, fiber.props);
    return dom;
  }

  const isEvent = (key) => key.startsWith("on");
  const isProperty = (key) => key !== "children" && !isEvent(key);
  const isNew = (prev, next) => (key) => prev[key] !== next[key];
  const isGone = (prev, next) => (key) => !(key in next);

  function updateDom(dom, prevProps, nextProps) {
    // 先删除旧的事件监听器
    Object.keys(prevProps)
      .filter(isEvent)
      .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
      .forEach((name) => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
      });
    // 删除旧的属性
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach((name) => {
        dom[name] = "";
      });

    // 添加新的属性
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach((name) => {
        dom[name] = nextProps[name];
      });

    // 添加新的事件监听器
    Object.keys(nextProps)
      .filter(isEvent)
      .filter(isNew(prevProps, nextProps))
      .forEach((name) => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, nextProps[name]);
      });
  }

  function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) => {
          const isTextNode =
            typeof child === "string" || typeof child === "number";
          return isTextNode ? createTextNode(child) : child;
        }),
      },
    };
  }

  function createTextNode(nodeValue) {
    return {
      type: "TEXT_ELEMENT",
      // 文本节点是没有 type、children、props
      // 加个固定的 type TEXT_ELEMENT，并且设置 nodeValue 的 props。这样结构统一，方便后面处理
      props: {
        nodeValue,
        children: [],
      },
    };
  }

  function useState(initialState) {
    const currentFiber = wipFiber;
    const oldHook = wipFiber.alternate?.stateHooks?.[stateHookIndex];

    // 每次调用 useState 时会在 stateHooks 添加一个元素来保存 state：
    const stateHook = {
      // state 的初始值是前面一次渲染的 state 值，也就是取 alternate 的同一位置的 state：
      state: oldHook ? oldHook.state : initialState,
      queue: oldHook ? oldHook.queue : [],
    };

    // 累计计算 state, 这样对初始 state 执行多个 action（也就是 setState） 之后，就拿到了最终的 state 值。
    stateHook.queue.forEach((action) => {
      stateHook.state = action(stateHook.state);
    });

    // 修改完 state 之后清空 queue。
    stateHook.queue = [];

    stateHookIndex++;
    // 在 fiber 节点上用 stateHooks 数组来存储 state，还有多次调用 setState 的回调函数。
    wipFiber.stateHooks.push(stateHook);

    function setState(action) {
      const isFunction = typeof action === "function";

      stateHook.queue.push(isFunction ? action : () => action);

      // setState 就是在 action 数组里添加新的 action，并且让 nextUnitOfWork 指向新的 wipRoot，从而开始新的一轮渲染
      wipRoot = {
        ...currentFiber,
        alternate: currentFiber,
      };
      nextUnitOfWork = wipRoot;
    }

    return [stateHook.state, setState];
  }

  function useEffect(callback, deps) {
    // 就是在 fiber.effectHooks 上添加一个元素。
    // 这样，等 reconcile 结束，fiber 链表就构建好了，在 fiber 上打上了增删改的标记，并且也保存了要执行的 effect。
    const effectHook = {
      callback,
      deps,
      cleanup: null,
    };
    wipFiber.effectHooks.push(effectHook);
  }

  const MiniReact = {
    createElement,
    render,
    useState,
    useEffect,
  };

  window.MiniReact = MiniReact;
})();
