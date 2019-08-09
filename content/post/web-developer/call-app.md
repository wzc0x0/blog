---
date: 2019-08-09
title: "H5唤起native app"
draft: false
tags: ["html5"]
categories: ["html5"]
---

# 前言

这是一个大坑做好准备，因为各端差异性，没有一个统一方案，需要各端兼容。

# URLScheme 协议打开 APP

URLScheme 协议：

```
newsapp://
```

iOS 端还支持`smart app banner`打开 app，通过设置 meta 标签

```
<meta name="apple-itunes-app" content="app-id=1023600494, app-argument=tigerbrokersusstock://com.tigerbrokers.usstock/post?postId=7125" />
```

这种协议 iOS Android 均支持，通过`location.href`或者`iframe`来实现唤起。然而在微信浏览器中除了合作伙伴白名单外是屏蔽的。  
另外在 iOS 中打开也会有弹窗，很难避免，所以推荐 iOS 使用`Universal Links`唤醒。

# Universal Links

由 Apple 开发的一种唤醒方式，仅在**iOS9+**系统支持。虽然微信也是跟上屏蔽了，但是在 iOS 端可以通过引导用户在微信端打开浏览器瞬间唤醒 App，体验也是很不错的。**所以强烈推荐使用。**

## iOS 准备

参考这一篇文章https://www.jianshu.com/p/734c3eff8feb

## H5 准备

**必须有域名，必须是 https**，接着创建`apple-app-site-association`文件，并部署到当前域名根目录。

```apple-app-site-association
{
    "applinks": {
        "apps": [],
        "details": [
            {
                "appID": "9JA89QQLNQ.com.apple.wwdc",
                "paths": [ "/wwdc/news/", "/videos/wwdc/2015/*"]
            },
            {
                "appID": "ABCD1234.com.apple.wwdc",
                "paths": [ "*" ]
            }
        ]
    }
}
```

还有一点当前页面的域名要和打开的 iOS APP 域名不一致。

# H5 如何判断 APP 是否打开

很抱歉没有任何系统提供的回调。一般是等待 1s 后，当前页面没有被遮挡隐藏就算是 App 没有被打开。
笔者原来项目代码实现，仅供参考。

```js
methods: {
    openApp() {
      if (this.pc) return;

      // ios9+ 微信打开Safari 有app直接跳app 没有1.5s 打开市场
      if (this.ios && this.ios_version[1] >= 9 && this.wechat) return;

      //微信Android 引导
      if (this.android && this.wechat) return;

      //Android & ios9- urlScheme 模拟打开
      let aLink = document.createElement("a");
      aLink.setAttribute("href", app_path);
      document.body.appendChild(aLink);
      aLink.click();
      setTimeout(() => {
        document.body.removeChild(aLink);
      }, 0);

      this.stopId = setTimeout(() => {
          this.android &&
            (location.href = `https://release.apk?${Math.random()}`);
          this.ios &&
            (location.href = "itms-apps://itunes.apple.com/app/XXX");
      }, 1000);
    }
  }

// 由于兼容性，监听页面是否被隐藏或者遮盖
document.addEventListener("visibilitychange", () => {
    var tag = document.hidden || document.webkitHidden;
    if (tag) {
      clearTimeout(this.stopId);
    }
});
document.addEventListener("webkitvisibilitychange", () => {
    var tag = document.hidden || document.webkitHidden;
    if (tag) {
        clearTimeout(this.stopId);
    }
});
window.addEventListener("pagehide", () => {
  clearTimeout(this.stopId);
});
```

## Android 浏览器不会跳转下载

比如 UC 浏览器，禁止用户没有点击事件触发下载。只能采取页面放 button 按钮，引导用户触发点击。
