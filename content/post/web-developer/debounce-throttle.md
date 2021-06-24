---
date: 2019-08-12
title: "JS中的节流与防抖函数"
draft: false
tags: ["JavaScript"]
categories: ["JavaScript"]
---

# 前言

抖动（Debouncing）和节流阀（Throttling）函数，在实际应用中有很多，比如滚动条，窗口频繁缩放，input 框 `keyup` 事件等。

# debounce

## 一个简单可用的实现代码

```js
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
```

## debounce codepen 在线体验

{{< codepen id="YwNwgy" tab="result" >}}

## 总结

Debounce（防抖）技术把多次顺序调用合成一次。在你指定的时间内，无论函数被调用多少次，都算做一次调用。也就是说**相邻两次函数执行间隔必须大于等于指定的时间**。适合于键盘事件，缓冲事件回调。

{{< notice tip  lodash中的实现 >}}
[\_.debounce](https://lodash.com/docs/4.17.15#debounce)中的第三个参数，`{leading: true,trailing:false}`，指定当前函数首次触发时执行。

{{< /notice >}}

# throttle

在 lodash 中的，throttle 就是设置第三个参数 `maxWait` 的 debounce 函数。这样节流函数保证在指定的时间内执行一次函数。适合于滚动条事件，将多次事件按时间分割开延迟执行。  
**不同与 debounce 的是：debounce 的时间间隔结束后才会去执行函数，throttle 则是在时间间隔内检查函数。**

# requestAnimationFrame

{{< caniuse feature="requestanimationframe" >}}

```js
window.requestAnimationFrame(callback);
// 下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)
// 动画保持 60fps（每一帧 16 ms），浏览器内部决定渲染的最佳时机
// 一般在js dom动画中使用，更加精确细腻操作
```

类似`_.throttle(callback,16)`

# 参考文章

- [实例解析防抖动（Debouncing）和节流阀（Throttling）](https://jinlong.github.io/2016/04/24/Debouncing-and-Throttling-Explained-Through-Examples/)
- [window.requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
