# Hermes Agent 多 Agent 协作调研

来源: anysearch + 官方文档提取
日期: 2025-06-01
标签: `#status/todo`

---

## 核心结论

Hermes Agent 目前有两套多 Agent 协作机制，定位完全不同：

| 机制 | 定位 | 生命周期 | 适用场景 |
|---|---|---|---|
| `delegate_task` | 同步子代理（RPC 调用） | 单次对话内，父代理阻塞等待 | 需要推理判断的并行子任务 |
| Kanban Board | 异步持久化工单系统 | 跨会话、可恢复、可人工介入 | 长期项目、角色流水线、人机协作 |

---

## 1. delegate_task — 同步子代理

### 基本用法

单任务：
```python
delegate_task(
    goal="Debug why tests fail",
    context="Error: assertion in test_foo.py line 42",
    toolsets=["terminal", "file"]
)
```

并行批处理（最多 3 个并发，可配置）：
```python
delegate_task(tasks=[
    {"goal": "Research topic A", "toolsets": ["web"]},
    {"goal": "Research topic B", "toolsets": ["web"]},
    {"goal": "Fix the build", "toolsets": ["terminal", "file"]}
])
```

### 关键限制

- **子代理完全隔离**：零父代理上下文，必须通过 `goal` + `context` 传递所有信息
- **阻塞父代理**：父代理等待所有子代理完成才能继续
- **不可恢复**：子代理失败 = 工作丢失，无重试/恢复机制
- **无子代理间通信**：子代理彼此不知道对方存在
- **深度限制**：默认 `max_spawn_depth=1`（扁平），最高可配到 3
- **禁止递归**：叶子子代理不能调用 `delegate_task`、`clarify`、`memory`、`send_message`、`execute_code`

### 嵌套编排（opt-in）

```python
# 父代理 spawn 一个 orchestrator 子代理
delegate_task(
    goal="Coordinate research and synthesis",
    role="orchestrator",  # 保留 delegation 工具集
)
```

配置（`~/.hermes/config.yaml`）：
```yaml
delegation:
  max_concurrent_children: 3
  max_spawn_depth: 1        # 1=扁平, 2=允许子代理再委派, 3=三层
  orchestrator_enabled: true
  max_iterations: 50        # 每个子代理最多 50 轮工具调用
  model: "google/gemini-3-flash-preview"  # 可选：子代理用不同模型
  provider: "openrouter"
```

### delegate_task vs execute_code

| | delegate_task | execute_code |
|---|---|---|
| 推理能力 | 完整 LLM 推理循环 | 仅 Python 执行 |
| 上下文 | 独立对话 | 无对话，仅脚本 |
| 工具访问 | 全部非阻塞工具 | 7 个工具 via RPC |
| 并行度 | 3 并发（可配置） | 单脚本 |
| 适用场景 | 需要判断的复杂任务 | 机械式数据处理管道 |
| Token 成本 | 高 | 低 |

---

## 2. Kanban Board — 异步多 Agent 协作

这是 Hermes 真正的多 Agent 架构。不是一次性子代理，而是**持久化工单系统**。

### 核心概念

- **Board** = 独立队列 + SQLite DB + workspace 目录。默认 `default`，可建多个（按项目隔离）
- **Task** = 一行记录：title, body, assignee(profile名), status, workspace, comment 线程
- **Link** = 父子依赖关系。父任务完成 → 子任务自动变为 ready
- **Comment** = Agent 间通信协议。每次 worker 被 spawn 时读取完整 comment 线程作为上下文
- **Workspace** = 工作目录：
  - `scratch`（默认，临时，任务完成即删）
  - `dir:<path>`（持久化共享目录，如 Obsidian vault）
  - `worktree`（git worktree，代码任务）
- **Dispatcher** = 常驻循环，每 60s 扫描一次：回收僵死任务 → 提升 ready 任务 → 原子认领 → spawn worker

### 状态流转

```
triage → todo → ready → running → done
              ↑         ↓
              └──── blocked（需人工 unblock）
```

`triage` 列存放粗糙想法。默认 `auto_decompose: true`，dispatcher 自动运行 **decomposer** 把 triage 任务拆成子任务图。

### 两个关键 Skill

1. **kanban-worker**：教 worker 生命周期（spawn → kanban_show → 干活 → heartbeat → complete/block）
2. **kanban-orchestrator**：教编排器如何分解任务、创建子任务、建立依赖、不自己干活

### Worker 工具集（模型直接调用，非 CLI）

