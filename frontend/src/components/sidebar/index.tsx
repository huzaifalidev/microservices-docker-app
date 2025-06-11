import {
  FileBarChart,
  CheckSquare,
  Briefcase,
  LogOut,
  User,
  Moon,
  Sun,
  ChevronUp,
  TrendingUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../ui/theme-provider";
import { useAlertDialog } from "../alertdialog";
import { showSuccessToast } from "../toasts";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAdmin } from "@/redux/slices/admin";
import { useEffect } from "react";
import type { RootState } from "@/redux/store";
// import { toggleSidebar, collapseSidebar } from "@/redux/slices/sidebar";
import { setColorTheme } from "@/redux/slices/theme";

const navItems = [
  { title: "Dashboard", icon: TrendingUp, url: "/dashboard" },
  { title: "Tasks", icon: CheckSquare, url: "/tasks" },
  { title: "Portfolios", icon: Briefcase, url: "/portfolios" },
  { title: "Report", icon: FileBarChart, url: "/reports" },
];


export function AppSidebar() {
  const dispatch = useDispatch();
  const isCollapsed = useSelector(
    (state: RootState) => state.sidebar.collapsed
  );
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { showDialog } = useAlertDialog();
  const admin = useSelector((state: any) => state.admin);

  const handleLogout = () => {
    showDialog({
      title: "Log out?",
      description: "Are you sure you want to log out of your account?",
      onConfirm: () => {
        localStorage.removeItem("adminToken");
        showSuccessToast("Logged out");
        setTimeout(() => navigate("/signin"), 1000);
      },
    });
  };
  const profileHandler = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/taskMate/admin/adminInfo",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      if (res.status === 200) {
        const { _id, name, email } = res.data.admin;
        dispatch(
          setAdmin({ admin: { id: _id, name, email }, isLoggedIn: true })
        );
      }
    } catch (error) {
      console.error("Profile fetch failed", error);
    }
  };

  useEffect(() => {
    profileHandler();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    dispatch(setColorTheme(newTheme));
  };


  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className={isCollapsed ? "p-2" : "p-3"}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={isCollapsed ? "justify-center" : "gap-3"}
              tooltip={isCollapsed ? "Toggle Sidebar" : undefined}
              isActive
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[#0052cc] text-white">
                <img src="src/assets/fav_icon.png" alt="Logo" className="w-6 h-6" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col text-left">
                  <span className="font-semibold">TaskMate</span>
                  <span className="text-xs text-muted-foreground">
                    Task Management System
                  </span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={isCollapsed ? item.title : undefined}
                  >
                    <Link
                      to={item.url}
                      className={
                        isCollapsed
                          ? "justify-center"
                          : "flex items-center gap-3"
                      }
                    >
                      <item.icon className="size-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={isCollapsed ? "p-2" : "p-3"}>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className={isCollapsed ? "justify-center" : "gap-3"}
                >
                  <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-indigo-600">
                    <img
                      src={`https://www.github.com/huzaifalidev.png`}
                      alt="User Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="font-medium truncate">
                        {admin.admin.name || "Admin"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {admin.admin.email || "example.com"}
                      </span>
                    </div>
                  )}
                  {!isCollapsed && <ChevronUp className="ml-auto size-4" />}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 size-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={toggleTheme}
                  className="cursor-pointer"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="mr-2 size-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 size-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <LogOut className="mr-2 size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
      <ToastContainer />
    </Sidebar>
  );
}

export default AppSidebar;
