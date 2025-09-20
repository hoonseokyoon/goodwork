"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  idPrefix: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error(`${component}는 Tabs 컴포넌트 내부에서만 사용할 수 있습니다.`);
  }

  return context;
}

type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
};

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue,
  );
  const generatedId = React.useId();

  React.useEffect(() => {
    if (value === undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, value]);

  const activeValue = value ?? internalValue ?? "";

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [value, onValueChange],
  );

  const contextValue = React.useMemo<TabsContextValue>(
    () => ({
      value: activeValue,
      setValue: handleValueChange,
      idPrefix: generatedId,
    }),
    [activeValue, handleValueChange, generatedId],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
TabsList.displayName = "TabsList";

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const context = useTabsContext("TabsTrigger");
    const isActive = context.value === itemValue;
    const triggerId = `${context.idPrefix}-trigger-${itemValue}`;
    const panelId = `${context.idPrefix}-content-${itemValue}`;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={triggerId}
        aria-selected={isActive}
        aria-controls={panelId}
        data-state={isActive ? "active" : "inactive"}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/60 data-[state=active]:bg-background data-[state=active]:text-foreground",
          isActive ? "shadow-sm" : "hover:text-foreground",
          className,
        )}
        onClick={(event) => {
          props.onClick?.(event);
          if (!isActive) {
            context.setValue(itemValue);
          }
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value: itemValue, children, ...props }, ref) => {
    const context = useTabsContext("TabsContent");
    const isActive = context.value === itemValue;
    const triggerId = `${context.idPrefix}-trigger-${itemValue}`;
    const panelId = `${context.idPrefix}-content-${itemValue}`;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={triggerId}
        hidden={!isActive}
        className={cn("focus-visible:outline-none", className)}
        {...props}
      >
        {isActive ? children : null}
      </div>
    );
  },
);
TabsContent.displayName = "TabsContent";
