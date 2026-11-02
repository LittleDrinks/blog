---
title: LoRA
description:
tags:
  - CS/LLM
aliases:
  - Low-Rank Adaption
date: 2026-11-01T21:51:33
publish: true
---
[原始论文](https://arxiv.org/abs/2106.09685)
冻结预训练参数 $W_0\in \mathbb{R}^{d\times d}$
选取 $r<<d$，学习低秩增量 $\Delta W=BA$，其中 $B\in\mathbb{R}^{d\times r}, \ A\in\mathbb{R}^{r\times d}$
前向传播变为
$$
h=W_0x+BAx
$$
将训练量从 $d^2$ 变为 $2dr$

实现时写一个类，传入一个 `nn.Linear` 并冻结，训练低秩增量
可以先让 `B` 全零，`A` 使用 [[kaiming uniform]] 初始化，保证初始 $\Delta W=0$ 且初始化的值比较合理
```python
class LoRALinear(nn.Module):
    def __init__(self, base: nn.Linear, r=4, alpha=16):
        super().__init__()
        if not isinstance(r, int) or r <= 0:
            raise ValueError("LoRA秩须为正整数")
        self.base = base
        self.base.requires_grad_(False)
        self.r = r
        self.scaling = alpha / r
        in_f, ou_f = base.in_features, base.out_features
        self.A = nn.Parameter(base.weight.new_zeros(r, in_f))
        self.B = nn.Parameter(base.weight.new_zeros(ou_f, r))
        nn.init.kaiming_uniform_(self.A, a=math.sqrt(5))

    def forward(self, x):
        return self.base(x) + (x @ self.A.T @ self.B.T) * self.scaling
```
对于 `model()` 里的某些线性层，可以将基座冻结，然后把线性层替换为上面的 `LoRALinear`，重新跑训练
```python
def inject_lora(model, r, alpha):
    """原地注入 q_proj、v_proj，冻结原模型，返回被替换的层数。"""
    model.requires_grad_(False)
    injected_cnt = 0
    for layer in model.model.layers:
        attn = layer.self_attn
        attn.q_proj = LoRALinear(attn.q_proj, r, alpha)
        attn.v_proj = LoRALinear(attn.v_proj, r, alpha)
        injected_cnt += 2
    return injected_cnt

MODEL_ROOT = Path("/root/llm-beginner/task-3-sft-dpo/models/Qwen2.5-0.5B/")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu") 
model = AutoModelForCausalLM.from_pretrained(MODEL_ROOT).to(device)
inject_lora(model, 4, 16)
```
