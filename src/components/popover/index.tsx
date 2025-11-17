import { type ComponentProps, memo } from "react";
import {
  PopoverContent,
  Popover as PopoverPrimitive,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface PopoverProps extends ComponentProps<typeof PopoverPrimitive> {
  trigger: React.ReactNode;
  content: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  title,
  defaultOpen = false,
  open,
  onOpenChange,
  modal,
  className,
  description,
  ...props
}) => {
  return (
    <PopoverPrimitive
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>

      <PopoverContent {...props} className={cn("w-90", className)}>
        <section className="grid gap-4">
          <section className="space-y-2">
            <h4 className="leading-none font-medium">{title}</h4>
            <p className="text-muted-foreground text-sm ">{description}</p>
          </section>

          <section className="grid gap-2">{content}</section>
        </section>
      </PopoverContent>
    </PopoverPrimitive>
  );
};

export default memo(Popover);
