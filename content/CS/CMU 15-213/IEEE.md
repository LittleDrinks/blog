---
title: 【CMU15213杂记】IEEE 754
description:
tags:
aliases:
date: 2026-03-13T00:10:38
publish: true
---
IEEE 754 标准定义了一种“二进制科学计数法”：

$$
(-1)^s \times M \times 2^E
$$

![alt text](IEEE_structure.png)

分几类数表示：

![alt text](IEEE_type.png)

1. 规格化数字：$0<exp<255$
   2. 尾数 $M=\text{1.frac}$，23 位尾数部分仅存储小数点后
   3. 指数 $E=exp-bias$，其中 $bias=2^{n-1}-1$
4. 非规格化数字：$exp=1$，非常接近 0 的小数
   5. 尾数 $M=\text{0.frac}$
   6. 指数 $E=1-bias$，保证和规格化数子的最小值能够接上
7. 特殊值：$exp$ 全 1
   8. +inf：符号位为 0、尾数全 0
   9. -inf：符号位为 1、尾数全 0
   10. NaN：尾数不为 0


如果把 float 看成一个无符号整数，每次对这个无符号整数 $+1$，相当于对这个数字 $+2^{E}$。

![alt text](IEEE_distribution.png)

![alt text](IEEE_distribution_2.png)


尾数部分 $M$ 的进位，和整数部分自带的 $1$ 相加变成了 $(10)_2$，此时需要把小数点左移一位，相当于产生了一个会加到指数部分的 $1$。

比较大小时，先处理符号位、$-0=+0$、NaN 三个问题，然后就可以直接当作无符号整数比较了。


IEEE 采取了【向最近偶数取整】的策略，当某个数恰好是中间值时向最近的偶数取整。

此时统计学意义上，每个数都有 50% 的概率向上或向下取整，不会影响平均数。

![alt text](IEEE_round_example.png)

