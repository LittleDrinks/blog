---
title: RNN
description:
tags:
  - CS
aliases:
date: 2026-07-06T23:41:46
publish: true
---
http://karpathy.github.io/2015/05/21/rnn-effectiveness/

库版本：
```python
class RNNModel(nn.Module):
    def __init__(self, input_dim=1, hidden_dim=50, output_dim=1):
        super().__init__()
        self.rnn = nn.RNN(input_size=input_dim, hidden_size=hidden_dim, batch_first=True)
        self.output_layer = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        out, _ = self.rnn(x)
        out = out[:, -1, :]
        return self.output_layer(out)
```
手写版本：
```python
class RNNModel(nn.Module):
    def __init__(self, input_dim=1, hidden_dim=50, output_dim=1):
        super().__init__()
        self.hidden_dim = hidden_dim
        self.W_xh = nn.Parameter(torch.randn(input_dim, hidden_dim) * 0.01)
        self.W_hh = nn.Parameter(torch.randn(hidden_dim, hidden_dim) * 0.01)
        self.b_h = nn.Parameter(torch.zeros(hidden_dim))
        self.output_layer = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        batch_size, seq_len, _ = x.size()
        h_t = torch.zeros(batch_size, self.hidden_dim, device=x.device)

        for t in range(seq_len):
            x_t = x[:, t, :]
            h_t = torch.tanh(x_t @ self.W_xh + h_t @ self.W_hh + self.b_h)

        return self.output_layer(h_t)
```
