import { GraduationCapIcon } from "./icons";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <GraduationCapIcon className="h-5 w-5" />
          </span>
          <span className="font-semibold text-foreground">Stock Academy</span>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Making stock market education accessible for everyone
        </p>
        <p className="text-xs text-muted-foreground">© 2026 Stock Academy</p>
      </div>
    </footer>
  );
}

