import { useSidebar } from "./sidebar";

export function AppSidebar() {
  const { open } = useSidebar();
  return (
    <aside
      className={`transition-all duration-300 h-screen bg-sidebar text-sidebar-foreground border-r ${
        open ? "w-64" : "w-16"
      }`}
    >
      <div className="p-4 font-bold text-lg">aimEncoders</div>
      <nav className="mt-4 flex flex-col gap-2">
        <a className="p-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" href="#">Dashboard</a>
        <a className="p-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" href="#">Inventory</a>
        <a className="p-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" href="#">Transactions</a>
        <a className="p-2 rounded hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" href="#">Reports</a>
      </nav>
    </aside>
  );
}
