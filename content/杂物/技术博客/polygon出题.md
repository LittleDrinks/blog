---
title: polygon出题
description:
tags:
aliases:
date: 2026-07-22T23:45:21
publish: true
---

# polygon

## 题面中一些常见的术语解释

```latex
\documentclass{article}
\begin{document}

这是一个带脚注的句子\footnote{这是脚注的具体内容。}，继续正文。

\textasteriskcentered  % 居中的 *
\textdagger             % †
\textdaggerdbl          % ‡
\textsection            % §
\textparagraph          % ¶
\textbardbl             % ‖ (文本模式双竖线)
\textpilcrow            % ¶ 变体
\textreferencemark      % ※
\textinterrobang        % ‽
\star                   % ★ (数学模式)
\bigstar                % ★ (需 amssymb 宏包)

\footnote[1]{强制星号}      % 对应 \ast
\footnote[2]{强制匕首号}    % 对应 \dagger
\footnote[6]{强制双竖线}    % 对应 \|

\end{document}
```

[Why do we use the word "permutation" like this?](https://codeforces.com/blog/entry/116986)
https://help.luogu.com.cn/rules/academic/problem-standard
- 排列 permutation 
	- A **permutation** of length n is an array consisting of n distinct integers from 1 to n in arbitrary order.
	- “A **permutation** of length n is a sequence in which each integer from 1 to n appears exactly once.”
	- [CF2193B](https://codeforces.com/problemset/problem/2193/B)
- 子序列 subsequence
	- A **subsequence** is a string that can be derived from another string by deleting some or no symbols without changing the order of the remaining symbols. Characters to be deleted are not required to go successively, there can be any gaps between them. For example, for the string "abaca" the following strings are subsequences: "abaca", "aba", "aaa", "a" and "" (empty string). But the following strings are not subsequences: "aabaca", "cb" and "bcaa".
	- A **subsequence** is a sequence that can be obtained by deleting some elements (possibly zero) without changing the order of the remaining elements.
	- [CF1370D](https://codeforces.com/problemset/problem/1370/D)
- 子段 subsegment/subarray
	- A **subsegment** of a permutation is a contiguous subsequence of that permutation. For example, the permutation $[2,1,4,3]$ has 10 subsegments: $[2], [2,1], [2,1,4], [2,1,4,3], [1], [1,4], [1,4,3], [4], [4,3]$ and $[3]$.
	- [CF1743B](https://codeforces.com/problemset/problem/1743/B)

