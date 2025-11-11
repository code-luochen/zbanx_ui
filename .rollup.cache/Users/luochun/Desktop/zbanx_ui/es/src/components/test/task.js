import { jsx as _jsx } from "react/jsx-runtime";
export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask, }) {
    return (_jsx("main", { className: "flex items-center justify-between p-2 border-b border-slate-200", onClick: () => {
            onArchiveTask(id);
            onPinTask(id);
        }, children: "heloo" }));
}
//# sourceMappingURL=task.js.map