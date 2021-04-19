+++
date= 2019-12-11
title= "Charles常用抓包方法"
draft= false
tags= ["web","proxy"]
categories= ["web","proxy"]
+++

# 前言

前端 web 页面、app 页面抓包备忘。笔者采用[charles](https://www.charlesproxy.com/)抓包工具，在 MacOS 环境下使用。抓取 https，重定向域名，修改 request、response。

# 准备工作：安装证书抓取 https

## MacOS 系统

打开 charles，help-->SSL Proxying-->Install Charles Root Certificate. 安装好证书之后，在钥匙串中打开证书，始终信任。

Proxy-->MacOS Proxy 勾选后启动抓取本地 MacOS 数据包。

## 手机端

### WIFI 网络配置

> 当前手机必须和抓包工具同一网段

#### iOS 以 13.2.3 版本为例：

设置-->无线局域网-->右边蓝色感叹号-->选择 HTTP 代理-->选择手动-->填写下抓包工具所在 ip，端口默认 8888

{{< figure src="/images/charles/ios-wifi-config.jpg" >}}

#### 华为 Android 手机为例：

设置-->无线和网络-->WLAN-->选择 WIFI 长按点击修改网络-->勾选显示高级选项-->选择手动-->填写下方抓包工具所在 ip，端口默认 8888

### 安装证书

- iOS or Android 设备安装证书：help-->SSL Proxying-->Install Charles Root Certificate on a Mobile Device Or Remote Browser.

- {{< figure src="/images/charles/mobile-cert.png">}}

- 点击之后出现弹窗，在手机浏览器输入 `chls.pro/ssl`下载证书安装。

- iOS 端：在设置-->通用-->关于本机-->点击最下方的证书信任-->把刚刚安装的证书信任

- Android（7.0 以下）：设置-->高级设置-->安全-->从 SD 卡安装，找到刚才下载的证书点击安装

{{% notice note Android7.0  %}}
由于 Google 对 Android 7.0 之后的机型更改了证书信任机制，普通的用户证书，在 APP 里面不再信任。  
官方解决方案指出：需要在 APP 开发的工程里面配置 XML 文件信任即可。  
[知乎参考文档](https://zhuanlan.zhihu.com/p/79277115)、[Android 官方文档](https://developer.android.com/training/articles/security-config.html)
{{% /notice %}}

# 开启 Charles ssl proxy

Proxy-->SSL Proxying Settings 加入要抓取的 https 域名，支持正则表达式通配符。

{{< figure src= "/images/charles/proxy-ssl.png" >}}

如果证书安装完成，现在就可以愉快的抓包了~

# 远端域名映射

Tools-->Map Remote

{{< figure src= "/images/charles/remote-map.png" >}}

将请求的域名地址映射到本地服务，常用在 app 嵌套 h5 页面，映射到本地开发。

**注意 https 域名需要写明 443 端口**

# 修改请求 or 响应

右键点击需要修改的请求，选择`Breakpoints`

{{< figure src= "/images/charles/breakpoint.png" >}}

最终 Charles 会对选择的请求路径施加断点，在断点处修改 request 或 response 数据点击 execute 执行。常用于对后端返回数据修改。

# 弱网环境模拟

Proxy-->Throttle Settings-->Enable Throttling

选择适合的网速进行弱网测试

# Android7.0+ 抓包 😄

{{< blockquote link="http://www.iliili.cn/2019/02/06/android-7-0%E4%BB%A5%E4%B8%8A%E4%BD%BF%E7%94%A8virtualxposedjusttrustme%E6%8A%93%E5%8C%85/" >}}
Android 7.0 以上使用 VirtualXposed+JustTrustMe 抓包
{{< /blockquote >}}

首先安装[VirtualXposed](https://github.com/android-hacker/VirtualXposed)，接着下载[JustTrustMe](https://github.com/Fuzion24/JustTrustMe)。将 JustTrustMe 安装在 VirtualXposed，VirtualXposed 打开选择 VirtualXposed 方式运行。

把需要抓包的 app 放入 VirtualXposed 运行，接下来就是常规的抓包方法，证书什么的安装好，设备连上。
