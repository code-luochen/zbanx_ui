"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

// 定义日期范围类型
type DateRange = {
  start: {
    date?: Date;
    time: string;
  };
  end: {
    date?: Date;
    time: string;
  };
};

// 定义日期时间范围类型
type DateTimeRange = {
  from?: Date;
  to?: Date;
};

// 时间格式验证正则
type TimeFormatValidator = (time: string) => boolean;

import { zhCN } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimeRangePickerProps {
  onChange?: (value: [Date, Date] | null, dateString: [string, string]) => void;
  onOk?: (value: [Date, Date] | null) => void;
  onError?: (error: string) => void;
  format?: string;
  showTime?: boolean | { format: string };
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  initialValue?: [Date, Date] | null;
}

export function DateTimeRangePicker({
  onChange,
  onOk,
  onError,
  format: dateFormat = "yyyy-MM-dd HH:mm",
  showTime = { format: "HH:mm" },
  className,
  minDate,
  maxDate,
  initialValue = null,
}: DateTimeRangePickerProps) {
  // 状态管理
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // 工具函数 - 验证时间格式是否有效
  const isValidTimeFormat: TimeFormatValidator = (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // 工具函数 - 将完整日期对象分离为日期部分和时间字符串
  const splitDateTime = (date: Date): { date: Date; time: string } => {
    // 创建日期部分（不含时间）
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    // 提取时间部分为HH:mm格式
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return { date: dateOnly, time: `${hours}:${minutes}` };
  };

  // 初始化函数 - 根据initialValue获取初始日期范围状态
  const getInitialDateRange = (): DateRange => {
    // 安全检查initialValue
    if (
      initialValue &&
      Array.isArray(initialValue) &&
      initialValue.length === 2 &&
      initialValue[0] instanceof Date &&
      initialValue[1] instanceof Date &&
      !isNaN(initialValue[0].getTime()) &&
      !isNaN(initialValue[1].getTime())
    ) {
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
  const [dateRange, setDateRange] = React.useState<DateRange>(() =>
    getInitialDateRange()
  );

  // 操作函数 - 重置组件到初始状态
  const resetDateRange = () => {
    setDateRange(getInitialDateRange());
    setError(null);
  };

  // 工具函数 - 将日期和时间字符串合并为完整日期对象
  const combineDateTime = (
    date: Date | undefined,
    time: string
  ): Date | undefined => {
    // 基本验证
    if (!date || !isValidTimeFormat(time)) return undefined;

    // 解析时间部分
    const [hours, minutes] = time.split(":").map(Number);

    // 验证小时和分钟是否为有效数字
    if (isNaN(hours) || isNaN(minutes)) return undefined;

    // 创建新的日期对象并设置时间
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);

    // 确保生成的日期是有效的
    return isNaN(newDate.getTime()) ? undefined : newDate;
  };

  // 验证函数 - 检查日期范围是否有效
  const isValidDateRange = (start: Date, end: Date): boolean => {
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
  const getFormattedDate = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, dateFormat);
  };

  // 事件处理函数 - 处理日期选择变化
  const handleDateChange = (dates: DateTimeRange | undefined) => {
    setDateRange((prev) => ({
      start: dates?.from ? { ...prev.start, date: dates.from } : prev.start,
      end: dates?.to ? { ...prev.end, date: dates.to } : prev.end,
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
      onError?.(errorMsg);
      return;
    }

    if (!isValidTimeFormat(dateRange.end.time)) {
      const errorMsg = "结束时间格式无效，请使用 HH:MM 格式";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    // 合并日期和时间
    const startDateTime = combineDateTime(
      dateRange.start.date,
      dateRange.start.time
    );
    const endDateTime = combineDateTime(dateRange.end.date, dateRange.end.time);

    // 验证并处理有效日期范围
    if (startDateTime && endDateTime) {
      // 验证日期范围
      if (!isValidDateRange(startDateTime, endDateTime)) {
        onError?.(error!);
        return;
      }

      // 准备回调参数
      const value: [Date, Date] = [startDateTime, endDateTime];
      const dateString: [string, string] = [
        getFormattedDate(startDateTime),
        getFormattedDate(endDateTime),
      ];

      // 触发回调
      onChange?.(value, dateString);
      onOk?.(value);
    }

    // 关闭弹窗
    setIsOpen(false);
  };

  // 计算显示状态 - 按钮上显示的日期文本
  const displayText =
    dateRange.start.date && dateRange.end.date
      ? `${format(dateRange.start.date, "yyyy-MM-dd")} ${
          dateRange.start.time
        } - ${format(dateRange.end.date, "yyyy-MM-dd")} ${dateRange.end.time}`
      : "选择日期范围";

  // 计算显示状态 - 传递给日历组件的已选择范围
  const selectedRange =
    dateRange.start.date && dateRange.end.date
      ? { from: dateRange.start.date, to: dateRange.end.date }
      : undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal transition-all hover:bg-muted/50",
              !dateRange.start.date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
            <span className="truncate">{displayText}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 shadow-lg rounded-lg border-0 overflow-hidden"
          align="start"
        >
          <div className="p-4 bg-background border rounded-lg">
            {error && (
              <div className="mb-3 p-2 bg-destructive/10 text-destructive text-sm rounded-md">
                {error}
              </div>
            )}
            <Calendar
              mode="range"
              locale={zhCN}
              selected={selectedRange}
              onSelect={handleDateChange}
              className="rounded-md border mb-3 shadow-sm w-full"
            />

            {showTime && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-3 bg-muted/30 rounded-md">
                <div className="grid gap-2">
                  <Label htmlFor="start-time" className="text-sm font-medium">
                    开始时间
                  </Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={dateRange.start.time}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: { ...prev.start, time: e.target.value },
                      }))
                    }
                    className="w-full min-w-[120px] border-muted-foreground/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end-time" className="text-sm font-medium">
                    结束时间
                  </Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={dateRange.end.time}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        end: { ...prev.end, time: e.target.value },
                      }))
                    }
                    className="w-full min-w-[120px] border-muted-foreground/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => {
                  const today = new Date();
                  // 创建只包含日期部分的对象
                  const todayDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate()
                  );

                  setDateRange((prev) => ({
                    start: { ...prev.start, date: todayDate },
                    end: { ...prev.end, date: todayDate },
                  }));

                  // 清除错误状态
                  setError(null);
                }}
              >
                此刻 (跳转到今天)
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  resetDateRange();
                }}
                className="hover:bg-muted transition-colors"
              >
                重置
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsOpen(false)}
                className="hover:bg-muted transition-colors"
              >
                取消
              </Button>
              <Button
                onClick={handleOk}
                className="bg-primary hover:bg-primary/90 transition-colors"
              >
                确定
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateTimeRangePicker;
