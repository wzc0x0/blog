---
date: 2021-04-16
title: "在antd-pro中使用简易数据流替换dva的应用实践"
draft: false
tags: ["antd-pro", "react"]
categories: ["antd-pro", "react"]
---

# 前言

为什么要在 antd-pro v4+ 中用 useModel？就是因为原来的数据流管理 dva 太繁琐了！

# 什么是数据流？为什么要用数据流管理？

> **React 没有解决的问题**  
> 如果开发大应用，还需要解决一个问题。
>
> - 通信：组件之间如何通信？
> - 数据流：数据如何和视图串联起来？路由和数据如何绑定？如何编写异步逻辑？
>
> **通信问题**  
> 组件会发生三种通信。
>
> - 向子组件发消息
> - 向父组件发消息
> - 向其他组件发消息
>   React 只提供了一种通信手段：传参。对于大应用，很不方便。

# 什么是 dva

{{< blockquote author="" link="https://dvajs.com/guide/" title="DvaJS介绍"  >}}
dva 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，dva 还额外内置了 react-router 和 fetch，所以也可以理解为一个轻量级的应用框架
{{< /blockquote >}}

## dva 数据流图

{{< figure src="https://zos.alipayobjects.com/rmsportal/hUFIivoOFjVmwNXjjfPE.png" title="dva数据流" >}}

## dva 核心概念

- State：一个对象，保存整个应用状态
- View：React 组件构成的视图层
- Action：一个对象，描述事件
- connect 方法：一个函数，绑定 State 到 View
- dispatch 方法：一个函数，发送 Action 到 State

# antd-pro 中的解决方案

## 简易数据流

{{< blockquote author="UmiJS" link="https://umijs.org/zh-CN/plugins/plugin-model" title="@umijs/plugin-model"  >}}
一种基于 hooks 范式的简易数据管理方案（部分场景可以取代 dva），通常用于中台项目的全局共享数据。

我们都知道自定义 hooks 是逻辑复用的利器，但我们也知道它不能复用状态，就和 react 内置的 hooks 一样，每次调用产生的状态都是相互隔离、无关的。那么，在业务开发中，如果我们需要提取的逻辑和状态都希望能够在多个组件中『共享』，就像其他数据流管理工具（dva, mobx）一样，@umijs/plugin-model 就是一个不错的选择。
{{< /blockquote >}}

### 启用方式

`src/models` 目录下有 `hooks model` 时启用。

### 介绍

我们约定在 src/models 目录下的文件为项目定义的 model 文件。每个文件需要默认导出一个 function，该 function 定义了一个 Hook，不符合规范的文件我们会过滤掉。

文件名则对应最终 model 的 name，你可以通过插件[^footnote]提供的 API 来消费 model 中的数据。

所谓 hooks model 文件，就是自定义 hooks 模块，没有任何需要使用者关注的黑魔法。请看示例：

[^footnote]: [vscode 插件](https://marketplace.visualstudio.com/items?itemName=litiany4.umijs-plugin-model)

```ts
/**
 * @description global model
 * @requires GlobalModel
 */

import { useCallback, useState } from "react";

export interface GlobalState {
  collapsed?: boolean;
  showSide?: boolean;
  pollingData?: number;
}
export interface GlobalModel extends GlobalState {
  setGlobalModel: (globalState: GlobalState) => void;
}

export default (): GlobalModel => {
  const [globalState, setGlobalState] = useState<GlobalState>({
    collapsed: false,
    showSide: true,
    pollingData: 0,
  });
  // useCallback缓存当前函数对象
  const setGlobalModel = useCallback((globalState: GlobalState) => {
    setGlobalState((state: GlobalState) => ({
      ...state,
      ...globalState,
    }));
  }, []);
  return {
    ...globalState,
    setGlobalModel,
  };
};
```

> 说明：使用者书写的就是一个普通的自定义 hooks，但 @umijs/plugin-model 把其中的状态变成了『全局状态』，多个组件中使用该 model 时，拿到的同一份状态。

### 在组件中使用 model

`useModel`是一个 Hook，提供消费 Model 的能力，使用示例如下：

```ts
const { collapsed, showSide, pollingData, setGlobalModel } = useModel("global");
// ...
setGlobalModel({ collapsed: false });
```

useModel 有两个参数，namespace 和 updater。

- namespace - 就是 hooks model 文件的文件名，如上面例子里的 useAuthModel
- updater - 可选参数。在 hooks model 返回多个状态，但使用组件仅引用了其中部分状态，并且希望仅在这几个状态更新时 rerender 时使用（性能相关）。

## 全局初始数据

{{< blockquote author="Ant Design Pro" link="https://beta-pro.ant.design/docs/initial-state-cn" title="全局初始数据"  >}}
几乎大部分中台项目都有一个需求，就是在整个应用加载前请求用户信息或者一些全局依赖的基础数据。这些信息通常会用于 Layout 上的基础信息（通常是用户信息），权限初始化，以及很多页面都可能会用到的基础数据。

在中台最佳实践中，我们提供了一个极简的方式来初始化这部分数据，并且和 Layout 以及权限打通。该方案基于 umi 插件 @umijs/plugin-initial-state。
{{< /blockquote >}}

### 启用方式

在 `src/app.ts` 并且导出 `getInitialState` 方法时启用。

### 初始化数据

`src/app.ts`示例如下：

```ts
export async function getInitialState() {
  await handleLogin();
  try {
    //接口拿到数据
    const { data: currentUser } = await getUserInfo();
    const { data: storeList } = await getDrugStoreList();
    const { data: channelList } = await getChannelLists();
    return {
      ...currentUser,
      // 渠道列表
      channelList: channelList || [],
      storeList,
    };
  catch (error) {
    history.replace(`/introduction?pathname=${encodeURIComponent(window.location.pathname)}`);
  };
}
```

### 在组件中消费

`useModel` namespace 为 `@@initialState` 拿到就是全局数据。

```tsx
const { initialState, loading, refresh, setInitialState } = useModel(
  "@@initialState"
);
const { channelList, storeList } = initialState;
```

# 参考文档

- [DvaJS-入门课](https://dvajs.com/guide/introduce-class.html)
- [Ant Design Pro](https://beta-pro.ant.design/)
- [UmiJS](https://umijs.org/zh-CN/plugins/plugin-model#usemodel)
