"use client";

import React, { useState, useEffect } from "react";
import { SearchIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Mock order data
const mockOrders: Order[] = [
  {
    id: "ord-1001",
    customer: "John Doe",
    email: "john@example.com",
    date: "2023-07-15",
    total: 124.99,
    status: "Completed",
    items: 3,
  },
  {
    id: "ord-1002",
    customer: "Jane Smith",
    email: "jane@example.com",
    date: "2023-07-14",
    total: 89.95,
    status: "Processing",
    items: 2,
  },
  {
    id: "ord-1003",
    customer: "Robert Johnson",
    email: "robert@example.com",
    date: "2023-07-13",
    total: 249.99,
    status: "Shipped",
    items: 1,
  },
  {
    id: "ord-1004",
    customer: "Emily Williams",
    email: "emily@example.com",
    date: "2023-07-12",
    total: 75.5,
    status: "Pending",
    items: 4,
  },
  {
    id: "ord-1005",
    customer: "Michael Brown",
    email: "michael@example.com",
    date: "2023-07-11",
    total: 199.99,
    status: "Canceled",
    items: 1,
  },
];

type OrderStatus =
  | "Completed"
  | "Processing"
  | "Shipped"
  | "Pending"
  | "Canceled";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
}

const statusVariantMap: Record<
  OrderStatus,
  "default" | "success" | "warning" | "secondary" | "destructive"
> = {
  Completed: "success",
  Processing: "default",
  Shipped: "warning",
  Pending: "secondary",
  Canceled: "destructive",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 800);
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      (order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || order.status === statusFilter)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-1 items-center">
                  <Filter className="h-4 w-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Processing")}>
                  Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Shipped")}>
                  Shipped
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Canceled")}>
                  Canceled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ORDER</TableHead>
                    <TableHead>CUSTOMER</TableHead>
                    <TableHead>DATE</TableHead>
                    <TableHead>TOTAL</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items} {order.items === 1 ? "item" : "items"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{order.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-lg">No orders found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
