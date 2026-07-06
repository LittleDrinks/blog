---
title: CNN
description:
tags:
  - CS
aliases:
date: 2026-07-06T23:42:42
publish: true
---

```python
# Define the CNN Model
# TODO: Add convolutional, pooling, and fully connected layers
class CNNModel(nn.Module):
    def __init__(self):
        super().__init__()
        # input : (batch_size, 3, 32, 32)
        self.conv1 = nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1)
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.func1 = nn.Linear(64 * 16 * 16, 128)
        self.func2 = nn.Linear(128, 10)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.conv1(x))
        x = self.relu(self.conv2(x))
        x = self.pool(x)
        x = x.view(x.size(0), -1)
        x = self.relu(self.func1(x))
        x = self.func2(x)
        return x
```