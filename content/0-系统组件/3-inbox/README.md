---
date: 2025-05-30
source: hermes
status: wip
version: 0.1
---

# AI 强化 Inbox 设计雏形

## 定位

不是科研工作流，不是笔记系统，是**"想过但没做的事"的存放处**。

等状态对了，AI 能一键启动调研/学习/实验。降低启动门槛，减少焦虑。

## 目录结构

```
3-inbox/
  README.md          # 本文件，设计决策日志
  aris/              # ARIS 产出（概念拆解、实验方案、评审记录）
  webclip/           # 小红书/B站/知乎/博客爬取
  wish-to-do/        # 想做但没做的事、待调研项目、长期愿望
  trash/             # 7 天未处理自动移入，用户定期清空
```

### aris/

ARIS 跑出来的产出，临时存放，等用户确认价值。

命名: `YYYY-MM-DD-aris-主题.md`

示例:
- `2025-06-01-aris-扩散模型概念拆解.md`
- `2025-06-01-aris-扩散模型实验方案.md`

### webclip/

小红书/B站/知乎/博客的爬取内容，AI 过滤后存这里。

命名: `YYYY-MM-DD-webclip-平台-作者-主题.md`

示例:
- `2025-06-01-webclip-小红书-某博主-Agent教程.md`

### wish-to-do/

用户主动想做的事，或 AI 建议的待调研项目。

命名: `YYYY-MM-DD-主题.md`

示例:
- `2025-05-30-本地AI生图-ComfyUI调研.md`
- `2025-06-01-补Transformer数学推导.md`

### trash/

7 天未处理的文件自动移入，用户定期清空。

## 状态标签

每个文件头必须有 status:

- `#status/todo`    # 还没看/没开始
- `#status/wip`     # 在看/在改/在做
- `#status/done`    # 完成，准备搬进正式目录或归档
- `#status/trash`   # 废弃，等清理

## 写入规则

1. **AI 只能写 inbox，禁止直接写入正式目录**（CS/OI/杂物）
2. 文件头必须包含: date, source, status
3. 命名必须带日期前缀，防冲突
4. 文件名冲突时加 `-v2`, `-v3`

## 与外部系统的衔接（待研究）

| 系统 | 关系 | 状态 |
|---|---|---|
| Zotero | 文献管理，AI 速读筛选 | 已规划，待配置 |
| 微软 Todo | 日常任务，可能和 wish-to-do 同步 | **待研究** |
| ARIS | 科研自动化，产出存 aris/ | 用户之前用过，待重新启动 |
| Obsidian 正式目录 | 用户亲手写的笔记，inbox 是草稿区 | 已明确边界 |

## 已调研项目

| 项目 | URL | 用途 | 是否采用 |
|---|---|---|---|
| ARIS | https://github.com/wanshuiyin/Auto-claude-code-research-in-sleep | 科研自动化 | 待定 |
| Zotero-Analytical-Workflow-Skills | https://github.com/cheneternity/Zotero-Analytical-Workflow-Skills | Zotero→Obsidian 论文笔记 | **待抄，输出到 inbox** |
| Understand-Anything | https://github.com/Lum1104/Understand-Anything | 概念拆解+知识图谱 | 待研究 |
| zotero-arxiv-daily | https://github.com/TideDra/zotero-arxiv-daily | arXiv 自动归档 | 已了解 |

## 待办

- [ ] 抄 Zotero-Analytical-Workflow-Skills，输出到 inbox
- [ ] 研究微软 Todo 衔接方案
- [ ] 写 trash 自动清理脚本
- [ ] 测试 webclip 爬取（小红书/B站/知乎）
- [ ] 设计 wish-to-do 启动机制（时间/情绪/外部触发）
- [ ] 研究 Understand-Anything 集成
- [ ] **研究 Hermes delegate_task 到外部 agent / Claude Code / Codex CLI**（把多模态内容转化为可归档材料，不挤占上下文）
- [ ] **测试 ARIS 效果**（选一个真实领域跑完整 workflow）
- [ ] **研究 Zotero 具体怎么放**（分类结构、标签体系、和 inbox 的衔接）
- [ ] **用 Kimi WebBridge 跑通 webclip 流程**（飞书链接/小红书/知乎 → 本地存档）
- [ ] **研究视频资源归档方案**（B站：简介+字幕+辅助理解，不存视频本身）

## 决策日志

### 2025-05-30

- 创建 inbox 目录结构
- 移除 papers/，文献管理全权走 Zotero
- 合并 ideas/ + daily/ → wish-to-do/
- 明确 AI 禁止写入正式目录
- 写入第一个 wish-to-do: 本地 AI 生图
- 补充待办：delegate 外部 agent、ARIS 测试、Zotero 分类、Kimi WebBridge、视频归档
- **Windows 侧路径确认**：`E:\OBSIDIAN\blog\content\0-系统组件\3-inbox\`
