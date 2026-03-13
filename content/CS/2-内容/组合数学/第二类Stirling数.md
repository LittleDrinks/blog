---
title: "第二类Stirling数"
description: ""
tags:
  []
aliases:
  []
date: 2025-12-16T22:37:35
publish: true
---
$s(n,k)$ 表示把 $n$ 个元素分为 $k$ 组（组内顺序无关）的方案数
无特殊声明，$s(n,k)$ 指[[第二类Stirling数]]而非第一类
$s(n,2)=2^{n-1}-1$

> [!NOTE] 递推式
> 第 $n+1$ 个元素独占一个位置，或者分配到前面的任意一盒
> $$
> s(n+1,k)=s(n,k-1)+ks(n,k)
> $$

> [!note] 通解
> 参考[[排列型母函数#^c25dd6]]，把问题加强为：$n$ 个有区别的球，放进 $m$ 个有区别的盒子。第二类 Stirling 数相当于最后给盒子贴个标签。
> $$m!s(n,m)=\left(\sum_{k=1}^{\infty}\frac{x^k}{k!}\right)^m$$
> 即
> $$
> m!s(n,m)=(e^x-1)^m
> $$
> 根据二项式定理展开右侧得到
> $$
> \sum_{k=1}^{m}{m\choose k}(-1)^ke^{x(m-k)}
> $$
> 其中，$\displaystyle e^{x(m-k)}=\sum_{i=0}^{\infty}(m-k)^i\frac{x^i}{i!}$，考察 $i=n$ 时的系数，有
> $$
> m!s(n,m)=\sum_{k=1}^{\infty}{m\choose k}(-1)^k(m-k)^n
> $$
> 

