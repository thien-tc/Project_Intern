import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useApp } from "@/context/AppContext";
import { ThemeToggle } from "@/components/common/ThemeToggle";
interface HeaderProps {
  title: string;
  subtitle?: string;
  showNewTaskButton?: boolean;
  onNewTask?: () => void;
}

export function Header({
  title,
  subtitle,
  showNewTaskButton = false,
  onNewTask,
}: HeaderProps) {
  const { state } = useApp();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {showNewTaskButton && (
            <Button onClick={onNewTask} className="gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          )}
          {/* Footer - Simplified without user info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-center">
              <ThemeToggle />
            </div>
          </div>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>

          <UserAvatar user={state.currentUser} showName />
        </div>
      </div>
    </header>
  );
}
