---
title: Th7
description:
tags:
  - CS/数论
aliases:
  - Th7
date: 2026-11-17T16:08:00
publish: true
---
公倍数一定是最小公倍数的倍数

> [!note] 证明
> 设 $d$ 为最小公倍数，$d'$ 为任意其他公倍数
> 反设 $d\nmid d'$，则由 [[带余除法|Th4. 带余除法]] 知 $d'=qd+r$，其中 $0<r<d$
> 即 $b_i\mid d$ 且 $b_i\mid qd+r$
> 根据[[整除的线性组]]可知 $b_i\mid r$，于是 $r$ 也是 $\{b\}$ 的公倍数，且 $r<d$，这与 $d$ 的最小性矛盾
> 所以 $d\mid d'$，证毕
