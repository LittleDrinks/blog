---
title: Bug记录：vscode中copilot登录github时报错——尚未完成授权此扩展使用 GitHub 的操作
description:
tags:
aliases:
date: 2026-03-23T22:35:24
publish: true
---
在终端中选择“输出——Github Authentication”，查看报错日志。
发现 Github 错误地使用了代理
```
...
2026-03-23 22:31:31.587 [info] Logging in with 'any' account...
2026-03-23 22:31:31.587 [info] Logging in for the following scopes: read:user repo user:email workflow
2026-03-23 22:31:31.589 [info] Trying with local server... (read:user repo user:email workflow)
2026-03-23 22:31:41.565 [info] Exchanging code for token...
2026-03-23 22:31:41.580 [info] FetcherService: Node fetch failed with error: fetch failed
2026-03-23 22:31:41.592 [info] FetcherService: Node http/s failed with error: Failed to establish a socket connection to proxies: PROXY 127.0.0.1:1278
2026-03-23 22:31:41.593 [error] fetch failed
```
`ctrl+,` 打开设置文件，在设置文件中找到 `proxy` 相关设置，将其注释。
![[Pasted image 20260323223802.png]]
重启之后登录正常
![[Pasted image 20260323223614.png]]
