"use client";

import { Button } from "@worklog/ui";
import { Menu, Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
