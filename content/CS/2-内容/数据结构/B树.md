---
title: B树
description:
tags:
  - CS/数据结构
aliases:
date: 2026-06-28T22:05:41
publish: true
---
m 阶 B 树满足：
- 每个节点最多有 $m$ 个子节点，最少有 $\lceil m / 2 \rceil$ 个
- 若有 $k$ 个子节点，则有 $k-1$ 个关键字
- 所有叶子节点必须在同一层
