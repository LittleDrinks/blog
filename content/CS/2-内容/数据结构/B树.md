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
- 根节点至少有 2 个子节点
- 每个节点最多有 $m$ 个子节点，最少有 $\lceil m / 2 \rceil$ 个
- 若有 $k$ 个子节点，则有 $k-1$ 个关键字
- 所有叶子节点必须在同一层

> [!faq]- 一个高度为 3 的五阶 B-树至少有多少个失败结点？
> 根节点至少有 2 个子节点，接下来 2 层每层至少有 $\lceil 5 / 2 \rceil=3$ 个子节点，至少有 $2\times3\times3=18$ 个失败节点

