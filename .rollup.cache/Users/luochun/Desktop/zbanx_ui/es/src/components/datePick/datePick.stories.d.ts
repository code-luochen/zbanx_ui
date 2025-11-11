import type { StoryObj } from "@storybook/nextjs-vite";
import DateTimeRangePicker from "./datePick";
export declare const ActionsData: {
    onChange: import("storybook/test").Mock<(...args: any[]) => any>;
    onOk: import("storybook/test").Mock<(...args: any[]) => any>;
    onError: import("storybook/test").Mock<(...args: any[]) => any>;
};
declare const meta: {
    component: typeof DateTimeRangePicker;
    title: string;
    tags: string[];
    excludeStories: RegExp;
    args: {
        format: string;
        showTime: {
            format: string;
        };
        onChange: import("storybook/test").Mock<(...args: any[]) => any>;
        onOk: import("storybook/test").Mock<(...args: any[]) => any>;
        onError: import("storybook/test").Mock<(...args: any[]) => any>;
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const DateOnly: Story;
export declare const WithInitialValue: Story;
export declare const WithDateRange: Story;
export declare const CustomFormat: Story;
export declare const WithErrorHandling: Story;
export declare const MobileView: Story;
