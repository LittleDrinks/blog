---
title: "p-级数"
description: ""
tags:
  []
aliases:
  []
date: 2026-03-13T20:06:02
publish: true
---
$\displaystyle\sum_{n=1}^\infty\dfrac{1}{n^p}$ 在 $p\leq1$ 时发散，在 $p>1$ 时收敛

> [!note] 证明调和级数 $\displaystyle\sum_{n=1}^\infty\dfrac{1}{n}$ 发散
> 反证法，假设调和级数收敛，则 $S_{2n}-S_{n}\to S-S=0\ (n\to\infty)$。但 $$S_{2n}-S_{n}=\sum_{k=n+1}^{2n}\dfrac{1}{k}>\sum_{k=n+1}^{2n}\dfrac{1}{2n}=\dfrac{n}{2n}=\dfrac{1}{2}$$
> 矛盾，故调和级数发散。

$a_n + \dfrac{1}{n^p} \geq 2 \sqrt{\dfrac{a_n}{n^p}}$
