import { fn } from "storybook/test";
import Task from "./task";
export const ActionsData = {
    onArchiveTask: fn(),
    onPinTask: fn(),
};
const meta = {
    component: Task,
    title: "Test",
    tags: ["autodocs"],
    //👇 Our exports that end in "Data" are not stories.
    excludeStories: /.*Data$/,
    args: Object.assign({}, ActionsData),
};
export default meta;
export const Default = {
    args: {
        task: {
            id: "1",
            title: "Test Task",
            state: "TASK_INBOX",
        },
    },
};
export const Pinned = {
    args: {
        task: Object.assign(Object.assign({}, Default.args.task), { state: "TASK_PINNED" }),
    },
};
export const Archived = {
    args: {
        task: Object.assign(Object.assign({}, Default.args.task), { state: "TASK_ARCHIVED" }),
    },
};
//# sourceMappingURL=task.stories.js.map