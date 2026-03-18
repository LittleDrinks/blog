---
title: ARIS配置实录
description: copilot 取消对 Opus 支持后我自己的第三方 coding plan，以及在此基础上在 copilot 中部署全自动科研工作流 Auto-claude-code-research-in-sleep 的配置
tags:
aliases:
date: 2026-03-17T01:20:28
publish: true
---
# 前言
本文写于 2026.3.17，请注意时效性。
前几天 copilot 宣布学生会员不再能够使用 claude sonnet 在内的顶尖模型，于是我倒腾了好久用每月 ￥22 的价格搞到了一组还算可以的配置。
先去闲鱼上花￥15 买一个 copilot 的 300 次额度，这个链接里的额度可以访问 Opus 模型。
```
【闲鱼】https://m.tb.cn/h.ifZYjjv?tk=zqIeUDia64L MF 937 「快来捡漏【Copilot Opus 15 元/月】」
#小程序 ://闲鱼/2 LP 8 VqJ 8 wEhalKj
点击链接直接打开
```
直接在 vscode 中使用额度会有一些工具上的问题，比如 runSubagent 是没法用的。但是用它提供的 copilot hub 在 copilot cli 使用，一些 MCP 就支持得就很好。
然后跟着 [【干货】免费白嫖一个月 GPT Plus！全流程订阅指南，细节拉满](https://www.bilibili.com/video/BV152NwztEPL/?share_source=copy_web) 花 7 块买了韩国的银行卡号，解锁了 GPT plus，没有搞反代，只是配合 copilot 在 codex 里面小额度用一用，目前没有封号危险。
于是我的配置方案就基于 copilot cli 以及 GPT plus 会员。

# 配置 Copilot Cli

主要就是在跑 copilot cli 的时候终端命令一直在报错。需要安装 powershell 7。
参考[文档](https://learn.microsoft.com/zh-cn/powershell/scripting/install/install-powershell-on-windows?view=powershell-7.5#start-powershell-7)安装即可。装完记得重启。

# 配置 ARIS

https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep/blob/main/README_CN.md

按照 ARIS 官方文档进行配置即可。这个项目主要是基于 Skills 运行的，所以只需要改一下 SKills 的目录即可。

```
git clone https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep.git
# 这一行要 copy 到 copilot 的配置文件夹中
cp -r Auto-claude-code-research-in-sleep/skills/* ~/.copilot/skills/
```

# 配置 Codex MCP

先在终端中安装 codex cli。
```bash
npm install -g @openai/codex
codex login   # authenticate with your ChatGPT or API key
```
这里选择用 OAuth 或者 API 登录都是可以的。
在 `~/.copilot/mcp-config.json` 中添加如下 mcp：
```json
{
  "mcpServers": {
    "codex": {
      "type": "stdio",
      "command": "codex",
      "tools": [
        "*"
      ],
      "args": ["mcp-server"],
	  "timeout":300000,
      "env": {
        "HTTP_PROXY": "http://127.0.0.1:7897",
        "HTTPS_PROXY": "http://127.0.0.1:7897",
        "ALL_PROXY": "http://127.0.0.1:7897",
        "http_proxy": "http://127.0.0.1:7897",
        "https_proxy": "http://127.0.0.1:7897",
        "all_proxy": "http://127.0.0.1:7897"
      }
    },
```
如果遇到这种网络错误
![[Pasted image 20260318165042.png|500]]
记得在 json 的 `env` 中添加代理。我用的是 clash-verge，按照他给的端口填就行了：
![[Pasted image 20260318165145.png]]
配置好之后可以在 copilot 中测试一下
![[Pasted image 20260318165821.png]]

