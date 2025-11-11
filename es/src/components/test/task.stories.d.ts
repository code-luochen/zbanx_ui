import type { StoryObj } from "@storybook/nextjs-vite";
import Task from "./task";
export declare const ActionsData: {
    onArchiveTask: import("storybook/test").Mock<(...args: any[]) => any>;
    onPinTask: import("storybook/test").Mock<(...args: any[]) => any>;
};
declare const meta: {
    component: typeof Task;
    title: string;
    tags: string[];
    excludeStories: RegExp;
    args: {
        onArchiveTask: import("storybook/test").Mock<(...args: any[]) => any>;
        onPinTask: import("storybook/test").Mock<(...args: any[]) => any>;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Pinned: Story;
export declare const Archived: Story;
