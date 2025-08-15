import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TrafficLightIcon } from "@/components/icons/traffic-light-icon";

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background/50 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2">
        <TrafficLightIcon className="h-6 w-6 text-primary" />
        <h1 className="text-lg font-semibold tracking-tighter">
          TrafficFlow Sandbox
        </h1>
      </div>
      <div className="ml-auto">
        <SidebarTrigger />
      </div>
    </header>
  );
}
