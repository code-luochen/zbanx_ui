import type React from "react";
import { type ComponentProps, useCallback, useMemo } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 类型定义
export interface MenuItem {
  key: string;
  prefix_icon?: React.ReactNode;
  content: React.ReactNode;
  suffix_icon?: React.ReactNode;
  children?: MenuGroup[]; // 子项可以是分组
  onClick?: () => void;
  disabled?: boolean;
}

export interface MenuGroup {
  group?: string; // 分组名称变为可选
  items?: MenuItem[];
  label?: string;
  custom?: React.ReactNode;
}

interface NestedDropdownMenuProps
  extends ComponentProps<typeof DropdownMenu>,
    ComponentProps<typeof DropdownMenuContent> {
  data: MenuGroup[];
  trigger: React.ReactNode;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  isSelectMode?: boolean;
  selectedKey?: string[];
  onItemClick?: (key: string) => void;
  topic?: React.ReactNode;
}

// 递归渲染菜单分组的组件
const RenderMenuGroup = ({
  group,
  level = 0,
  isSelectMode = false,
  selectedKey = [],
}: {
  group: MenuGroup;
  level?: number;
  isSelectMode?: boolean;
  selectedKey?: string[];
}) => {
  return (
    <>
      {group.label && (
        <DropdownMenuLabel
          className={`text-xs font-semibold text-muted-foreground px-2 py-1.5 ${
            level > 0 ? "text-[10px]" : ""
          }`}
        >
          {group.label}
        </DropdownMenuLabel>
      )}

      {group?.custom && <section>{group.custom}</section>}

      {group?.items?.map((item, index) => (
        <RenderMenuItem
          key={item.key || index}
          item={item}
          level={level}
          isSelectMode={isSelectMode}
          selectedKey={selectedKey}
        />
      ))}
    </>
  );
};

const RenderItem = ({
  prefix_icon,
  content,
  suffix_icon,
  isSelectMode = false,
  selectedKey = [],
  itemKey = "",
}: {
  prefix_icon?: React.ReactNode;
  content: React.ReactNode;
  suffix_icon?: React.ReactNode;
  isSelectMode?: boolean;
  selectedKey?: string[];
  itemKey?: string;
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-4">{prefix_icon && <span>{prefix_icon}</span>}</div>
        <span>{content}</span>
      </div>

      <DropdownMenuShortcut>
        {!isSelectMode && suffix_icon && <span>{suffix_icon}</span>}
        {isSelectMode && selectedKey.includes(itemKey) ? (
          <IoCheckmarkOutline />
        ) : null}
      </DropdownMenuShortcut>
    </>
  );
};

// 递归渲染菜单项的组件
const RenderMenuItem = ({
  item,
  level = 0,
  isSelectMode = false,
  selectedKey = [],
}: {
  item: MenuItem;
  level?: number;
  isSelectMode?: boolean;
  selectedKey?: string[];
}) => {
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="flex items-center justify-between cursor-pointer px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent">
          <RenderItem
            prefix_icon={item.prefix_icon}
            content={item.content}
            suffix_icon={item.suffix_icon}
            isSelectMode={isSelectMode}
            selectedKey={selectedKey}
            itemKey={item.key}
          />
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent
          className="min-w-[160px]"
          sideOffset={2}
          alignOffset={-5}
        >
          {item?.children?.map((childGroup, index) => (
            <div key={childGroup.group || index}>
              <RenderMenuGroup group={childGroup} level={level + 1} />
              {index < item.children!.length - 1 && <DropdownMenuSeparator />}
            </div>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  return (
    <DropdownMenuItem
      onClick={item.onClick}
      disabled={item.disabled}
      className="flex items-center justify-between cursor-pointer px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
    >
      <RenderItem
        prefix_icon={item.prefix_icon}
        content={item.content}
        suffix_icon={item.suffix_icon}
        isSelectMode={isSelectMode}
        selectedKey={selectedKey}
        itemKey={item.key}
      />
    </DropdownMenuItem>
  );
};

const NestedDropdownMenu: React.FC<NestedDropdownMenuProps> = ({
  data,
  trigger,
  align = "start",
  sideOffset = 4,
  className,
  onItemClick,
  isSelectMode = false,
  selectedKey = [],
  onOpenChange,
  defaultOpen = false,
  open,
  topic,
  ...props
}) => {
  // 处理菜单项点击
  const handleItemClick = useCallback(
    (item: MenuItem) => {
      if (item.onClick) {
        item.onClick();
      } else if (onItemClick) {
        onItemClick(item.key);
      }
    },
    [onItemClick]
  );

  // 为每个菜单项添加点击处理
  const processedData = useMemo(() => {
    const addClickHandler = (groups: MenuGroup[]): MenuGroup[] => {
      return groups.map((group) => ({
        ...group,
        items: group?.items?.map((item) => ({
          ...item,
          onClick: item.onClick || (() => handleItemClick(item)),
          // 递归处理子项
          children: item.children ? addClickHandler(item.children) : undefined,
        })),
      }));
    };

    return addClickHandler(data);
  }, [data, handleItemClick]);

  return (
    <DropdownMenu
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={sideOffset}
        className={`min-w-[180px] ${className}`}
        {...props}
      >
        {topic && (
          <section>
            <DropdownMenuLabel className="text-sm  px-2 py-1.5">
              {topic}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </section>
        )}

        {processedData.map((group, groupIndex) => (
          <div key={group.group || groupIndex}>
            <DropdownMenuGroup>
              <RenderMenuGroup
                group={group}
                isSelectMode={isSelectMode}
                selectedKey={selectedKey}
              />
            </DropdownMenuGroup>
            {groupIndex < processedData.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NestedDropdownMenu;
