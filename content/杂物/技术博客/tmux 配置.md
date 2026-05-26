---
title: tmux 配置
description:
tags:
aliases:
date: 2026-04-12T00:11:08
publish: true
---
在 tmux 中启动 claude 中遇到一些操作不跟手的情况。我习惯用鼠标选中一段文字作为高亮，方便我阅读，但是 tmux 中选中一段文字放开后，它的滚轮会立刻就会弹回页面底部。
解决方法是修改 `~/.tmux.conf`，进行如下设置：
```bash
set -g mouse on

# 拖拽结束：只复制，不清除，不退出，不跳回
bind-key -T copy-mode MouseDragEnd1Pane send-keys -X copy-selection-no-clear

# 单击：清除高亮，保持位置
bind-key -T copy-mode MouseDown1Pane send-keys -X clear-selection

# 按 Enter：真正复制并跳回
bind-key -T copy-mode Enter send-keys -X copy-selection-and-cancel
```
然后
```bash
tmux source-file ~/.tmux.conf
```
刷新设置
