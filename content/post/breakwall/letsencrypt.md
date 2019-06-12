---
date: 2019-05-06
title: "acme.sh 生成let's encrypt免费证书"
draft: false
tags: ["Linux"]
categories: ["Linux"]
---

> acme.sh 实现了 acme 协议，默认从 let's encrypt 生成 3 个月的免费证书，
> 更多请查看 [acme.sh wiki](https://github.com/Neilpang/acme.sh/wiki/%E8%AF%B4%E6%98%8E)

# 安装 acme.sh

```bash
curl  https://get.acme.sh | sh
# 设置alias 用的普通账户
alias acme.sh=~/.acme.sh/acme.sh
```

# 生成证书

## dnsapi 导出

```bash
export CF_Key="sdfsdfsdfljlbjkljlkjsdfoiwje"
export CF_Email="xxxx@sss.com"
```

ok, let's issue a cert now:

```bash
acme.sh --issue --dns dns_cf -d example.com -d www.example.com

# 如果申请泛域名：
# acme.sh --issue -d example.com -d '*.example.com' --dns dns_cf
```

{{% notice note 注意%}}
上述操作是以域名托管在 CloudFlare DNS 为例子
[CloudFlare API keys](https://dash.cloudflare.com/profile)
<br>
更多请参考: https://github.com/Neilpang/acme.sh/wiki/dnsapi
{{% /notice %}}

The CF_Key and CF_Email will be saved in ~/.acme.sh/account.conf and will be reused when needed.

# 证书使用

## nginx 使用

- ssl_dhparam 生成

```bash
sudo mkdir /etc/nginx/ssl
sudo openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048
```

- **ssl_certificate 和 ssl_trusted_certificate 字段要使用`fullchain.cer`**

之后 nginx reload 即可，可以通过浏览器查看最新证书

# 更新 acme.sh

> 目前由于 acme 协议和 letsencrypt CA 都在频繁的更新, 因此 acme.sh 也经常更新以保持同步.

升级 acme.sh 到最新版：

```bash
acme.sh --upgrade
```

自动更新：

```bash
acme.sh  --upgrade  --auto-upgrade
```

取消自动更新：

```bash
acme.sh  --upgrade  --auto-upgrade 0
```
