"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  FormField,
  Separator,
  Badge,
} from "@fragment_ui/ui";
import { Textarea } from "@fragment_ui/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@fragment_ui/ui";
import { Plus, Receipt, Download, Printer, Share } from "lucide-react";

type LineItem = {
  id: string;
  description: string;
  qty: number;
  price: number;
};

const defaultItems: LineItem[] = [
  { id: "1", description: "Design system review", qty: 4, price: 120 },
  { id: "2", description: "Dashboard build-out", qty: 8, price: 180 },
];

export default function InvoicePage() {
  const [items, setItems] = React.useState<LineItem[]>(defaultItems);
  const [notes, setNotes] = React.useState("Thank you for your business.");

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const updateItem = (id: string, field: keyof LineItem, value: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "description" ? value : Math.max(0, Number(value) || 0),
            }
          : item
      )
    );
  };

  const addItem = () => {
    const nextId = String(items.length + 1);
    setItems((prev) => [...prev, { id: nextId, description: "", qty: 1, price: 0 }]);
  };

  return (
    <div className="space-y-6 px-2 sm:px-3">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium">Invoice</h1>
          <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
            Create and share invoices for your clients.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leadingIcon={<Printer className="h-4 w-4" />}>
            Print
          </Button>
          <Button variant="outline" leadingIcon={<Share className="h-4 w-4" />}>
            Share
          </Button>
          <Button leadingIcon={<Download className="h-4 w-4" />}>Export PDF</Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>From</CardTitle>
                <CardDescription>Your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField label="Business name">
                  <Input defaultValue="Fragment Inc." />
                </FormField>
                <FormField label="Email">
                  <Input type="email" defaultValue="billing@fragment.inc" />
                </FormField>
                <FormField label="Address">
                  <Textarea defaultValue="123 Market Street&#10;San Francisco, CA 94103" rows={3} />
                </FormField>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bill to</CardTitle>
                <CardDescription>Client information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField label="Client name">
                  <Input defaultValue="Acme Corp" />
                </FormField>
                <FormField label="Client email">
                  <Input type="email" defaultValue="finance@acme.com" />
                </FormField>
                <FormField label="Client address">
                  <Textarea defaultValue="456 Broadway Ave&#10;New York, NY 10012" rows={3} />
                </FormField>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Line items</CardTitle>
                <CardDescription>Add products or services</CardDescription>
              </div>
              <Button size="sm" variant="outline" leadingIcon={<Plus className="h-4 w-4" />} onClick={addItem}>
                Add item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid gap-3 md:grid-cols-[2fr,1fr,1fr] items-center">
                  <FormField label="Description">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      placeholder="Service description"
                    />
                  </FormField>
                  <FormField label="Qty">
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                      min={0}
                    />
                  </FormField>
                  <FormField label="Price">
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", e.target.value)}
                      min={0}
                    />
                  </FormField>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Shown on the invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add terms, payment instructions, or notes"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Invoice #INV-2025-001</CardTitle>
                <CardDescription>Draft preview</CardDescription>
              </div>
              <Badge variant="subtle">Draft</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-[color:var(--color-fg-muted)]">From</p>
                  <p className="text-sm font-medium">Fragment Inc.</p>
                  <p className="text-sm text-[color:var(--color-fg-muted)]">billing@fragment.inc</p>
                </div>
                <div>
                  <p className="text-xs text-[color:var(--color-fg-muted)]">Bill to</p>
                  <p className="text-sm font-medium">Acme Corp</p>
                  <p className="text-sm text-[color:var(--color-fg-muted)]">finance@acme.com</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-4 items-center text-sm">
                    <span className="col-span-2">{item.description || "—"}</span>
                    <span className="text-right text-[color:var(--color-fg-muted)]">x{item.qty}</span>
                    <span className="text-right">${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--color-fg-muted)]">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--color-fg-muted)]">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-[color:var(--color-fg-base)]">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-medium text-[color:var(--color-fg-base)]">Notes</p>
                <p className="text-sm text-[color:var(--color-fg-muted)]">{notes || "—"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
