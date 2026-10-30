---
title: Grouped-Query Attention
description:
tags:
  - CS/LLM
aliases:
  - GQA
date: 2026-10-27T18:47:04
publish: true
---
传统 [[Multi-head Attention|MHA]] 为每个注意力头分配一组 kv
GQA 把注意力头分组，组内公用 kv，查询时将 kv 广播复制
既不至于太贵，又不至于像 MQA 一样损失表达能力
