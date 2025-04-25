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

// Updated Order interface to match API structure
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress?: string;
  paymentInfo?: string;
  createdAt: string;
  updatedAt: string;
}

// Update status types to match database values
type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const statusVariantMap: Record<
  OrderStatus,
  "default" | "success" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  processing: "default",
  shipped: "outline", // Changed from "warning" to "outline" as "warning" is not a supported variant
  delivered: "success",
  cancelled: "destructive",
};

// Function to fetch orders from the API
const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch("/api/orders");
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())) &&
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
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("processing")}>
                  Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("shipped")}>
                  Shipped
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("delivered")}>
                  Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>
                  Cancelled
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
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {order.id.substring(0, 8)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customerEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariantMap[order.status]}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              (window.location.href = `/admin/orders/${order.id}`)
                            }
                          >
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
