---
title: KMP
description:
tags:
  - CS/数据结构
aliases:
date: 2026-04-22T23:27:12
publish: true
---
此处采用 0-index，记 $s[0:i]$ 为 $s$ 前 $i$ 个字符所组成的一个字串。
失效函数定义为
$$
f(j)=
\begin{cases}
-1 & j=0 \\
0 & j=1 \\
s[0:j-1]\text{的最长公共真前后缀长度} & else
\end{cases}
$$
