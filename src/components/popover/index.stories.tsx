import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Popover from "./index";

const meta = {
  title: "Popover",
  component: Popover,
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <Button>打开Popover</Button>,
    content: (
      <main className="flex gap-3">
        <Label>Popover</Label>
        <Input placeholder="请输入内容" className="col-span-2 h-8" />
      </main>
    ),
    title: "操作提示",
    description: "这是一个Popover示例",
  },
};
