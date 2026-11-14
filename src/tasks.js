// 工作完成度来自任务账本；延期、委托必须留下明确的接收人或约定。
export const pendingTasks = (s) =>
  s.tasks.filter((t) => t.status === "pending");
export const task = (s, id) => s.tasks.find((t) => t.id === id);
export const remaining = (s, id) =>
  task(s, id)?.status === "pending" ? task(s, id).remaining : 0;
export function completion(tasks) {
  const total = tasks.reduce((n, t) => n + t.total, 0);
  return total
    ? Math.round(
        (100 * tasks.reduce((n, t) => n + (t.total - t.remaining), 0)) / total,
      )
    : 100;
}
export function applyTasks(state, operations, source) {
  const changes = [];
  for (const op of operations) {
    if (op.type === "add") {
      if (task(state, op.id)) throw new Error("同一任务不能重复接下");
      if (!Number.isInteger(op.effort) || op.effort <= 0)
        throw new Error("任务工作量不正确");
      state.tasks.push({
        id: op.id,
        title: op.title,
        total: op.effort,
        remaining: op.effort,
        status: "pending",
        createdAt: state.turn,
        source,
        reviewAt: op.reviewAt,
      });
      changes.push({ id: op.id, type: "add", amount: op.effort });
      continue;
    }
    const t = task(state, op.id);
    if (op.type === "reclaim") {
      if (!t || !["deferred", "delegated"].includes(t.status) || !op.agreement)
        throw new Error("接回任务需要明确原安排与新约定");
      if (t.assignee) {
        state.coworkerLoad[t.assignee] -= t.remaining;
        state.coworkerReadyAt[t.assignee] = Math.max(
          state.time,
          state.coworkerReadyAt[t.assignee] - t.remaining,
        );
      }
      t.status = "pending";
      t.agreement = op.agreement;
      if (op.assignee) t.assignee = op.assignee;
      changes.push({
        id: t.id,
        type: "reclaim",
        amount: 0,
        agreement: op.agreement,
      });
      continue;
    }
    if (!t || t.status !== "pending")
      throw new Error("不能处理不存在或已解决的任务");
    if (op.type === "advance" || op.type === "complete") {
      const amount =
        op.type === "complete" ? t.remaining : Math.min(t.remaining, op.amount);
      if (!Number.isInteger(amount) || amount <= 0)
        throw new Error("任务进度不正确");
      t.remaining -= amount;
      if (!t.remaining) t.status = "completed";
      changes.push({ id: t.id, type: op.type, amount });
    } else if (op.type === "defer" || op.type === "delegate") {
      if (!op.agreement) throw new Error("延期或交接需要明确约定");
      t.status = op.type === "defer" ? "deferred" : "delegated";
      t.agreement = op.agreement;
      if (op.assignee) t.assignee = op.assignee;
      changes.push({
        id: t.id,
        type: op.type,
        amount: 0,
        agreement: op.agreement,
      });
    } else throw new Error("未知任务操作");
    t.resolvedAt = state.turn;
    t.lastSource = source;
  }
  state.work = completion(state.tasks);
  return changes;
}
export function validateTasks(s) {
  if (new Set(s.tasks.map((t) => t.id)).size !== s.tasks.length)
    throw new Error("任务编号重复");
  for (const t of s.tasks) {
    if (
      t.remaining < 0 ||
      t.remaining > t.total ||
      !Number.isInteger(t.remaining)
    )
      throw new Error("任务余量不正确");
    if (!["pending", "completed", "deferred", "delegated"].includes(t.status))
      throw new Error("任务状态不正确");
    if (t.status === "completed" && t.remaining !== 0)
      throw new Error("任务尚未完成");
    if (["deferred", "delegated"].includes(t.status) && !t.agreement)
      throw new Error("缺少交接约定");
  }
  if (s.work !== completion(s.tasks)) throw new Error("完成度与任务账本不一致");
}
