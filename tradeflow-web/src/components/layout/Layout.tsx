import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { NotificationToast } from "../ui/NotificationToast"
import { CommandBar } from "./CommandBar"

export function Layout() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      <NotificationToast />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <Outlet />
        </main>
      </div>
      <CommandBar />
    </div>
  )
}
