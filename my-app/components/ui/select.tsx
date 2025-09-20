"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SelectContextValue = {
  value: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (value: string, label: string) => void;
  selectedLabel?: string;
  setSelectedLabel: (label: string | undefined) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  disabled: boolean;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext(component: string) {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error(`${component}는 Select 컴포넌트 내부에서만 사용할 수 있습니다.`);
  }

  return context;
}

type SelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Select({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  children,
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>();
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const actualValue = value ?? internalValue;

  const handleSelect = React.useCallback(
    (nextValue: string, label: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      setSelectedLabel(label || undefined);
      onValueChange?.(nextValue);
      setOpen(false);
    },
    [value, onValueChange],
  );

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      value: actualValue ?? "",
      open,
      setOpen,
      onSelect: handleSelect,
      selectedLabel,
      setSelectedLabel,
      triggerRef,
      contentRef,
      disabled,
    }),
    [actualValue, open, handleSelect, selectedLabel, disabled],
  );

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        triggerRef.current?.contains(target) ||
        contentRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <SelectContext.Provider value={contextValue}>
      <div className={cn("relative inline-block text-left", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

type SelectTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = useSelectContext("SelectTrigger");

    const handleRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        context.triggerRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
      },
      [context, ref],
    );

    return (
      <button
        type="button"
        ref={handleRef}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        aria-haspopup="listbox"
        aria-expanded={context.open}
        aria-disabled={context.disabled}
        onClick={() => {
          if (context.disabled) {
            return;
          }

          context.setOpen(!context.open);
        }}
        {...props}
      >
        <span className="flex-1 truncate text-left">
          {children ?? <SelectValue />}
        </span>
        <svg
          aria-hidden="true"
          focusable="false"
          className="size-4 shrink-0 opacity-60"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 0 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
          />
        </svg>
      </button>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

type SelectContentProps = React.HTMLAttributes<HTMLDivElement>;

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = useSelectContext("SelectContent");

    const handleRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        context.contentRef.current = node;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [context, ref],
    );

    if (!context.open) {
      return null;
    }

    const width = context.triggerRef.current?.offsetWidth;

    return (
      <div
        ref={handleRef}
        className={cn(
          "absolute z-50 mt-2 max-h-60 min-w-[8rem] overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-lg focus:outline-none",
          className,
        )}
        style={{ minWidth: width }}
        role="listbox"
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            context.setOpen(false);
          }
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SelectContent.displayName = "SelectContent";

type SelectItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  textValue?: string;
};

export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, children, value, textValue, ...props }, ref) => {
    const context = useSelectContext("SelectItem");

    const label =
      textValue ??
      (typeof children === "string" ? children : value ?? textValue ?? "");

    const isSelected = context.value === value;

    React.useEffect(() => {
      if (isSelected) {
        context.setSelectedLabel(label || undefined);
      }
    }, [isSelected, label, context]);

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        data-state={isSelected ? "checked" : "unchecked"}
        aria-selected={isSelected}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60",
          isSelected && "bg-accent text-accent-foreground",
          className,
        )}
        onClick={() => context.onSelect(value, label ?? value)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
SelectItem.displayName = "SelectItem";

type SelectValueProps = {
  placeholder?: string;
  className?: string;
};

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const context = useSelectContext("SelectValue");

  const displayValue =
    context.selectedLabel && context.selectedLabel.length > 0
      ? context.selectedLabel
      : context.value
      ? context.value
      : undefined;

  return (
    <span className={cn("block truncate", className)}>
      {displayValue ?? placeholder}
    </span>
  );
}
