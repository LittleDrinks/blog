---
tags:
aliases:
title: Jordan公式
date: 2025-12-30T20:30:15
publish: true
description: ""
---
一共 $n$ 条性质，求恰好满足 $m$ 条性质的数量
记 $\alpha(m)$ 表示至少满足 $m$ 条性质的元素个数
记 $\beta(m)$ 表示恰好满足 $m$ 条性质的元素个数
$$
\beta(m)=\sum_{k=0}^{n-m}(-1)^k{m+k\choose m}\alpha(m+k)
$$

> [!NOTE] 证明
> 考察满足 $l$ 条性质的元素在等式左右侧被计数了多少次
> $l\le m$ 的情况是显然的，接下来考虑 $l>m$ 的情况
> 在等式右侧，$\alpha(m+k)$ 中恰好满足 $l\ (l>m)$ 条性质的元素数量为 ${l\choose m+k}$，于是它被计数的次数为
> $$
> {l\choose m+k}{m+k\choose m}
> $$
> 这个式子相当于：从 $l$ 条性质中选择 $m+k$ 条在 $\alpha$ 中满足，在 $m+k$ 条性质中选 $m$ 条在 $\beta$ 中满足，它等于
> $$
> {l\choose m}{l-m\choose k}
> $$
> 右式可以写为
> $$
> {l\choose m}\sum_{k=0}^{l-m}(-1)^k{l-m\choose k}={l\choose m}(1-1)^{l-m}=0
> $$

