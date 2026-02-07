export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-primary">Sline Admin Setup</h1>
      <p className="mt-4 text-muted-foreground">Tailwind & Shadcn Configured</p>
      <div className="mt-8 flex gap-4">
        <div className="h-16 w-16 rounded-lg bg-primary animate-pulse-soft"></div>
        <div className="h-16 w-16 rounded-lg bg-secondary"></div>
        <div className="h-16 w-16 rounded-lg bg-destructive"></div>
      </div>
    </div>
  );
}
