export function DashboardHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
      <p className="text-muted-foreground text-sm max-w-2xl">{description}</p>
    </div>
  );
}
