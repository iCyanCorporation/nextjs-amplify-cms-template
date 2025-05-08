"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useProductContext } from "@/app/contexts/ProductContext";
import Image from "next/image";
import { getAuthToken } from "@/hooks/useAmplifyClient";

export default function ProductsPage() {
  const { getProductTypeName } = useProductContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [deleteModal, setDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/products/${productToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `${await getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((p) => p.id !== productToDelete));
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (product) => filterType === "all" || product.productType === filterType
    );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const productTypes = [
    "all",
    ...Array.from(new Set(products.map((p) => p.productType))),
  ];

  const urlCheck = (url: string | undefined) => {
    if (!url) return false;
    const urlPattern = new RegExp(/^(http|https):\/\/[^ "]+$/);
    return urlPattern.test(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="flex items-center gap-1"
          >
            <RefreshCwIcon
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Link href="/admin/shop/new">
            <Button className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-1 items-center">
                  <FilterIcon className="h-4 w-4" />
                  Filter: {filterType === "all" ? "All Types" : filterType}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {productTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => type && setFilterType(type)}
                  >
                    {type === "all" ? "All Types" : type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NAME</TableHead>
                    <TableHead>TYPE</TableHead>
                    {/* <TableHead>PRICE</TableHead> */}
                    {/* <TableHead>STOCK</TableHead> */}
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product: Product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Image
                            src={
                              product.thumbnailImageUrl &&
                              urlCheck(product.thumbnailImageUrl)
                                ? product.thumbnailImageUrl
                                : "/images/noimage.jpg"
                            }
                            alt={"Product Thumbnail"}
                            width={50}
                            height={50}
                            className="aspect-square rounded object-cover mr-3"
                            quality={100}
                            onError={(e) => {
                              // Fallback to no image if the URL fails to load
                              (e.target as HTMLImageElement).src =
                                "/images/noimage.jpg";
                            }}
                          />

                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              {product.description.substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.productTypeId ? (
                          <span>
                            {getProductTypeName(product.productTypeId)}
                          </span>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/admin/shop/edit/${product.id}`}>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteClick(product.id || "")}
                          >
                            Delete
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
              <p className="text-lg">No products found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filter
              </p>
            </div>
          )}

          {filteredProducts.length > rowsPerPage && (
            <div className="flex justify-center mt-4 gap-1">
              {Array.from({
                length: Math.ceil(filteredProducts.length / rowsPerPage),
              }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
