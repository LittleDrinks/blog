---
title: LoRA
description:
tags:
  - CS/LLM
aliases:
  - Low-Rank Adaption
date: 2026-11-01T21:51:33
publish: true
---
[原始论文](https://arxiv.org/abs/2106.09685)
冻结预训练参数 $W_0\in \mathbb{R}^{d\times d}$
选取 $r<<d$，学习低秩增量 $\Delta W=BA$，其中 $B\in\mathbb{R}^{d\times r}, \ A\in\mathbb{R}^{r\times d}$
前向传播变为
$$
h=W_0x+BAx
$$
将训练量从 $d^2$ 变为 $2dr$
