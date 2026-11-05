---
title: AND型信号量
description:
tags:
  - CS/操作系统
aliases:
  - 同时wait
  - Swait
date: 2026-11-04T21:15:57
publish: true
---

一个进程需要同时持有多个共享资源才能推进时，逐个申请会引发死锁。例：进程 A 与进程 B 都需要访问共享数据 D 与 E，设置互斥信号量 `Dmutex`、`Emutex`，初值均为 $1$。若执行顺序为 A 执行 `wait(Dmutex)`、B 执行 `wait(Emutex)`、A 执行 `wait(Emutex)`、B 执行 `wait(Dmutex)`，则 A 持有 D 等待 E，B 持有 E 等待 D，两者永久阻塞。

原因是申请操作不具原子性，进程在持有部分资源的状态下可以被剥夺处理机。

AND 同步机制的做法是把资源的申请合并为一次原子操作。将进程在整个运行期间所需的全部临界资源一次性分配给该进程，使用完毕后一起释放；若其中任一资源不能满足，其余资源也不分配给该进程。

实现方式是在 `wait` 中增加 AND 条件，称为 `Swait`（Simultaneous Wait）：

```
Swait(S1, S2, …, Sn)
    if S1 >= 1 and … and Sn >= 1 then
        for i := 1 to n do Si := Si - 1;
    else
        把进程放入第一个 Si < 1 的资源的等待队列，
        并置其程序计数器为 Swait 的起始地址；
```

对应的 `Ssignal(S1, S2, …, Sn)` 一次性释放全部资源。与逐个申请相比，`Swait` 消除了「持有部分资源再等待」的中间状态，死锁前提消失。

代价是资源利用率下降。一个进程可能因为最后一个资源不可用而放弃已经可用的全部资源，这些资源在等待期间无法被其他进程使用。
