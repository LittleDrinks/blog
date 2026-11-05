---
title: Peterson算法
description:
tags:
  - CS/操作系统
aliases:
date: 2026-11-05T08:40:56
publish: true
---
```cpp
bool inside[2];
Inside[0]=false; inside[1]=false;
enum {0,1} turn;

 process P0( ) {                   
    inside[0]=true;                   
    turn=1;                            
    while(inside[1]&&turn==1);        
	{临界区}; 
	inside[0]=false;                  
 } 

process P1( ) {
    inside[1]=true;
    turn=0;
    while(inside[0]&&turn==0);
    {临界区};                     
    inside[1]=false;
}

cobegin P0(); P1(); coend
```
