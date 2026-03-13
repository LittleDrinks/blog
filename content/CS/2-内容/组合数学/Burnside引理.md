---
title: Burnside引理
description:
  []
tags:
  []
aliases:
  []
date: "2026-01-15T10:59:19"
publish: true
---
前置：[[共轭类]]

（以下从正方形四顶点 2 涂色问题出发）
正方形的旋转群（置换群）记作 $G$，作用于涂色集合 $X$ 上，其中 $G$ 是 $\begin{pmatrix} 1 & 2 & \ldots & 2^4\end{pmatrix}$ 的全排列， $X$ 可以记作 $\{1,2,\ldots,2^4\}$（枚举每个顶点涂的颜色，一共 16 种情况）
我们约定：
- “稳定子 $\mathrm{Stab}(x)$”（[[k不动置换类]]）表示让涂色方案 $x$ 不动的置换操作
- “不动点 $\mathrm{Fix}(g)$、$X^g$”表示在 $g$ 作用下不变的涂色方案
- “轨道 $\mathrm{Orbit}(x)$，$X/G$”（[[等价类]]）表示在 $g$ 作用下，$x$ 所代表的本质不同的一种涂色方案

> [!note]- 置换群 $G$ 的稳定子（[[k不动置换类]]） $\mathrm{Stab}(k)$ 是 $G$ 的一个子群
> 封闭性：$k\overset{p_1}{\to}k\overset{p_2}{\to}k$，$k\overset{p_1p_2}{\to}k$
> 结合律：自然
> 单位元：$e\in Z_k$

> [!note] orbit-stabilizer theorem
> $k$ 所属的等价类记为 $E_k$，[[k不动置换类]] $|\mathrm{Orbit}(k)|\cdot|\mathrm{Stab}(k)|=|G|$
> 
> 子群相关的一个直觉是：群可以按照子群被划分成一块一块。
> 
> 我们根据稳定子将置换群划分为若干块，每块的大小是 $|\mathrm{Stab}(k)|$，在一个块内的所有置换都会把 $k$ 作用成一个一样的元素。这每一个块就对应轨道上的每一个元素
> 
> 于是对 $k$ 这个元素，应用 $G$ 中的操作后一共有 $|\mathrm{Orbit}(k)|$ 种结果，每种结果都有 $|\mathrm{Stab}(k)|$ 种操作可以到达
> 
> 或者说，每个轨道上的不动子数量都等于 $|G|$

> [!NOTE] Burnside 引理
> $$
> l=\dfrac{1}{|G|}\sum_{g\in G} |\mathrm{Fix}(g)|
> $$

> [!tip] Burnside 引理的推导
> 我们想要统计本质不同的涂色方案，也就是统计不同等价类的数量
> 不妨设每个等价类为 $\mathrm{Orbit}_1,\ldots \mathrm{Orbit}_l$，也即是说我们想要求出 $l$
> 轨道-稳定子定理启发我们，自环（不动点）总数其实就是 $l\cdot|G|$，可以先统计自环数，即所有满足 $k^{p_j}=k$ 的配对 $(p_j,k)$
> 
> 记 $S_{j,k}=\begin{cases}1  & k^{p_j}=k\\0 & k^{p_j}\ne k \end{cases}$
> 我们有两种计数思路，一种是根据点（着色方案） $k$ 计数，一种是根据边（置换） $p_j$ 计数，则
> $$
> \sum_{j=1}^{g}\sum_{k=1}^{n}S_{j,k}=\sum_{k=1}^{n}|\mathrm{Stab}(k)|=\sum_{j=1}^{g}|\mathrm{Fix}(p_j)|
> $$
> 根据轨道稳定子定理，$\displaystyle\sum_{k=1}^{n}|\mathrm{Stab}(k)|$ 可以进一步化简为 $l\cdot |G|$
> $$
> l=\frac{1}{|G|}\sum_{j=1}^{g}|\mathrm{Fix}(p_j)|
> $$
> 简单来说，每个轨道对自环数量的贡献是 $G$，因此我们需要干两件事，第一件事是把自环数量出来，第二件事是把 $|G|$ 除掉

针对图像集的转动群来求解
但是转动群数量庞大，很难枚举
