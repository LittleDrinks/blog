---
title: pytorch
description:
tags:
  - CS
aliases:
date: 2026-06-25T14:44:14
publish: true
---
基本单位张量 `torch.tensor`
模型训练流程：前向传播、算误差、反向传播（以线性回归模型为例）
```python
import torch
import torch.nn as nn
import torch.optim as optim

model = nn.Linear(in_features=1, out_features=1)
criterion = nn.MSELoss()
optimizer = optim.GSD(model.parameters(), lr=0.005)

# Training loop
epochs = 1000
for epoch in range(epochs):
	# Forward pass
	y_pred = model(X)
	loss = criterion(y_pred, Y)
	
	# Backward pass and optimization
	optimizer.zero_grad()
	loss.backward()
	optimizer.step()
```
model 可以通过继承 `nn.Module` 自定义，至少需要重载 `__init__()` 和 `forward()`
```python
class LinearRegressionModel(nn.Module):
	def __init__(self):
		super().__init__()
		self.linear = nn.Linear(1, 1)
	def forward(self, x):
		return self.linear(x)

model = LinearRegressionModel()
```
可以自定义 dataset 和 dataloader，实现加载数据、分 batch 计算
```python
from torch.utils.data import Dataset, TensorDataset, DataLoader

# 使用自带的 TensorDataset 把内存中的数据转为 dataset
X = torch.rand(100, 1)
Y = 2 * X + 3 + torch.randn(100, 1)
dataset = TensorDataset(X, Y)

# 自定义 dataset，实现【从文件中读取】、【封装清洗策略】等功能
import pandas as pd
class LinearRegressionDataset(Dataset):
	# 至少需要重载 __init__()、__len__() 和 __getitem__()
	# 分别对应 Dataset(), len(dataset), dataset[idx]
	def __init__(self, csv_path):
		self.df = pd.read_csv(csv_path)
		self.X = torch.tensor(self.df['X'].values(), dtype=torch.float32).view(-1, 1)
		self.Y = torch.tensor(self.df['Y'].values(), dtype=torch.float32).view(-1, 1)

	def __len__(self):
		return len(self.df)

	def __getitem__(self, idx):
		return self.X[idx], self.Y[idx]

dataset = LinearRegressionDataset('data.csv')

# 使用 DataLoader 实现 batch 分割
dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
for batch_X, batch_Y in dataloader:
	print(batch_X.shape, batch_Y.shape)
```
