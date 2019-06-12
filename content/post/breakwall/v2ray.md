---
date: 2019-05-07
lastmod: 2019-06-12
title: "v2ray recommend server config"
draft: false
tags: ["breakwall"]
categories: ["breakwall"]
---

{{< blockquote link="https://www.v2ray.com" >}}
v2ray has lots of tools to help you break firewall!
{{< /blockquote >}}

shadowsocks + v2ray + ws + tls:

```json
{
  "log": {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "port": 10000,
      "listen": "127.0.0.1",
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "uuid",
            "alterId": 99
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/ray"
        }
      }
    },
    {
      "port": 1024,
      "protocol": "shadowsocks",
      "settings": {
        "method": "aes-256-gcm",
        "password": "pwd"
      }
    }
  ],
  "outbound": {
    "protocol": "freedom",
    "settings": {}
  }
}
```

You can use `caddy` or `nginx` relay the websocket steam :

```Caddyfile
$domain:443 {
    root /var/www
    gzip
    index index.html
    tls  $certPath $keyPath
    header / -Server
    header / Strict-Transport-Security "max-age=31536000;"
    proxy /ray localhost:10000 {
            websocket
            header_upstream -Origin
    }
}
```

```nginx.conf
server {
    listen 443 ssl http2;
    ...
    ...
    add_header Strict-Transport-Security "max-age=31536000";
    location /ray {
      proxy_redirect off;
      proxy_pass http://127.0.0.1:10000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $http_host;
    }
}
```

You can use the cert to achieve tls.
