---
title: "Catalen数"
description: ""
tags:
  []
aliases:
  []
date: 2025-12-16T22:37:35
publish: true
---
$n$ 个节点的二叉树有多少种形态
出栈序列
正 $n$ 边形划分
从 $(1,1)$ 走到 $(n,m)$，不走过对角线的方案数

> [!success] 推导
> $$C(n)=\sum_{k=0}^{n-1}C(k)C(n-1-k)$$
> 
> 构造[[CS/2-内容/组合数学/生成函数|母函数]] $F(x)=\displaystyle\sum_{k=0}^{\infty}C(k)x^k$
> $F(x)\times F(x)=C_0C_0+(C_0C_1+C_1C_0)x+(C_0C_3+C_1C_2+C_2C_1+C_3C_0)x^2=\displaystyle\sum_{k=1}^{\infty}C_kx^{k+1}$
> 则 $xF^2(x)+C_0=F(x)$，其中 $C_0=1$
> 解得 $F(x)=\dfrac{1\pm\sqrt{1-4x}}{2x}=\dfrac{1}{2x}\pm\dfrac{1}{2x}(1-4x)^{\frac{1}{2}}$ 
> 对右边一项使用[[广义二项式定理]]展开，得到
> $$(1-4x)^{\frac{1}{2}}=\sum_{k=0}^{\infty}(-1)^{k-1}\frac{1}{2^{2k-1}}{2k-2\choose k-1} (-4)^kx^k$$
> 化简得到
> $$
> (1-4x)^{\frac{1}{2}}=-\sum_{k=0}^{\infty}\frac{2}{k}{2k-2\choose k-1}x^k
> $$
> 取 $k=n+1$，此时 $x^n$ 前的系数为
> $$
> \frac{1}{n+1}{2n\choose n}
> $$
> 此项即为卡特兰数的通解 $C_n$