import { __rest } from '../../node_modules/.pnpm/@rollup_plugin-typescript@12.3.0_rollup@4.53.2_tslib@2.8.1_typescript@5.9.3/node_modules/tslib/tslib.es6.js';
import { jsx } from 'react/jsx-runtime';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '../../lib/utils.js';

function Popover(_a) {
    var props = __rest(_a, []);
    return jsx(PopoverPrimitive.Root, Object.assign({ "data-slot": "popover" }, props));
}
function PopoverTrigger(_a) {
    var props = __rest(_a, []);
    return jsx(PopoverPrimitive.Trigger, Object.assign({ "data-slot": "popover-trigger" }, props));
}
function PopoverContent(_a) {
    var { className, align = "center", sideOffset = 4 } = _a, props = __rest(_a, ["className", "align", "sideOffset"]);
    return (jsx(PopoverPrimitive.Portal, { children: jsx(PopoverPrimitive.Content, Object.assign({ "data-slot": "popover-content", align: align, sideOffset: sideOffset, className: cn("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden", className) }, props)) }));
}

export { Popover, PopoverContent, PopoverTrigger };
