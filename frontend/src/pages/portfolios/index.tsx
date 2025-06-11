"use client";
import type React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "@/redux/slices/loading";
import {
  RefreshCw,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  User,
  CalendarCheck,
  X,
  Calendar,
  CreditCardIcon as IdCardIcon,
  PhoneCallIcon,
  MailIcon,
  StarIcon,
  ZoomInIcon,
  AwardIcon,
  BriefcaseIcon,
  InfoIcon,
  UserIcon,
  ClockIcon,
} from "lucide-react";
import CustomDrawer from "@/components/drawer";
import { showErrorToast, showSuccessToast } from "@/components/toasts";
import type { DrawerProps } from "antd";
import GlobalModal from "@/components/modal";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlobalCarousel from "@/components/carousel";
const PortfolioPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [placement] = useState<DrawerProps["placement"]>("right");
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const loading = useSelector((state: any) => state.loading.isLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [dateOrder, setDateOrder] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carouselItems, setCarouselItems] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);
  const dispatch = useDispatch();
  const showDrawer = (task: any) => {
    setSelectedPortfolio(task);
    profileHandler(task.serviceProviderId);
    setOpen(true);
    if (task.images && task.images.length > 0) {
      setCarouselItems(task.images);
    }
  };

  const fuse = new Fuse(portfolios, {
    keys: ["serviceProviderName", "skills"],
    threshold: 0.3,
  });

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return dateObj.toLocaleDateString("en-US", options);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedPortfolio(null);
  };

  const getApprovalBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "modify":
        return <Badge style={{ backgroundColor: "#f59e0b" }}>Modify</Badge>;
      case "approved":
        return <Badge style={{ backgroundColor: "#22c55e" }}>Approved</Badge>;
      case "pending":
        return <Badge style={{ backgroundColor: "#ef4444" }}>Pending</Badge>;
    }
  };

  const portfolioHandler = async (
    filter = statusFilter,
    page = currentPage,
    limit = itemsPerPage,
    sort = sortOrder,
    order = dateOrder
  ) => {
    try {
      dispatch(startLoading());
      const queryParams = new URLSearchParams();
      if (filter !== "all") {
        queryParams.append("portfolioStatus", filter);
      }
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());
      queryParams.append("sortBy", sort);
      queryParams.append("time", order);
      console.log(queryParams.toString());
      const response = await axios.get(
        `http://localhost:5001/taskMate/admin/getPortfolios?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      if (response.data.status === 200) {
        setPortfolios(response.data.portfolios);
        setTotalPages(
          response.data.totalPages ||
            Math.ceil(response.data.totalCount / limit) ||
            1
        );
       
      }
    } catch (error) {
      showErrorToast("Error fetching tasks");
    } finally {
      dispatch(stopLoading());
    }
  };
  const profileHandler = async (id: string) => {
    try {
      dispatch(startLoading());

      const response = await axios.get(
        `http://localhost:5001/taskMate/admin/sp-profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      if (response.status === 200) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      showErrorToast("Error fetching profile");
    } finally {
      dispatch(stopLoading());
    }
  };
  const updateHandler = async (id: string, status: string) => {
    try {
      dispatch(startLoading());
      const response = await axios.put(
        `http://localhost:5001/taskMate/admin/updatePortfolio/${id}`,
        {
          portfolioStatus: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      if (response.status === 200) {
        onClose();
        showSuccessToast("Portfolio updated");
      }
      portfolioHandler(
        statusFilter,
        currentPage,
        itemsPerPage,
        sortOrder,
        dateOrder
      );
    } catch (error) {
      showErrorToast("Error updating portfolio");
    } finally {
      dispatch(stopLoading());
    }
  };
  useEffect(() => {
    portfolioHandler(
      statusFilter,
      currentPage,
      itemsPerPage,
      sortOrder,
      dateOrder
    );
  }, [currentPage, itemsPerPage, statusFilter, sortOrder, dateOrder]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (order: string) => {
    setSortOrder(order);
  };
  const handleDateOrderChange = (dateOrder: string) => {
    setDateOrder(dateOrder);
  };
  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
  };

  const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const statusFilters = [
    { label: "Modify", value: "modify" },
    { label: "Approved", value: "approved" },
    { label: "Pending", value: "pending" },
  ];
  const changeTaskStatus = [
    { label: "Modify", value: "modify" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
  ];
  const itemsPerPageOptions = [1, 3, 5];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "modify":
        return {
          bg: "rgba(245, 158, 11, 0.15)",
          text: "#92400e",
          border: "#f59e0b",
          indicator: "#f59e0b",
        };
      case "approved":
        return {
          bg: "rgba(34, 197, 94, 0.15)",
          text: "#166534",
          border: "#22c55e",
          indicator: "#22c55e",
        };
      case "pending":
        return {
          bg: "rgba(239, 68, 68, 0.15)",
          text: "#b91c1c",
          border: "#ef4444",
          indicator: "#ef4444",
        };
      default:
        return {
          bg: "white",
          text: "black",
          border: "#e5e7eb",
          indicator: "#9ca3af",
        };
    }
  };

  const getFilterButtonStyle = (isActive: boolean, colorKey = "") => {
    if (!isActive) return {};

    if (colorKey && colorKey in getStatusColor(colorKey)) {
      const colors = getStatusColor(colorKey);
      return {
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      };
    }

    return {
      // backgroundColor: "",
      // color: "#1e40af",
      borderColor: "#3b82f6",
    };
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold">Portfolio Management</h1>
        <div className="flex flex-wrap items-center justify-between mt-4 mb-6">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <input
              type="search"
              placeholder="Search portfolios"
              className="border text-md rounded-md p-1.5 w-full md:w-42"
              onChange={(e) => {
                const searchTerm = e.target.value;
                if (searchTerm) {
                  const results = fuse.search(searchTerm);
                  setPortfolios(results.map((result) => result.item));
                } else {
                  portfolioHandler();
                }
              }}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-wrap ml-2 gap-2 ">
            {/* Reset Filter Button */}
            <Button
              onClick={() => {
                setStatusFilter("");
                setSortOrder("");
                setDateOrder("");
                portfolioHandler("all", currentPage, itemsPerPage, "", "");
              }}
              variant="outline"
              style={getFilterButtonStyle(
                statusFilter !== "" || sortOrder !== "" || dateOrder !== ""
              )}
            >
              <X className="h-4 w-4 mr-2" />
              <span>Reset Filters</span>
            </Button>

            {/* Status Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  style={getFilterButtonStyle(
                    statusFilter !== "",
                    statusFilter
                  )}
                >
                  <Filter className="h-4 w-4" />
                  <span>
                    {statusFilter
                      ? statusFilters.find((s) => s.value === statusFilter)
                          ?.label || "Status"
                      : "Status"}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {statusFilters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.value}
                    onClick={() => handleStatusFilterChange(filter.value)}
                    className="cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getStatusColor(filter.value)
                            .indicator,
                        }}
                      ></div>
                      <span
                        className={
                          statusFilter === filter.value ? "font-bold" : ""
                        }
                      >
                        {filter.label}
                      </span>
                    </div>
                    {statusFilter === filter.value && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fare Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  style={getFilterButtonStyle(sortOrder !== "")}
                >
                  <StarIcon className="h-4 w-4" />
                  <span>
                    {sortOrder === "lowest"
                      ? " Lowest"
                      : sortOrder === "highest"
                      ? "Highest"
                      : "Rating"}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by Fare</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => handleSortOrderChange("lowest")}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span className={sortOrder === "lowest" ? "font-bold" : ""}>
                    Lowest
                  </span>
                  {sortOrder === "lowest" && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSortOrderChange("highest")}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span className={sortOrder === "highest" ? "font-bold" : ""}>
                    Highest
                  </span>
                  {sortOrder === "highest" && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleSortOrderChange("")}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span className={sortOrder === "" ? "font-bold" : ""}>
                    None
                  </span>
                  {sortOrder === "" && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  style={getFilterButtonStyle(dateOrder !== "")}
                >
                  <Calendar className="h-4 w-4" />
                  <span>
                    {dateOrder === "newest"
                      ? "Newest"
                      : dateOrder === "oldest"
                      ? "Oldest"
                      : "Date"}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by Date</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer flex items-center justify-between"
                  onClick={() => handleDateOrderChange("newest")}
                >
                  <span className={dateOrder === "newest" ? "font-bold" : ""}>
                    Newest
                  </span>
                  {dateOrder === "newest" && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer flex items-center justify-between"
                  onClick={() => handleDateOrderChange("oldest")}
                >
                  <span className={dateOrder === "oldest" ? "font-bold" : ""}>
                    Oldest
                  </span>
                  {dateOrder === "oldest" && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Items per page dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <span>Show: {itemsPerPage}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Items per page</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {itemsPerPageOptions.map((limit) => (
                  <DropdownMenuItem
                    key={limit}
                    className="cursor-pointer flex items-center justify-between"
                    onClick={() => handleItemsPerPageChange(limit)}
                  >
                    <span className={itemsPerPage === limit ? "font-bold" : ""}>
                      {limit}
                    </span>
                    {itemsPerPage === limit && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => {
                portfolioHandler(
                  statusFilter,
                  1,
                  itemsPerPage,
                  sortOrder,
                  dateOrder
                );
              }}
              variant="outline"
              className="flex items-center gap-2"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Portfolios List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="w-full h-12" />
                ))}
              </div>
            ) : portfolios.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>List of all available portfolios</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">
                        Service Provider
                      </TableHead>
                      <TableHead className="font-semibold">
                        Profession
                      </TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">
                        Expereince
                      </TableHead>
                      <TableHead className="hidden md:table-cell font-semibold">
                        Rating
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolios.map((portfolio) => (
                      <TableRow
                        key={portfolio._id}
                        onClick={() => showDrawer(portfolio)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedPortfolio?._id === portfolio._id
                            ? "bg-muted/50 border-0 font-semibold"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <TableCell>{portfolio.serviceProviderName}</TableCell>
                        <TableCell>{portfolio.skills}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {portfolio.workExperience}
                        </TableCell>
                        <TableCell className="hidden md:table-cell ">
                          {portfolio.averageRating || 0}
                        </TableCell>
                        <TableCell>
                          {getApprovalBadge(portfolio.portfolioStatus)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4}>Total Portfolios</TableCell>
                      <TableCell>{portfolios.length}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="flex items-center"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">
                        Previous
                      </span>
                    </Button>

                    <div className="hidden md:flex gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-9 h-9"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="flex items-center"
                    >
                      <span className="sr-only md:not-sr-only md:mr-2">
                        Next
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500">No portfolios available.</p>
                <Button
                  onClick={() => portfolioHandler()}
                  variant="outline"
                  className="mt-4"
                ></Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CustomDrawer
        title="Portfolio Details"
        placement={placement}
        open={open}
        onClose={onClose}
        width="39%"
        style={{ zIndex: 1000 }}
        className="overflow-y-auto dark:bg-zinc-900 dark:text-gray-100"
      >
        {selectedPortfolio ? (
          <div className="space-y-6 p-4">
            {/* Header with status */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Portfolio #{selectedPortfolio._id.substring(0, 6)}
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 font-medium transition-all"
                    style={{
                      backgroundColor: getStatusColor(
                        selectedPortfolio.portfolioStatus
                      ).bg,
                      color: getStatusColor(selectedPortfolio.portfolioStatus)
                        .text,
                      borderColor: getStatusColor(
                        selectedPortfolio.portfolioStatus
                      ).border,
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: getStatusColor(
                          selectedPortfolio.portfolioStatus
                        ).indicator,
                      }}
                    />
                    <span>
                      {selectedPortfolio.portfolioStatus === "modify"
                        ? "Modify"
                        : selectedPortfolio.portfolioStatus === "pending"
                        ? "Pending"
                        : selectedPortfolio.portfolioStatus === "approved"
                        ? "Approved"
                        : selectedPortfolio.portfolioStatus === "completed"
                        ? "Completed"
                        : selectedPortfolio.portfolioStatus}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48"
                  style={{ zIndex: 1100 }}
                  forceMount
                >
                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {changeTaskStatus.map((filter) => (
                    <DropdownMenuItem
                      key={filter.value}
                      className="cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
                      onClick={() =>
                        updateHandler(selectedPortfolio._id, filter.value)
                      }
                    >
                      <div className="flex items-center w-full">
                        <div
                          className="w-2.5 h-2.5 rounded-full mr-2"
                          style={{
                            backgroundColor: getStatusColor(filter.value)
                              .indicator,
                          }}
                        />
                        <span className="text-sm">{filter.label}</span>
                        {selectedPortfolio.portfolioStatus === filter.value && (
                          <Check className="h-4 w-4 ml-auto" />)}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700">
              <div className="flex items-center mb-3">
                <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                  Timeline
                </h3>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-2">
                  <CalendarCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block">
                    Submitted
                  </span>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {formatDate(selectedPortfolio.submittedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700">
              <div className="flex items-center mb-4">
                <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                  Client Information
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      Name
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {selectedPortfolio.serviceProviderName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                    <IdCardIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      CNIC
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {selectedPortfolio.cnicNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                    <MailIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      Email
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {profile?.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                    <PhoneCallIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      Phone
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {profile?.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Me */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700">
              <div className="flex items-center mb-3">
                <InfoIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                  About Me
                </h3>
              </div>
              <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                {selectedPortfolio.aboutMe}
              </p>
            </div>

            {/* Work Experience */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700">
              <div className="flex items-center mb-3">
                <BriefcaseIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                  Working Experience
                </h3>
              </div>
              <div className="flex items-center mt-2">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-3 mr-3">
                  <CalendarCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    Experience
                  </span>
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {selectedPortfolio.workExperience} Years
                  </span>
                </div>
              </div>
            </div>

            {/* CNIC Images */}
            {selectedPortfolio.cnicImages.length > 0 && (
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <IdCardIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                      CNIC
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  >
                    {selectedPortfolio.cnicImages.length} Images
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedPortfolio.cnicImages.map(
                    (img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(`http://localhost:5001${img}`);
                          setIsModalOpen(true);
                        }}
                        className="focus:outline-none group relative"
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <ZoomInIcon className="h-8 w-8 text-white" />
                        </div>
                        <img
                          src={`http://localhost:5001${img}`}
                          alt={`CNIC ${index + 1}`}
                          className="w-full h-36 object-cover rounded-lg shadow-sm transition-all duration-200 group-hover:shadow-md"
                        />
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Certification Images */}
            {selectedPortfolio.certImages.length > 0 && (
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <AwardIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                      Certifications
                    </h3>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  >
                    {selectedPortfolio.certImages.length} Images
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedPortfolio.certImages.map(
                    (img: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(`http://localhost:5001${img}`);
                          setIsModalOpen(true);
                        }}
                        className="focus:outline-none group relative"
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <ZoomInIcon className="h-8 w-8 text-white" />
                        </div>
                        <img
                          src={`http://localhost:5001${img}`}
                          alt={`Certification ${index + 1}`}
                          className="w-full h-36 object-cover rounded-lg shadow-sm transition-all duration-200 group-hover:shadow-md"
                        />
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Image Preview Modal */}
            <GlobalModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Image Preview"
              width={1000}
              height="600px"
              bodyStyle={{ backgroundColor: "black" }}
            >
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
                <GlobalCarousel
                  height="500px"
                  width="100%"
                  items={[
                    ...selectedPortfolio.cnicImages,
                    ...selectedPortfolio.certImages,
                  ].map((img) => (
                    <img
                      key={img}
                      src={`http://localhost:5001${img}`}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ))}
                />
              </div>
            </GlobalModal>
          </div>
        ) : (
          loading && (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-r-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 dark:text-gray-400">
                Loading task details...
              </p>
            </div>
          )
        )}
      </CustomDrawer>
    </div>
  );
};

export default PortfolioPage;
