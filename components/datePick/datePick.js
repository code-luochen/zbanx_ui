import { jsx, jsxs } from 'react/jsx-runtime';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import * as React from 'react';
import { zhCN } from 'date-fns/locale';
import { Button } from '../ui/button.js';
import { Calendar as Calendar$1 } from '../ui/calendar.js';
import { Input } from '../ui/input.js';
import { Label } from '../ui/label.js';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover.js';
import { cn } from '../../lib/utils.js';

function DateTimeRangePicker({ onChange, onOk, onError, format: dateFormat = "yyyy-MM-dd HH:mm", showTime = { format: "HH:mm" }, className, minDate, maxDate, initialValue = null, }) {
    // 状态管理
    const [isOpen, setIsOpen] = React.useState(false);
    const [error, setError] = React.useState(null);
    // 工具函数 - 验证时间格式是否有效
    const isValidTimeFormat = (time) => {
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    };
    // 工具函数 - 将完整日期对象分离为日期部分和时间字符串
    const splitDateTime = (date) => {
        // 创建日期部分（不含时间）
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        // 提取时间部分为HH:mm格式
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return { date: dateOnly, time: `${hours}:${minutes}` };
    };
    // 初始化函数 - 根据initialValue获取初始日期范围状态
    const getInitialDateRange = () => {
        // 安全检查initialValue
        if (initialValue &&
            Array.isArray(initialValue) &&
            initialValue.length === 2 &&
            initialValue[0] instanceof Date &&
            initialValue[1] instanceof Date &&
            !isNaN(initialValue[0].getTime()) &&
            !isNaN(initialValue[1].getTime())) {
            const startDateTime = splitDateTime(initialValue[0]);
            const endDateTime = splitDateTime(initialValue[1]);
            return {
                start: { date: startDateTime.date, time: startDateTime.time },
                end: { date: endDateTime.date, time: endDateTime.time },
            };
        }
        // 默认值：不选择任何日期
        return {
            start: { date: undefined, time: "00:00" },
            end: { date: undefined, time: "23:59" },
        };
    };
    // 使用懒初始化设置日期范围状态
    const [dateRange, setDateRange] = React.useState(() => getInitialDateRange());
    // 操作函数 - 重置组件到初始状态
    const resetDateRange = () => {
        setDateRange(getInitialDateRange());
        setError(null);
    };
    // 工具函数 - 将日期和时间字符串合并为完整日期对象
    const combineDateTime = (date, time) => {
        // 基本验证
        if (!date || !isValidTimeFormat(time))
            return undefined;
        // 解析时间部分
        const [hours, minutes] = time.split(":").map(Number);
        // 验证小时和分钟是否为有效数字
        if (isNaN(hours) || isNaN(minutes))
            return undefined;
        // 创建新的日期对象并设置时间
        const newDate = new Date(date);
        newDate.setHours(hours, minutes, 0, 0);
        // 确保生成的日期是有效的
        return isNaN(newDate.getTime()) ? undefined : newDate;
    };
    // 验证函数 - 检查日期范围是否有效
    const isValidDateRange = (start, end) => {
        // 检查日期是否在有效范围内（基于minDate）
        if (minDate && (start < minDate || end < minDate)) {
            setError(`日期不能早于 ${format(minDate, "yyyy-MM-dd")}`);
            return false;
        }
        // 检查日期是否在有效范围内（基于maxDate）
        if (maxDate && (start > maxDate || end > maxDate)) {
            setError(`日期不能晚于 ${format(maxDate, "yyyy-MM-dd")}`);
            return false;
        }
        // 检查开始日期是否不晚于结束日期
        if (start > end) {
            setError("开始日期不能晚于结束日期");
            return false;
        }
        // 验证通过，清除错误状态
        setError(null);
        return true;
    };
    // 工具函数 - 获取格式化的日期字符串
    const getFormattedDate = (date) => {
        if (!date)
            return "";
        return format(date, dateFormat);
    };
    // 事件处理函数 - 处理日期选择变化
    const handleDateChange = (dates) => {
        setDateRange((prev) => ({
            start: (dates === null || dates === void 0 ? void 0 : dates.from) ? Object.assign(Object.assign({}, prev.start), { date: dates.from }) : prev.start,
            end: (dates === null || dates === void 0 ? void 0 : dates.to) ? Object.assign(Object.assign({}, prev.end), { date: dates.to }) : prev.end,
        }));
        // 清除错误状态当用户更改日期时
        setError(null);
    };
    // 事件处理函数 - 处理确认按钮点击
    const handleOk = () => {
        // 验证时间格式
        if (!isValidTimeFormat(dateRange.start.time)) {
            const errorMsg = "开始时间格式无效，请使用 HH:MM 格式";
            setError(errorMsg);
            onError === null || onError === void 0 ? void 0 : onError(errorMsg);
            return;
        }
        if (!isValidTimeFormat(dateRange.end.time)) {
            const errorMsg = "结束时间格式无效，请使用 HH:MM 格式";
            setError(errorMsg);
            onError === null || onError === void 0 ? void 0 : onError(errorMsg);
            return;
        }
        // 合并日期和时间
        const startDateTime = combineDateTime(dateRange.start.date, dateRange.start.time);
        const endDateTime = combineDateTime(dateRange.end.date, dateRange.end.time);
        // 验证并处理有效日期范围
        if (startDateTime && endDateTime) {
            // 验证日期范围
            if (!isValidDateRange(startDateTime, endDateTime)) {
                onError === null || onError === void 0 ? void 0 : onError(error);
                return;
            }
            // 准备回调参数
            const value = [startDateTime, endDateTime];
            const dateString = [
                getFormattedDate(startDateTime),
                getFormattedDate(endDateTime),
            ];
            // 触发回调
            onChange === null || onChange === void 0 ? void 0 : onChange(value, dateString);
            onOk === null || onOk === void 0 ? void 0 : onOk(value);
        }
        // 关闭弹窗
        setIsOpen(false);
    };
    // 计算显示状态 - 按钮上显示的日期文本
    const displayText = dateRange.start.date && dateRange.end.date
        ? `${format(dateRange.start.date, "yyyy-MM-dd")} ${dateRange.start.time} - ${format(dateRange.end.date, "yyyy-MM-dd")} ${dateRange.end.time}`
        : "选择日期范围";
    // 计算显示状态 - 传递给日历组件的已选择范围
    const selectedRange = dateRange.start.date && dateRange.end.date
        ? { from: dateRange.start.date, to: dateRange.end.date }
        : undefined;
    return (jsx("div", { className: cn("grid gap-2", className), children: jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [jsx(PopoverTrigger, { asChild: true, children: jsxs(Button, { variant: "outline", className: cn("w-full justify-start text-left font-normal transition-all hover:bg-muted/50", !dateRange.start.date && "text-muted-foreground"), children: [jsx(Calendar, { className: "mr-2 h-4 w-4 text-primary" }), jsx("span", { className: "truncate", children: displayText })] }) }), jsx(PopoverContent, { className: "w-auto p-0 shadow-lg rounded-lg border-0 overflow-hidden", align: "start", children: jsxs("div", { className: "p-4 bg-background border rounded-lg", children: [error && (jsx("div", { className: "mb-3 p-2 bg-destructive/10 text-destructive text-sm rounded-md", children: error })), jsx(Calendar$1, { mode: "range", locale: zhCN, selected: selectedRange, onSelect: handleDateChange, className: "rounded-md border mb-3 shadow-sm w-full" }), showTime && (jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-3 bg-muted/30 rounded-md", children: [jsxs("div", { className: "grid gap-2", children: [jsx(Label, { htmlFor: "start-time", className: "text-sm font-medium", children: "\u5F00\u59CB\u65F6\u95F4" }), jsx(Input, { id: "start-time", type: "time", value: dateRange.start.time, onChange: (e) => setDateRange((prev) => (Object.assign(Object.assign({}, prev), { start: Object.assign(Object.assign({}, prev.start), { time: e.target.value }) }))), className: "w-full min-w-[120px] border-muted-foreground/20 focus:border-primary transition-all" })] }), jsxs("div", { className: "grid gap-2", children: [jsx(Label, { htmlFor: "end-time", className: "text-sm font-medium", children: "\u7ED3\u675F\u65F6\u95F4" }), jsx(Input, { id: "end-time", type: "time", value: dateRange.end.time, onChange: (e) => setDateRange((prev) => (Object.assign(Object.assign({}, prev), { end: Object.assign(Object.assign({}, prev.end), { time: e.target.value }) }))), className: "w-full min-w-[120px] border-muted-foreground/20 focus:border-primary transition-all" })] })] })), jsxs("div", { className: "flex justify-end gap-3 mt-5 pt-3 border-t border-border", children: [jsx(Button, { variant: "ghost", onClick: () => {
                                            const today = new Date();
                                            // 创建只包含日期部分的对象
                                            const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                            setDateRange((prev) => ({
                                                start: Object.assign(Object.assign({}, prev.start), { date: todayDate }),
                                                end: Object.assign(Object.assign({}, prev.end), { date: todayDate }),
                                            }));
                                            // 清除错误状态
                                            setError(null);
                                        }, children: "\u6B64\u523B (\u8DF3\u8F6C\u5230\u4ECA\u5929)" }), jsx(Button, { variant: "ghost", onClick: () => {
                                            resetDateRange();
                                        }, className: "hover:bg-muted transition-colors", children: "\u91CD\u7F6E" }), jsx(Button, { variant: "secondary", onClick: () => setIsOpen(false), className: "hover:bg-muted transition-colors", children: "\u53D6\u6D88" }), jsx(Button, { onClick: handleOk, className: "bg-primary hover:bg-primary/90 transition-colors", children: "\u786E\u5B9A" })] })] }) })] }) }));
}

export { DateTimeRangePicker, DateTimeRangePicker as default };
