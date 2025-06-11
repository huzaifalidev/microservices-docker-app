import { ReactNode } from "react";
import { AppSidebar } from "../components/sidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <main className="flex-1 p-6">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
    
  );
};

export default Layout;
