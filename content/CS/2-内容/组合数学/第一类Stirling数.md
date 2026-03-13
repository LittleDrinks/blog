---
tags:
  - 数学
aliases:
title: 第一类Stirling数
date: 2025-12-16T22:37:35
publish: true
description: ""
---
$s(n,k)$ 表示 $n$ 个元素分为 $k$ 个圆排列的方案数

> [!NOTE] 递推式
> 第 $n+1$ 个元素独占一个空位，或者插到任意一个圆排列的任意一个空位（共 $n$ 个空位），则有递推式
> $$
> s(n+1,m)=s(n,m-1)+ns(n,m)
> $$

