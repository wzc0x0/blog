---
date: 2019-07-17
lastmod: 2019-07-17
title: "面向现代浏览器部署代码"
draft: false
tags: ["JavaScript", "JavaScript", "webpack"]
categories: ["JavaScript"]
---

# 前言

笔者最早在[vue-cli3（vue 的工具链）](https://cli.vuejs.org/zh/guide/browser-compatibility.html#%E7%8E%B0%E4%BB%A3%E6%A8%A1%E5%BC%8F)中看到的这种前端代码的部署方式，并在生产环境做了部署，但是各种原因并没有发现什么优势。不过这是一个很酷的技术，笔者尝试很多种方式也未能自己实现类似的在 vue 框架下的现代打包方式。

# 什么是现代打包方式

{{< blockquote author="Philip Walton" link="https://philipwalton.com/articles/deploying-es2015-code-in-production-today/" >}}
Deploying ES2015+ Code in Production Today

尽管目前所有的前沿浏览器都能运行 ES2015+ 代码（译注：ES2015 及俗称的 ES6），自然也能够支持我刚刚列举的新特性，，但是为了兼容占有小比例的低版本浏览器用户，大部分的开发者仍然使用 polyfills 将代码编译成 ES5 语法。

这种情况无疑糟透了，在理想的世界里，我们将无需输送不必要的代码！

_该文的中文翻译:
https://jdc.jd.com/archives/4911_
{{< /blockquote >}}

简单的来讲，`JavaScript`新的版本语法特性、api 等无法和老版本浏览器兼容。但是开发者还想使用新的语法特性，怎么办呢？这个时候就该[babeljs](https://babeljs.io/)出场了。

配合`babeljs`和各类的`polyfill`(实现某个 api 的 JS 包，用来补齐 JS 运行环境 api 缺失)，前端开发者可以书写任意版本的 JS 语法和 JS 相关 api 而不用考虑浏览器兼容性问题。

然而随着浏览器版本的更新，老版本浏览器市场占比越来越低，而为了兼容那一小撮老版的浏览器，增加各类的`polyfill`代码包、`babeljs`转义代码，这也将不再合适。

然而毕竟有老版本浏览器在使用不能放弃他们，所以面向现代模式的 JS 打包方式应运而生。

{{% notice tip babel一词的来历 %}}
**babel** 一词来自《圣经·旧约》的记载巴别塔。当时的人们想要修筑直上云霄的巴别塔和上帝同在，被上帝惩罚所有人说不同的语言，最后大家因为语言不通各自离开，巴别塔也没有建成。这里 babeljs 借用这个寓意让不同的 js 语法都能转换成一种。
{{% /notice %}}

# 现代模式的实现方式

这里摘抄 vue-cli3 实现方式：

```sh
vue-cli-service build --modern
```

通过 `--modern` npm 参数构建两种 JS 包，一个现代版的包，面向支持 ES modules 的现代浏览器，另一个旧版的包，面向不支持的旧浏览器。

- 现代版的包会通过 `<script type="module">` 在被支持的浏览器中加载；它们还会使用`<link rel="modulepreload">` 进行预加载。
- 旧版的包会通过 `<script nomodule>` 加载，并会被支持 `ES modules` 的浏览器忽略。
- 一个针对 Safari 10 中 `<script nomodule>` 的修复会被自动注入。

非常酷的实现方式，这样新旧浏览器分别会走两个包，新版浏览器加载更小的现代版 JS 语法包，老版浏览器则保持不变。
笔者经过打包的项目，新包比老包大概能缩减 100k 左右的大小，vue-cli3 文档指出可以缩减 16%。

# 尝试 diy 现代打包工具（目前还没成熟的项目）

- [babel-esm-plugin](https://github.com/prateekbh/babel-esm-plugin)  
  可以操作 babel 输出两种 js 代码

- [webpack-babel-multi-target-plugin](https://github.com/DanielSchaffer/webpack-babel-multi-target-plugin)  
  比较全面的实现方式，但是笔者在 vue 项目里打包 vendor 包巨大。不支持按需方式打包。

## 参考文档

[Serve modern code to modern browsers for faster page loads](https://web.dev/serve-modern-code-to-modern-browsers)
