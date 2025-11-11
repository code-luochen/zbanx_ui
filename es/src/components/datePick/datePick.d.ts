export type DateRange = {
    start: {
        date?: Date;
        time: string;
    };
    end: {
        date?: Date;
        time: string;
    };
};
export type DateTimeRange = {
    from?: Date;
    to?: Date;
};
interface DateTimeRangePickerProps {
    onChange?: (value: [Date, Date] | null, dateString: [string, string]) => void;
    onOk?: (value: [Date, Date] | null) => void;
    onError?: (error: string) => void;
    format?: string;
    showTime?: boolean | {
        format: string;
    };
    className?: string;
    minDate?: Date;
    maxDate?: Date;
    initialValue?: [Date, Date] | null;
}
export declare function DateTimeRangePicker({ onChange, onOk, onError, format: dateFormat, showTime, className, minDate, maxDate, initialValue, }: DateTimeRangePickerProps): import("react/jsx-runtime").JSX.Element;
export default DateTimeRangePicker;
