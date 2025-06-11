"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Search,
  Users,
  CheckSquare,
  Briefcase,
  FileText,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  UsersRound,
} from "lucide-react"
import { TaskStatusChart } from "@/components/ui/task-status-chart"
import { TasksByDayChart } from "@/components/ui/reports-generated-chart"
import { startLoading, stopLoading } from "@/redux/slices/loading"
import axios from "axios"
import { useDispatch } from "react-redux"
import { showErrorToast } from "@/components/toasts"
import { useEffect, useState } from "react"






export default function Dashboard() {
  const dispatch = useDispatch();
  interface DashboardDetails {
    totalTasks: number;
    totalPortfolios: number;
    totalReports: number;
    totalClients: number;
    totalServiceProviders: number;
    recentClients: {
      id: number;
      name: string;
      email: string;
      phone: string;
      status: string;
      joinedDate: string;
      avatar: string;
      phoneNumber: string;
      profilePicture: string;
    }[];
    recentTasks: {
      id: number;
      title: string;
      description: string;
      dueDate: string;
      assignedTo: string;
      status: string;
      priority: string;
      deadline: string;
      taskStatus: string;

    }[];
    recentServiceProviders: {
      id: number;
      name: string;
      specialization: string;
      contact: string;
      phone: string;
      location: string;
      onboardedDate: string;
      profilePicture?: string;
      phoneNumber?: string;
      updatedAt?: string;
      email?: string;
      createdAt: string;
    }[];
    taskStatus: {
      inProgress: number;
      approved: number;
      pending: number;
      completed: number;
    };
  }
  const [details, setDetails] = useState<DashboardDetails | null>(null);
  const detailsHandler = async () => {
    try {
      dispatch(startLoading());
      const response = await axios.get(
        `http://localhost:5001/taskMate/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      if (response.status === 200) {
        setDetails(response.data.data);
        console.log("Dashboard data:", response.data.data);
      }
    } catch (error) {
      showErrorToast("Error fetching dashboard data");
    } finally {
      dispatch(stopLoading());
    }
  };
  const getApprovalBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "modify":
        return <Badge style={{ backgroundColor: "#f59e0b" }}>Modify</Badge>;
      case "approved":
        return <Badge style={{ backgroundColor: "#22c55e" }}>Approved</Badge>;
      case "pending":
        return <Badge style={{ backgroundColor: "#ef4444" }}>Pending</Badge>;
      case "completed":
        return <Badge style={{ backgroundColor: "#3b82f6" }}>Completed</Badge>;
      case "in-progress":
        return (
          <Badge style={{ backgroundColor: "#9b59b6" }}>In Progress</Badge>
        );
      default:
        return <Badge className="bg-zinc-950">{status}</Badge>;
    }
  };
  useEffect(() => {
    detailsHandler();
  }, [dispatch]);
  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return dateObj.toLocaleDateString("en-US", options);
  };
  return (
    <div className="min-h-screen dark:*:bg-zinc-950 flex flex-col dark: text-zinc-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold dark:text-zinc-50 text-zinc-800">Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{details?.totalTasks.toLocaleString() || "120"}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{details?.totalClients.toLocaleString() || "89"}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +120% from last month
                </span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Service Providers</CardTitle>
              <UsersRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{details?.totalServiceProviders.toLocaleString() || "30"}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +50% from last month
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <TaskCompletionChart /> */}
          <TasksByDayChart
          />
          <TaskStatusChart
            chartConfig={{
              colors: {
                inProgress: "#9b59b6",
                approved: "#22c55e",
                pending: "#ef4444",
                completed: "#3b82f6",
              },
            }}
            inProgress={details?.taskStatus["in-progress"] || 0}
            approved={details?.taskStatus["approved"] || 0}
            pending={details?.taskStatus["pending"] || 0}
            completed={details?.taskStatus["completed"] || 0}
          />
          {/* <PortfolioPerformanceChart /> */}
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Clients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Recent Clients
              </CardTitle>
              <CardDescription>Latest client additions to the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {details?.recentClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center space-x-4 p-3 rounded-lg border bg-white dark:bg-zinc-900 transition hover:shadow-sm"
                >
                  <Avatar>
                    <AvatarImage
                      src={client.profilePicture || "/placeholder.svg"}
                      alt={client.name}
                    />
                    <AvatarFallback>
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {client.name}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-zinc-400 truncate">
                      <Mail className="h-3 w-3 mr-1" />
                      {client.email || "No email provided"}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-zinc-400 truncate">
                      <Phone className="h-3 w-3 mr-1" />
                      {client.phoneNumber || "No contact info"}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckSquare className="h-5 w-5 mr-2" />
                Recent Tasks
              </CardTitle>
              <CardDescription>Latest task updates and assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {details?.recentTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2  dark:text-zinc-50">{task.title}</h4>
                    {getApprovalBadge(task.taskStatus)}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2  dark:text-zinc-50">{task.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center ">
                      <Calendar className="h-3 w-3 mr-2  dark:text-zinc-50" />
                      <span className="mt-1 mx-1  dark:text-zinc-50">
                        {formatDate(task.deadline) || "No due date set"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Recent Service Providers
              </CardTitle>
              <CardDescription>Newly onboarded service providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {details?.recentServiceProviders.map((provider) => (
                <div
                  className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-zinc-900"
                  key={provider.id}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={provider.profilePicture || "/placeholder.svg"}
                      alt={provider.name}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {provider.name}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500 dark:text-zinc-400">
                        <Phone className="h-3 w-3 mr-2" />
                        {provider.phoneNumber || "No contact info"}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-zinc-400">
                        <Mail className="h-3 w-3 mr-2" />
                        {provider.email || "No email provided"}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 dark:text-zinc-400">
                        <Clock className="h-3 w-3 mr-2" />
                        Onboarded: {formatDate(provider.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
