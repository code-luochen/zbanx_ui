import { fn } from "storybook/test";
import DateTimeRangePicker from "./datePick";
// 模拟日期数据用于故事
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
export const ActionsData = {
    onChange: fn(),
    onOk: fn(),
    onError: fn(),
};
const meta = {
    component: DateTimeRangePicker,
    title: "日期时间范围选择器/DateTimeRangePicker",
    tags: ["autodocs"],
    excludeStories: /.*Data$/,
    args: Object.assign(Object.assign({}, ActionsData), { format: "yyyy-MM-dd HH:mm", showTime: { format: "HH:mm" } }),
};
export default meta;
// 默认故事
export const Default = {
    args: {
        format: "yyyy-MM-dd HH:mm",
        showTime: { format: "HH:mm" },
    },
};
// 仅日期选择模式
export const DateOnly = {
    args: {
        format: "yyyy-MM-dd",
        showTime: false,
    },
};
// 带有初始值的故事
export const WithInitialValue = {
    args: {
        initialValue: [today, tomorrow],
    },
};
// 带有日期范围限制的故事
export const WithDateRange = {
    args: {
        minDate: today,
        maxDate: nextWeek,
    },
};
// 自定义格式的故事
export const CustomFormat = {
    args: {
        format: "MM月dd日 HH:mm",
        showTime: { format: "HH:mm" },
    },
};
// 带有错误处理的故事
export const WithErrorHandling = {
    args: {
        // 使用ActionsData中定义的模拟函数
        onError: ActionsData.onError,
    },
    play: async ({ canvasElement }) => {
        const canvas = await canvasElement;
        // 可以在这里添加交互测试逻辑
    },
};
// 小屏幕适配故事
export const MobileView = {
    parameters: {
        viewport: { width: 375, height: 667 },
    },
};
//# sourceMappingURL=datePick.stories.js.map