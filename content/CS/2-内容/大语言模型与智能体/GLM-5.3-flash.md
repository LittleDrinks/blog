---
title: GLM-5.3-flash
description:
tags:
  - CS/LLM
aliases:
date: 2026-10-27T19:34:19
publish: true
---
技术报告：[GLM-5.3-Flash: Frontier Intelligence, Flash Cost](https://z.ai/blog/glm-5.3-flash)
架构：[config.json](https://huggingface.co/zai-org/GLM-5.3-Flash/blob/main/config.json)、[glm5_next](https://github.com/huggingface/transformers/blob/main/docs/source/en/model_doc/glm5_next.md)
320B parameters, 18B active parameters

![[Pasted image 20261027194106.png]]

Manifold-Constrained Hyper-Connections (mHC)
[a hybrid architecture combining linear and sparse attention](https://huggingface.co/zai-org/GLM-5.3-Flash/blob/main/config.json#L79)：三层 KDA 混一层 DSA

IndexPool: compresses four indexer key vectors into one through weighted pooling.
