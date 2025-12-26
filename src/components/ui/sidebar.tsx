import * as React from "react";

const SidebarContext = React.createContext<{ open: boolean; toggle: () => void } | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  const toggle = () => setOpen((prev) => !prev);

  return <SidebarContext.Provider value={{ open, toggle }}>{children}</SidebarContext.Provider>;
}

export function SidebarTrigger({ className }: { className?: string }) {
  const context = React.useContext(SidebarContext);
  if (!context) return null;

  return (
    <button
      onClick={context.toggle}
      className={`p-2 rounded-md border ${className || ""}`}
    >
      {context.open ? "Close" : "Open"} Sidebar
    </button>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}
export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  const context = React.useContext(SidebarContext);
  if (!context) return null;

  return context.open ? <div className={className} {...props} /> : null;
}