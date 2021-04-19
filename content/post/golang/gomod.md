---
date: 2019-06-20
lastmod: 2019-06-28
title: "go mod使用"
draft: false
tags: ["golang"]
categories: ["golang"]
---

> golang 最受诟病的恐怕是没有成熟的包管理器，1.12 版本之前大都采用 vendor 的方式作为每个项目的包管理，造成巨大的资源重复浪费，类似 npm 的`node_modules`。go version >= 1.12 后内置的官方包管理器,不再需要配置 GOPATH 等环境变量。  
> https://github.com/golang/go/wiki/Modules

{{< figure src="https://i.redd.it/fw31b02wfkez.png" title="node_modules被人诟病冗余并体积巨大" >}}

## 基础使用

项目不需要在`$GOPATH/src`目录内

```bash
go mod init your module name
# will create a go.mod file

go mod vendor # 依赖复制到vendor
go mod tidy # 精简模块
go mod download # 下载资源到本地cache

go get -u # 拉取最新模块版本
go run xxx.go # 下载资源生成go.sum文件 类型npm的package.lock

go help mod # 查看更多命令
```

go mod 下载的包在 `$GOPATH/pkg/mod`

## go get 设置代理

墙内小朋友的福音：https://goproxy.io/

### macOS:

```bash
# 临时设置

# Enable the go modules feature
export GO111MODULE=on
# Set the GOPROXY environment variable
export GOPROXY=https://goproxy.io
```

```bash
# 永久设置

vi ~/.bash_profile
# add:
export GO111MODULE=on
# Set the GOPROXY environment variable
export GOPROXY=https://goproxy.io
# save
source ~/.bash_profile
```

### win:

```PowerShell
# Enable the go modules feature
$env:GO111MODULE=on
# Set the GOPROXY environment variable
$env:GOPROXY=https://goproxy.io
```

### goland IDE 设置

勾选 go modules 选项并且设置代理。

## import 引入方式

```go
package main

import "moduleName/folderName/fileName"

```

## 参考文章

- [go mod 使用](https://juejin.im/post/5c8e503a6fb9a070d878184a)
- [跳出 Go module 的泥潭](https://colobu.com/2018/08/27/learn-go-module/)
