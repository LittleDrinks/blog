---
title: 【Vibe Infra】Docker
description:
tags:
aliases:
date: 2026-06-06T18:20:07
publish: true
---
# 安装

# 代理配置

直接 `docker pull hello-world` 可能会遇到网络问题。
```bash
> docker pull hello-world
Using default tag: latest
Error response from daemon: failed to resolve reference "docker.io/library/hello-world:latest": failed to do request: Head "https://registry-1.docker.io/v2/library/hello-world/manifests/latest": dial tcp [2a03:2880:f126:83:face:b00c:0:25de]:443: connect: network is unreachable
```

你的梯子（Clash/v2rayN 等）虽然让 shell 流量成功翻墙，但 Docker 完全没走代理。
根本原因是：Docker daemon 是 systemd 服务，运行在 root 环境，不会读取 shell 里的 `http_proxy` 环境变量。WSL 2 NAT 模式下，Docker 会尝试直连 `docker.io`，而 DNS 可能返回不可达的 IPv 6 地址，导致拉取失败。
WSL 2 的 `mirrored` 网络模式理论上可以让 Windows 代理无缝透传，但部分用户（包括我）会遇到启动失败或网络异常。如果 mirrored 模式在你的机器上工作正常，优先用它；另一种方法是选用 NAT，手动代理 docker 代理。
在 `/etc/systemd/system/docker.service.d/http-proxy.conf` 中写入：
```
[Service]
EnvironmentFile=/etc/docker/proxy.env
```
在 WSL 2 NAT 模式下，WSL 虚拟网络的默认网关就是 Windows 主机的 IP。可以输入如下命令查看：
```bash
ip route show default | awk '{print $3; exit}'
```
这条命令输出的就是 Windows 主机在 WSL 虚拟网卡上的地址，比如 `172.21.64.1`。我的 Clash 就在 `172.21.64.1:7897` 上工作。在 `/etc/docker/proxy.env` 中对应写入代理信息即可：
```
HTTP_PROXY=http://172.21.64.1:7897
HTTPS_PROXY=http://172.21.64.1:7897
NO_PROXY=localhost,127.0.0.1
```
使用如下命令重启 docker 服务
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```
然后重新
```bash
docker pull hello-world
```
应该就能正常工作了