| 工具 | 用途 |
|---|---|
| `kanban_show` | 读取当前任务（含 comment 线程、父任务交接信息） |
| `kanban_list` | 按 assignee/status/tenant 过滤列任务 |
| `kanban_complete` | 完成任务，附 summary + metadata |
| `kanban_block` | 阻塞任务，等人工输入 |
| `kanban_heartbeat` | 长任务保活信号（>1h 必须每小时发一次） |
| `kanban_comment` | 追加 durable note 到任务线程 |
| `kanban_create` | （编排器）创建子任务 |
| `kanban_link` | （编排器）建立依赖边 |
| `kanban_unblock` | （编排器）解除阻塞 |

### 协作模式（官方列出的 9 种）

| 模式 | 形状 | 例子 |
|---|---|---|
| P1 Fan-out | N 个并行同角色 | "5 个角度并行研究" |
| P2 Pipeline | 角色链：scout → editor → writer | 每日简报组装 |
| P3 Voting | N 个并行 + 1 个聚合 | 3 个研究员 → 1 个评审选最优 |
| P4 Long-running journal | 同 profile + 共享目录 + cron | Obsidian vault 持续维护 |
| P5 Human-in-the-loop | worker block → 人评论 → unblock | 模糊决策 |
| P6 @mention | 从正文中 inline 路由 | @reviewer 看看这个 |
| P7 Thread-scoped workspace | gateway thread 内 /kanban | 按项目隔离 |
| P8 Fleet farming | 一个 profile，N 个 subject | 50 个社交账号管理 |
| P9 Triage specifier | 粗糙想法 → triage → specify 扩展 | 一句话变规格化任务 |

### Kanban vs delegate_task 对比

| | delegate_task | Kanban |
|---|---|---|
| 形状 | RPC 调用（fork → join） | 持久消息队列 + 状态机 |
| 父代理 | 阻塞到子代理返回 | create 后 fire-and-forget |
| 子代理身份 | 匿名子代理 | 具名 profile，有持久记忆 |
| 可恢复性 | 无 — 失败即失败 | block → unblock → rerun；crash → reclaim |
| 人工介入 | 不支持 | 随时 comment / unblock |
| 每任务 Agent 数 | 一次调用一个 | 任务生命周期内 N 个（重试、评审、跟进） |
| 审计追踪 | 上下文压缩后丢失 | SQLite 永久保存 |
| 协调方式 | 层级（调用者 → 被调用者） | 对等 — 任何 profile 可读写任何任务 |

### 使用门槛

- 需要 `hermes gateway start`（dispatcher 跑在 gateway 里）
- 需要预先配置多个 profile（如 `researcher`, `writer`, `ops`）
- Worker profile 必须加载 `kanban-worker` skill
- Orchestrator profile 必须加载 `kanban-orchestrator` skill
- 单主机设计，不支持跨主机共享 board

---

## 3. Cron Jobs — 定时任务（补充）

虽然不是严格的多 Agent，但和 Kanban 配合可实现长期自动化：

- 定时 spawn agent 处理任务
- 可附加 skills
- `context_from` 支持任务链（Job A 输出 → Job B 输入）
- `no_agent=True` 纯脚本模式（watchdog、阈值告警）
- 由 gateway daemon 调度，每 60s 检查一次

---

## 4. 未来方向（GitHub Issue #344）

官方在 2026-03 提出的多 Agent 架构愿景，目前 Kanban 已经实现了大部分：

- ✅ **工作流 DAG**：Kanban 的 `kanban_link` + 依赖自动提升已实现
- ✅ **持久化 + 恢复**：Kanban 的 SQLite + reclaim 机制已实现
- ✅ **角色专业化**：通过 profile + skill 实现
- ✅ **人工介入**：Kanban block/unblock 已实现
- 🔄 **Agent 间直接通信**：GitHub Issue #25176 提议 `agent_channel` 消息总线，尚未实现
- 🔄 **对抗辩论模式**：Issue #376，两 Agent 迭代优化
- 🔄 **共享内存池**：Issue #377，工作流 Agent 间共享上下文

---

## 一手链接

1. Kanban 官方文档：https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban
2. Subagent Delegation 文档：https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation
3. Cron 文档：https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md
4. 多 Agent 架构 Issue #344：https://github.com/NousResearch/hermes-agent/issues/344
5. Agent-to-Agent 消息 Issue #25176：https://github.com/NousResearch/hermes-agent/issues/25176
