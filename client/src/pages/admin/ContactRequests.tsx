import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatRelativeTime } from "@/lib/utils/format";
import { 
  MoreHorizontal, 
  AlertTriangle, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Archive, 
  MailOpen, 
  Mail, 
  Search, 
  FileDown, 
  Phone, 
  User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ContactRequestStatus = "new" | "processing" | "completed" | "archived";

export default function ContactRequests() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContactRequest, setSelectedContactRequest] = useState<any | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState<ContactRequestStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  // Fetch contact requests
  const { data: contactRequests, isLoading } = useQuery({
    queryKey: ["/api/admin/contact-requests"],
  });
  
  // Update contact request status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ContactRequestStatus }) => {
      const response = await apiRequest("PUT", `/api/admin/contact-requests/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-requests"] });
      toast({
        title: "Status updated",
        description: "Contact request status has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete contact request mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/admin/contact-requests/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-requests"] });
      setOpenDeleteDialog(false);
      setSelectedContactRequest(null);
      toast({
        title: "Contact request deleted",
        description: "Contact request has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete contact request",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleViewDetails = (contactRequest: any) => {
    setSelectedContactRequest(contactRequest);
    setOpenDialog(true);
  };
  
  const handleUpdateStatus = (id: number, status: ContactRequestStatus) => {
    updateStatusMutation.mutate({ id, status });
  };
  
  const handleDelete = (contactRequest: any) => {
    setSelectedContactRequest(contactRequest);
    setOpenDeleteDialog(true);
  };
  
  // Filter contact requests by search query and tab
  const filteredContactRequests = contactRequests?.filter((request: any) => {
    // Filter by tab
    if (currentTab !== "all" && request.status !== currentTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const searchTerms = searchQuery.toLowerCase();
      return (
        request.name.toLowerCase().includes(searchTerms) ||
        request.email.toLowerCase().includes(searchTerms) ||
        request.phone.toLowerCase().includes(searchTerms) ||
        (request.message && request.message.toLowerCase().includes(searchTerms))
      );
    }
    
    return true;
  }) || [];
  
  // Sort contact requests
  const sortedContactRequests = [...filteredContactRequests].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
  
  // Generate CSV data
  const exportToCSV = () => {
    if (!contactRequests || contactRequests.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no contact requests to export.",
        variant: "destructive",
      });
      return;
    }
    
    // Create CSV headers
    const headers = ["ID", "Name", "Email", "Phone", "Message", "Call Back", "Status", "Created At"];
    
    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...contactRequests.map((request: any) => [
        request.id,
        `"${request.name.replace(/"/g, '""')}"`, // Escape quotes in name
        `"${request.email.replace(/"/g, '""')}"`, // Escape quotes in email
        `"${request.phone.replace(/"/g, '""')}"`, // Escape quotes in phone
        `"${(request.message || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`, // Escape quotes and newlines in message
        request.requestCallBack ? "Yes" : "No",
        request.status,
        new Date(request.createdAt).toISOString()
      ].join(","))
    ].join("\n");
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `contact-requests-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default" className="bg-blue-500">New</Badge>;
      case "processing":
        return <Badge variant="secondary" className="bg-amber-500">Processing</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <MailOpen className="h-4 w-4 text-blue-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "archived":
        return <Archive className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };
  
  const renderContactCards = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-white dark:bg-card rounded-lg shadow-md overflow-hidden">
          <div className="p-5 space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between mt-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ));
    }
    
    if (sortedContactRequests.length === 0) {
      return (
        <div className="text-center py-10 col-span-full">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">No contact requests found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery.trim() !== "" 
              ? "No contact requests match your search query." 
              : currentTab !== "all"
                ? `No ${currentTab} contact requests found.`
                : "You haven't received any contact requests yet."}
          </p>
          
          {searchQuery.trim() !== "" && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          )}
        </div>
      );
    }
    
    return sortedContactRequests.map((request: any) => (
      <Card key={request.id} className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{request.name}</h3>
              {getStatusBadge(request.status)}
            </div>
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                {request.email}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                {request.phone}
              </div>
            </div>
            {request.requestCallBack && (
              <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                Requested Call Back
              </Badge>
            )}
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatRelativeTime(new Date(request.createdAt))}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewDetails(request)}
              >
                View Details
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {request.status !== "new" && (
                    <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, "new")}>
                      <MailOpen className="h-4 w-4 mr-2" />
                      Mark as New
                    </DropdownMenuItem>
                  )}
                  {request.status !== "processing" && (
                    <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, "processing")}>
                      <Clock className="h-4 w-4 mr-2" />
                      Mark as Processing
                    </DropdownMenuItem>
                  )}
                  {request.status !== "completed" && (
                    <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, "completed")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </DropdownMenuItem>
                  )}
                  {request.status !== "archived" && (
                    <DropdownMenuItem onClick={() => handleUpdateStatus(request.id, "archived")}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDelete(request)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };
  
  // Count contact requests by status
  const countByStatus = {
    all: contactRequests?.length || 0,
    new: contactRequests?.filter((r: any) => r.status === "new").length || 0,
    processing: contactRequests?.filter((r: any) => r.status === "processing").length || 0,
    completed: contactRequests?.filter((r: any) => r.status === "completed").length || 0,
    archived: contactRequests?.filter((r: any) => r.status === "archived").length || 0,
  };
  
  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Contact Requests</h1>
          
          <Button variant="outline" onClick={exportToCSV} disabled={!contactRequests || contactRequests.length === 0}>
            <FileDown className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name, email, phone or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="relative">
              All
              <Badge variant="secondary" className="ml-1 text-xs">
                {countByStatus.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="new" className="relative">
              New
              <Badge variant="secondary" className="ml-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {countByStatus.new}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="processing" className="relative">
              Processing
              <Badge variant="secondary" className="ml-1 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                {countByStatus.processing}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              Completed
              <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {countByStatus.completed}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="archived" className="relative">
              Archived
              <Badge variant="secondary" className="ml-1 text-xs">
                {countByStatus.archived}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderContactCards()}
        </div>
      </div>
      
      {/* Contact Request Details Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          {selectedContactRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {selectedContactRequest.name}
                  {getStatusBadge(selectedContactRequest.status)}
                </DialogTitle>
                <DialogDescription>
                  Contact request received {formatRelativeTime(new Date(selectedContactRequest.createdAt))}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div>
                  <h4 className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Email Address</h4>
                  <p className="text-sm">{selectedContactRequest.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Phone Number</h4>
                  <p className="text-sm">{selectedContactRequest.phone}</p>
                </div>
              </div>
              
              {selectedContactRequest.requestCallBack && (
                <div className="bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 p-3 rounded-md mb-4 text-sm">
                  This contact has requested a call back.
                </div>
              )}
              
              {selectedContactRequest.message && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">Message</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm whitespace-pre-wrap">
                    {selectedContactRequest.message}
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Change status:</span>
                  <Select
                    value={selectedContactRequest.status}
                    onValueChange={(value) => handleUpdateStatus(selectedContactRequest.id, value as ContactRequestStatus)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new" className="flex items-center">
                        <MailOpen className="h-4 w-4 mr-2 text-blue-500" />
                        New
                      </SelectItem>
                      <SelectItem value="processing" className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-amber-500" />
                        Processing
                      </SelectItem>
                      <SelectItem value="completed" className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Completed
                      </SelectItem>
                      <SelectItem value="archived" className="flex items-center">
                        <Archive className="h-4 w-4 mr-2 text-gray-500" />
                        Archived
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setOpenDialog(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setOpenDialog(false);
                      handleDelete(selectedContactRequest);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Contact Request Confirmation Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contact request
              from {selectedContactRequest?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedContactRequest) {
                  deleteMutation.mutate(selectedContactRequest.id);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
