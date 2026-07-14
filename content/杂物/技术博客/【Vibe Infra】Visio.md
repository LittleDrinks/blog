---
title: 【Vibe Infra】Visio
description:
tags:
aliases:
date: 2026-07-15T00:26:03
publish: true
---
可以使用学校提供的 kms 激活 visio

> [!note]- Visio 2019 安装与激活
> 
>   由于电脑现有 Office 2021 是 64 位 Click-to-Run 版本，学校提供的 Visio 2019 x 86 镜像不能直接安装。最终使用 Microsoft
>   Office Deployment Tool 安装兼容的 64 位 Visio。
> 
>   1. 从微软下载 Office Deployment Tool，并解压到：
> 
>   E:\download\ODT
> 
>   2. 在该目录创建 install-visio-2019-x 64.xml：
> ```xml
>   <Configuration>
>     <Add OfficeClientEdition="64" Channel="Current" Version="MatchInstalled">
>       <Product ID="VisioPro2019Volume">
>         <Language ID="zh-cn" />
>       </Product>
>     </Add>
>     <Display Level="Full" AcceptEULA="TRUE" />
>   </Configuration>
> ```
> 
>   3. 以管理员身份打开 PowerShell：
>   ```
>   cd E:\download\ODT
>   .\setup.exe /configure .\install-visio-2019-x 64.xml
>   ```
>   
> 
>   等待 Microsoft Office 安装界面完成下载和安装。安装后的程序位置是：
>
> ```
> C:\Program Files\Microsoft Office\root\Office 16\VISIO.EXE
> ```
> 
>   1. 登录上海大学 aTrust VPN，然后确认 KMS 端口可用：
> 
>   Test-NetConnection kms.shu.edu.cn -Port 1688
> 
>   显示以下内容说明 VPN 和 KMS 可用：
> 
>   ```
>   TcpTestSucceeded : True
>   ```
> 
>   2. 以管理员身份打开“命令提示符”，执行：
> 
> ```
>   cd /d "C:\Program Files\Microsoft Office\root\Office 16"
>   cscript ospp.vbs /sethst:kms.shu.edu.cn
>   cscript ospp.vbs /setprt:1688
>   cscript ospp.vbs /act
>   cscript ospp.vbs /dstatus
> ```
> 
>   看到下面两行即表示 Visio 激活成功：
> 
> ```
>   <Product activation successful>
>   LICENSE STATUS: ---LICENSED---
> ```
> 
>   学校使用 KMS 批量授权，激活期限为 180 天。电脑会自动尝试续期，只需在期限内定期连接学校校园网或 aTrust VPN。

[【如何用 Visio 绘制流程图+神经网络结构图！】 ](https://www.bilibili.com/video/BV1kS4y1i7Yo/?share_source=copy_web&vd_source=6bdc78c36edc3731774f242dd88cfa5b)
[【导师看了不皱眉的科研绘图教程｜CCF-A 录用 Figure 讲解｜多子图排版、精致感提升、创意性设计】 ](https://www.bilibili.com/video/BV16ZDWBbExg/?share_source=copy_web&vd_source=6bdc78c36edc3731774f242dd88cfa5b)
[【导师看了不皱眉的科研绘图教程｜超越 Image 2.0！】 ](https://www.bilibili.com/video/BV1bNoYB7Ehv/?share_source=copy_web&vd_source=6bdc78c36edc3731774f242dd88cfa5b)
