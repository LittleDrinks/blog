---
title: "F分布"
description: ""
tags:
  []
aliases:
  []
date: 2026-03-13T20:06:02
publish: true
---
[[卡方分布]]
$U\sim\chi^2(m)$，$V\sim\chi^2(n)$，则称随机变量 $F=\dfrac{U(m)/m}{V(n)/n}$ 服从自由度为 $m,n$ 的 F 分布，记为 $F\sim F(m,n)$
$F_{1-\alpha}(m,n)F_\alpha(n,m)=1$，$F_{\frac{1}{2}}(n,n)=1$

> [!NOTE]- 证明 $F_{1-\alpha}(m,n)F_\alpha(n,m)=1$
> $1-\alpha=P(F\ge F_{1-\alpha}(n,m))$
> $=P\left(\dfrac{1}{F}\le \dfrac{1}{F_{1-\alpha}(n,m)}\right)$
> $=1-P\left(\dfrac{1}{F}\ge\dfrac{1}{F_{1-\alpha}(n,m)}\right)$
> 于是 $\alpha=P\left(\dfrac{1}{F}\ge\dfrac{1}{F_{1-\alpha}(n,m)}\right)$
> 因为 $\dfrac{1}{F}\sim F(m,n)$，于是 $\alpha=P\left(\dfrac{1}{F}\ge F_\alpha(m,n)\right)$
> 综合上面两个式子可以得到 $F_\alpha(m,n)F_{1-\alpha}(n,m)=1$

> [!faq]- 设随机变量 $X,Y$ 独立且均满足 $N(0,3^2)$，$X_1,\ldots,X_9$ 和 $Y_1,\ldots,Y_9$ 分别是来自总体 $X,Y$ 的简单随机样本，则统计量 $\displaystyle U=\frac{X_1+\ldots+X_9}{\sqrt{Y_1^2+\ldots+Y_9^2}}$ 服从什么分布？
> $W=X_1+\ldots+X_9$ 服从 $N\left( n\mu,n\sigma^2 \right)=N(0,9^2)$，$W/9\sim N(0,1)$
> $V=\dfrac{1}{9}\left(Y_1^2+\ldots+Y_9^2\right)$ 服从 $\chi^2(9)$
> 因为 $X,Y$ 独立，于是 $W,V$ 独立，于是 $U=\dfrac{W}{\sqrt{9V}}=\dfrac{W/9}{\sqrt{V/9}}\sim t(9)$

