---
title: pytorch
description:
tags:
  - CS
aliases:
date: 2026-06-25T14:44:14
publish: true
---
# 张量
基本单位，`torch.tensor`
```python
import torch
import torch.nn.functional as F

# ========== 1. 创建张量 ==========                
torch.zeros(2, 3)          # 全 0: tensor([[0., 0., 0.], [0., 0., 0.]])                      
torch.ones(2, 3)           # 全 1
torch.randn(2, 3)          # 标准正态分布
torch.arange(0, 5)         # [0, 1, 2, 3, 4]
torch.linspace(0, 1, 5)    # [0.0, 0.25, 0.5, 0.75, 1.0]

# ========== 2. 形状操作 ==========                
x = torch.randn(4, 784)
x.view(4, 1, 28, 28)       # 改变形状，不改变数据
x.reshape(4, 1, 28, 28)    # 功能类似 view，更灵活
x = torch.randn(3)
x.unsqueeze(0)             # (3,) -> (1, 3)，增加维度                                         
x.unsqueeze(1)             # (3,) -> (3, 1)
x = torch.randn(1, 3, 1, 1)                        
x.squeeze()                # 去掉所有大小为 1的维度 -> (3,)                                     
x.squeeze(2)               # 只去掉指定维度
x = torch.randn(2, 3, 4)
x.transpose(1, 2)          # 交换 dim1 和 dim2 -> (2, 4, 3)
x.permute(2, 0, 1)         # 按指定顺序重排维度 -> (4, 2, 3)

# ========== 3. 聚合操作 ==========                
x = torch.tensor([[1., 2., 3.], [4., 5., 6.]])
x.sum()                    # 21.0
x.sum(dim=1)               # 按行求和: [6.0, 15.0]
x.mean(dim=0)              # 按列求平均: [2.5, 3.5, 4.5]
x.max()                    # 最大值 6.0            
x.max(dim=1)               # 返回 (values, indices)
x.argmax(dim=1)            # 最大值的索引: [2, 2]

# ========== 4. 数学运算 ==========                
x = torch.tensor([1., 2., 3.])
y = torch.tensor([4., 5., 6.])
x + y                      # 元素级加法: [5, 7, 9] 
x * y                      # 元素级乘法: [4, 10, 18]
x @ y                      # 点积: 32.0            
torch.matmul(x, y)         # 同上 
x ** 2                     # 平方: [1, 4, 9]
torch.sqrt(x)              # 开方                  
torch.exp(x)               # e^x                   
torch.log(x)               # ln(x)                 
torch.abs(x)               # 绝对值

# ========== 5. 条件与截断 ==========              
x = torch.tensor([-2., -0.5, 0.5, 3.])
torch.where(x > 0, x, torch.zeros_like(x))         
# 正数保留，负数变 0: [0, 0, 0.5, 3]
torch.clamp(x, min=-1, max=1)                      
# 限制范围: [-1, -0.5, 0.5, 1]
torch.sign(x)  # 符号: [-1, -1, 1, 1]

# ========== 6. 拼接与堆叠 ==========              
a = torch.randn(2, 3)
b = torch.randn(2, 3)
torch.cat([a, b], dim=0)   # 按 dim0 拼接 -> (4, 3)
torch.cat([a, b], dim=1)   # 按 dim1 拼接 -> (2, 6)
torch.stack([a, b], dim=0) # 在新维度上堆叠 -> (2, 2, 3)                                       

# ========== 7. 设备与类型 ==========              
x = torch.randn(3, 3) 
x = x.to("cuda")           # 放到 GPU
x = x.to("cpu")            # 放回 CPU
x = x.cuda()               # 同上
x = x.cpu()
x = x.float()              # 转 float32            
x = x.long()               # 转 int64              
x = x.bool()               # 转 bool

# ========== 8. 索引与选择 ==========              
x = torch.tensor([1., 2., 3., 4., 5.])
mask = x > 3
x[mask]                    # 布尔索引: [4., 5.] 
indices = torch.tensor([0, 2, 4])
x[indices]                 # 按索引取: [1., 3., 5.]
```

# 模型训练流程
前向传播、算误差、反向传播
以线性回归模型为例：
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

# 自定义模型
## 基类
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
可以通过 `nn.Parameter()` 将矩阵声明为参数，自动处理反向传播（可以参考手写版本的 [[RNN]]）
## 激活函数
直接嵌套两层线性层无意义，中间加一个激活函数可以用于拟合非线性函数
`torch.nn` 和 `torch.nn.functional` 中提供了若干激活函数，比如 `relu`。
这里的区别是：`nn` 将其视为神经网络的一层，`nn.functional` 提供纯函数。
部分函数，比如 `nn.functional.tanh()` 已被弃用，建议使用 `torch.tanh()`。
注意像 `Linear` 这种有可学习参数的必须使用 `nn.Linear`。
也可以在自定义的 `nn.Module` 中手写一个成员函数作为激活函数。
## 损失函数
可以通过继承 `nn.Module` 自定义损失函数
```python
class HuberLoss(nn.Module):
    def __init__(self, delta=1.0):
        super().__init__()
        self.delta = delta

    def forward(self, pred, targ):
        err = torch.abs(pred - targ)
        L1 = self.delta * (err - 0.5 * self.delta)
        L2 = 0.5 * err ** 2
        loss = torch.where(err <= self.delta, L2, L1)
        return loss.mean()

criterion = HuberLoss()
```

# 加载数据

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

# 模型的保存与加载
```python
# Save the model to a file named "model.pth"
torch.save(model.state_dict(), 'model.pth')

# Load the model back from "model.pth"
loaded_model = SimpleModel()
loaded_model.load_state_dict(torch.load('model.pth'))
```

# tensorboard
tensorboard 可视化 loss 曲线
```python
from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter(log_dir='runs/linear_regression')
for epoch in range(epochs):
	...  # 训练代码
	writer.add_scalar('loss/train', loss.item(), epoch)
writer.close()
```

