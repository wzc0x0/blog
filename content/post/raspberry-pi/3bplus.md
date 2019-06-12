---
date: 2019-05-17
title: "折腾树莓派3B+"
draft: false
tags: ["Linux", "Raspberry-Pi"]
categories: ["Linux", "Raspberry-Pi"]
---

<a href="https://projects.raspberrypi.org/en/pathways/getting-started-with-raspberry-pi">
<img src="https://www.raspberrypi.org/app/uploads/2018/07/42558525-6dd32c62-84e9-11e8-99d2-0281ffe300c3.gif">
</a>
{{< blockquote link="https://www.raspberrypi.org/products/raspberry-pi-3-model-b-plus/" title="see more"  >}}
Raspberry Pi 3 Model B+ is the latest product in the Raspberry Pi 3 range

- Broadcom BCM2837B0, Cortex-A53 (ARMv8) 64-bit SoC @ 1.4GHz
- 1GB LPDDR2 SDRAM
- 2.4GHz and 5GHz IEEE 802.11.b/g/n/ac wireless LAN, Bluetooth 4.2, BLE
  Gigabit Ethernet over USB 2.0 (maximum throughput 300 Mbps)

{{< /blockquote >}}

# 下载系统

## 官方系统

https://www.raspberrypi.org/downloads/raspbian/  
分为：桌面版、无桌面版

## centos 系统

http://mirror.centos.org/altarch/7/isos/armhfp/  
用 [Win32DiskImager](https://sourceforge.net/projects/win32diskimager/) 烧录到 SD 卡中

# 系统烧录

## Windows

推荐使用[Win32DiskImager](https://sourceforge.net/projects/win32diskimager/)

## MacOS

```bash

df -h
# 查看sd卡设备文件
# 假设 /dev/disk3
sudo diskutil unmount /dev/disk3s1
# 卸载
sudo dd bs=1m if=2018-11-13-raspbian-stretch.img of=/dev/rdisk3 conv=sync
# 烧录
# if dd: bs: illegal numeric value change the block size bs=1m to bs=1M
sudo diskutil eject /dev/rdisk3
# 重新挂载
```

# headless(无显示器鼠标) 系统设置

## 开启 SSH

> 在 SD 卡分区里面创建一个名为 `ssh` 空文件即可  
> 默认用户名 pi，密码是 raspberry

## 开机连接 WiFi

{{< blockquote link="http://shumeipai.nxez.com/2017/09/13/raspberry-pi-network-configuration-before-boot.html" >}}
用户可以在未启动树莓派的状态下单独修改 /boot/wpa_supplicant.conf 文件配置 WiFi 的 SSID 和密码，这样树莓派启动后会自行读取 wpa_supplicant.conf 配置文件连接 WiFi 设备。
{{< /blockquote >}}

```conf
country=CN
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
ssid="WiFi-A" # wifi name
psk="12345678" # wifi pwd
key_mgmt=WPA-PSK # 加密方式
priority=1 # 连接优先级，数字越大优先级越高 连接隐藏WiFi时需要指定该值为1
}

# no pwd
network={
ssid="你的无线网络名称（ssid）"
key_mgmt=NONE
}
# WEP 加密方式
network={
ssid="你的无线网络名称（ssid）"
key_mgmt=NONE
wep_key0="你的wifi密码"
}
# WPA/WPA2 加密方式
network={
ssid="你的无线网络名称（ssid）"
key_mgmt=WPA-PSK
psk="你的wifi密码"
}

```

{{% notice note 注意 %}}
如果树莓派通过 WiFi 连接进入路由器（DHCP 协议），并通过动态的 ip 地址调试 SSH 通道，那么建议在当前路由通过树莓派的 Mac 地址绑定一个静态 ip 这样更方便调试。
{{% /notice %}}

---

## SSH 环境下调试

### `sudo raspi-config`

官方 raspbian 系统提供的简单的图形配置界面，建议配置修改 pi 用户密码、中文字库(ZH-CN UTF-8)、时区(Asia/Shanghai)、高级设置里面扩展文件系统空间等。

### 切换国内软件源

{{% notice info 清华大学开源镜像站 %}}
https://mirrors.tuna.tsinghua.edu.cn/  
https://mirrors.tuna.tsinghua.edu.cn/help/raspbian/
{{% /notice %}}

```bash
sudo -s
echo -e "deb https://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ stretch main non-free contrib \ndeb-src https://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ stretch main non-free contrib" > /etc/apt/sources.list
echo -e "deb https://mirrors.tuna.tsinghua.edu.cn/raspberrypi/ stretch main" > /etc/apt/sources.list.d/raspi.list
exit
sudo apt update && apt -y upgrade
# sudo apt-get dist-upgrade ; sudo rpi-update
# 更新软件&内核
```

### 安装 Screen

```bash
sudo apt-get install -y screen
screen -S 终端名
```

> 常用的 screen 命令

| 命令             | 说明                     |
| ---------------- | ------------------------ |
| screen -S 终端名 | 新建一个新的后台虚拟终端 |
| screen -ls       | 查看已创建的后台虚拟终端 |
| screen -r 终端名 | 进入该终端               |
