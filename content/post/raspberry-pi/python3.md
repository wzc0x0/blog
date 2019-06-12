---
date: 2019-05-17
title: "树莓派3B+链接蓝牙音箱"
draft: false
tags: ["Linux", "Raspberry-Pi"]
categories: ["Linux", "Raspberry-Pi"]
---

Debain 安装与卸载

```bash
sudo apt-get install -y xxx
sudo apt-get remove xxx
sudo apt-get autoremove xxx # 慎用!
```

pip3 安装

```bash
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
sudo python3 get-pip.py
```

{{% notice tip pip清华镜像使用 %}}
临时使用  
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple some-package
设为默认

升级 pip 到最新的版本 (>=10.0.0) 后进行配置：  
pip install pip -U
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
{{% /notice %}}

[网易云音乐 Linux 版本](https://github.com/darknessomi/musicbox)

```bash
$ git clone https://github.com/darknessomi/musicbox.git && cd musicbox
$ ## or (sudo) pip(3) install NetEase-MusicBox
$ python(3) setup.py install
$ (sudo) apt-get install mpg123
```

## 树莓派连接蓝牙音箱

```bash
## 查看蓝牙状态
systemctl status bluetooth


## 添加蓝牙组
sudo usermod -G bluetooth -a pi
sudo reboot

#安装其他lib
sudo apt-get install pi-bluetooth bluez bluez-firmware blueman -y
#安装pulseaudio
sudo apt-get install pulseaudio-module-bluetooth -y

#修改pulseaudio的空闲退出时间
#sudo nano /etc/pulse/daemon.conf
#设置
#exit-idle-time = -1

#开户pulseaudio
pulseaudio --start

bluetoothctl

power on

agent on

default-agent

scan on

pair XX:XX:XX:XX:XX:XX

trust XX:XX:XX:XX:XX:XX

connect XX:XX:XX:XX:XX:XX

exit

#显示可用发音设备
pacmd list-sinks

#设置默认发音设备
pacmd set-default-sink bluez_sink.XX:XX:XX:XX:XX:XX

#测试
wget http://youness.net/wp-content/uploads/2016/08/h2g2.ogg
paplay h2g2.ogg
```

表示连接一次蓝牙好难，不好玩！
