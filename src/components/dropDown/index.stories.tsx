// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IoMdNotificationsOff } from "react-icons/io";
import { LuSettings } from "react-icons/lu";
import { MdMarkChatUnread } from "react-icons/md";
import { Button } from "@/components/ui/button";
import NestedDropdownMenu from "./index";

const meta = {
  title: "NestedDropdownMenu",
  component: NestedDropdownMenu,
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
} satisfies Meta<typeof NestedDropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <Button>Trigger</Button>,
    data: [
      {
        group: "conversion",
        items: [
          {
            key: "mark_read",
            content: "标记已读",
            prefix_icon: <MdMarkChatUnread />,
          },
        ],
      },
      {
        // 免打扰
        group: "message",
        items: [
          {
            key: "mute",
            content: "消息免打扰",
            prefix_icon: <IoMdNotificationsOff />,
          },
        ],
      },
    ],
  },
};

export const WithSelectMode: Story = {
  args: {
    trigger: <Button>Trigger</Button>,
    isSelectMode: true,
    selectedKey: ["mark_read"],
    data: [
      {
        group: "conversion",
        items: [
          {
            key: "mark_read",
            content: "标记已读",
            prefix_icon: <MdMarkChatUnread />,
          },
        ],
      },
    ],
  },
};

export const WithChildrenGroup: Story = {
  args: {
    trigger: <Button>Trigger</Button>,
    data: [
      {
        group: "conversion",
        items: [
          {
            key: "mark_read",
            content: "标记已读",
            prefix_icon: <MdMarkChatUnread />,
          },
        ],
      },
      {
        // 免打扰
        group: "message",
        items: [
          {
            key: "mute",
            content: "消息免打扰",
            prefix_icon: <IoMdNotificationsOff />,
          },
        ],
      },
      {
        group: "session",
        items: [
          {
            key: "translate",
            content: "消息翻译成",
            children: [
              {
                group: "translate_to",
                items: [
                  {
                    key: "translate_to_chinese",
                    content: "简体中文",
                  },
                  {
                    key: "translate_to_english",
                    content: "English",
                  },
                ],
              },
              {
                group: "default_action",
                items: [
                  {
                    key: "default_dis",
                    content: "显示翻译消息",
                  },
                  {
                    key: "default_translate",
                    content: "默认翻译消息",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const WithTopic: Story = {
  args: {
    trigger: <Button>Trigger</Button>,
    topic: (
      <div className="flex items-center gap-2">
        <LuSettings />
        <span>发送配置</span>
      </div>
    ),
    data: [
      {
        group: "conversion",
        items: [
          {
            key: "mark_read",
            content: "标记已读",
            prefix_icon: <MdMarkChatUnread />,
          },
        ],
      },
    ],
  },
};

export const WithCustomGroup: Story = {
  args: {
    trigger: <Button>Trigger</Button>,
    data: [
      {
        group: "conversion",
        items: [
          {
            key: "mark_read",
            content: "标记已读",
            prefix_icon: <MdMarkChatUnread />,
            children: [
              {
                group: "translate_to",
                custom: (
                  <div className="flex items-center gap-2">
                    <LuSettings />
                    <span>发送配置</span>
                  </div>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
};
