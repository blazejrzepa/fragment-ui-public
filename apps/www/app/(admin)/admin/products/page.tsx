"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fragment_ui/ui";
import { Badge } from "@fragment_ui/ui";
import { Button } from "@fragment_ui/ui";
import { Input } from "@fragment_ui/ui";
import { Search, Plus, Download, MoreVertical, Edit, Trash2 } from "lucide-react";

type ProductStatus = "in_stock" | "out_of_stock";

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: ProductStatus;
  icon: string;
};

const products: Product[] = [
  { 
    id: "1", 
    name: "Wireless Headphones", 
    category: "Electronics",
    price: "$99.99",
    stock: 45,
    status: "in_stock",
    icon: "WH",
  },
  { 
    id: "2", 
    name: "Smart Watch", 
    category: "Electronics",
    price: "$299.99",
    stock: 12,
    status: "in_stock",
    icon: "SW",
  },
  { 
    id: "3", 
    name: "Running Shoes", 
    category: "Footwear",
    price: "$129.99",
    stock: 0,
    status: "out_of_stock",
    icon: "RS",
  },
  { 
    id: "4", 
    name: "Laptop Backpack", 
    category: "Accessories",
    price: "$79.99",
    stock: 23,
    status: "in_stock",
    icon: "LB",
  },
  { 
    id: "5", 
    name: "USB-C Cable", 
    category: "Accessories",
    price: "$19.99",
    stock: 156,
    status: "in_stock",
    icon: "UC",
  },
];

const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

export default function ProductsPage() {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const filteredProducts = React.useMemo(() => {
    let filtered = products;
    
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    
    return filtered;
  }, [search, selectedCategory]);

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-medium">Products</h1>
          <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
              Manage your product inventory
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leadingIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
            <Button variant="solid" size="sm" leadingIcon={<Plus className="h-4 w-4" />}>
              Add Product
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-80">
                <Input
            leadingIcon={<Search className="h-4 w-4" />}
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
        <div className="flex flex-wrap items-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "solid" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

        {/* Products Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
            <CardHeader className="w-full">
                <div className="flex items-start justify-between">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--color-surface-2)] text-xs font-semibold">
                  {product.icon}
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Product actions">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{product.price}</span>
                  <Badge variant={product.status === "in_stock" ? "solid" : "outline"}>
                      {product.status === "in_stock" ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <div className="text-sm text-[color:var(--color-fg-muted)]">
                    Stock: {product.stock} units
                  </div>
                  <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 whitespace-nowrap justify-center sm:justify-start"
                    leadingIcon={<Edit className="h-4 w-4 shrink-0" />}
                  >
                      Edit
                    </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 whitespace-nowrap justify-center sm:justify-start"
                    leadingIcon={<Trash2 className="h-4 w-4 shrink-0" />}
                  >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="pt-6">
            <div className="py-12 text-center">
                <p className="text-[color:var(--color-fg-muted)]">
                  No products found matching your criteria.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
  );
}

