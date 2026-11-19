---
title: Th8
description:
tags:
  - CS/数论
aliases:
date: 2026-11-17T16:08:50
publish: true
---
公约数是最大公约数的约数

> [!note] 证明
> 设 $d$ 是最大公约数，$d_1$ 是任意一个其他公约数，反设 $d'\nmid d$
> 考察 $[d,d_1]$，若反设 $d\nmid d_1$，则由 [[最小公倍数|Cor2]]，$[d,d_1]>d$（无法取等）
> 而 $\forall a_i$ 都满足 $d,d_1\mid a_i$，即 $a_i$ 是 $d,d_1$ 的公倍数，于是由 [[Th7]]，$a_i=k[d,d_1]$
> 那么 $[d,d_1]\mid a_i$，即 $[d,d_1]$ 亦为 $\{a\}$ 的一个公约数
> 但 $[d,d_1]>d$，与 $d$ 的最大性矛盾
> 证毕

