"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@fragment_ui/ui";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Avatar,
} from "@fragment_ui/ui";
import { Download, Plus, Calendar, Search } from "lucide-react";

type EmployeeStatusVariant = "success" | "warning" | "outline" | "subtle";

type Employee = {
  id: string;
  name: string;
  email: string;
  dept: string;
  title: string;
  joined: string;
  status: string;
  statusVariant: EmployeeStatusVariant;
};

const KPI_CARDS = [
  { label: "Total Employees", value: 50 },
  { label: "Active Employees", value: 31 },
  { label: "Inactive Employees", value: 6 },
  { label: "Departments", value: 5 },
];

const HIRES_EXITS = [
  { month: "Jan", hires: 18, exits: 6 },
  { month: "Feb", hires: 26, exits: 12 },
  { month: "Mar", hires: 30, exits: 14 },
  { month: "Apr", hires: 34, exits: 10 },
  { month: "May", hires: 22, exits: 9 },
  { month: "Jun", hires: 25, exits: 8 },
  { month: "Jul", hires: 21, exits: 7 },
  { month: "Aug", hires: 28, exits: 11 },
  { month: "Sep", hires: 24, exits: 9 },
  { month: "Oct", hires: 33, exits: 13 },
  { month: "Nov", hires: 20, exits: 10 },
  { month: "Dec", hires: 27, exits: 9 },
];

const EMPLOYEES: Employee[] = [
  {
    id: "EMP-1001",
    name: "John Doe",
    email: "john.doe@email.com",
    dept: "IT",
    title: "Software Engineer",
    joined: "01 Jan 2025",
    status: "Active",
    statusVariant: "success",
  },
  {
    id: "EMP-1002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    dept: "HR",
    title: "HR Manager",
    joined: "12 Feb 2025",
    status: "On Leave",
    statusVariant: "warning",
  },
  {
    id: "EMP-1003",
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    dept: "Engineering",
    title: "UX Designer",
    joined: "12 Feb 2025",
    status: "Pending",
    statusVariant: "subtle",
  },
  {
    id: "EMP-1004",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    dept: "Marketing",
    title: "Marketing Lead",
    joined: "12 Feb 2025",
    status: "Pending",
    statusVariant: "subtle",
  },
  {
    id: "EMP-1005",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    dept: "Sales",
    title: "Sales Executive",
    joined: "20 Feb 2025",
    status: "Active",
    statusVariant: "success",
  },
  {
    id: "EMP-1006",
    name: "Sarah Wilson",
    email: "sarah.w@email.com",
    dept: "IT",
    title: "DevOps Engineer",
    joined: "20 Feb 2025",
    status: "Inactive",
    statusVariant: "outline",
  },
  {
    id: "EMP-1007",
    name: "Daniel Lee",
    email: "daniel.l@email.com",
    dept: "HR",
    title: "HR Manager",
    joined: "01 Mar 2025",
    status: "Inactive",
    statusVariant: "outline",
  },
  {
    id: "EMP-1008",
    name: "Olivia Clark",
    email: "olivia.c@email.com",
    dept: "Engineering",
    title: "Software Engineer",
    joined: "01 Mar 2025",
    status: "Active",
    statusVariant: "success",
  },
];

const STATUS_VARIANT_MAP: Record<EmployeeStatusVariant, "solid" | "outline" | "subtle"> = {
  success: "solid",
  warning: "subtle",
  outline: "outline",
  subtle: "subtle",
};

export default function EmployeesPage() {
  return (
    <div className="space-y-6 px-2 sm:px-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium">Employees</h1>
          <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
              Headcount overview, hiring trends, and roster.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leadingIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
            <Button variant="solid" size="sm" leadingIcon={<Plus className="h-4 w-4" />}>
              New Employee
            </Button>
          </div>
        </div>

        {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {KPI_CARDS.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader>
                <CardTitle className="text-sm text-[color:var(--color-fg-muted)]">{kpi.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{kpi.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters + Table */}
      <Card className="w-full">
          <CardHeader>
            <CardTitle>Employee Roster</CardTitle>
          </CardHeader>
        <CardContent className="space-y-4 w-full">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2 max-w-[220px]">
                <Input leadingIcon={<Search className="h-4 w-4" />} placeholder="Search employees..." />
              </div>
            <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" leadingIcon={<Calendar className="h-4 w-4" />}>
                  Joined Date
                </Button>
                <Select defaultValue="all">
                <SelectTrigger className="h-9 w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="leave">On Leave</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              <Button variant="outline" size="sm" className="ml-auto">
                  Import
                </Button>
              </div>
            </div>

          <div className="overflow-auto w-full">
            <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {EMPLOYEES.map((emp) => (
                    <TableRow key={emp.id}>
                    <TableCell className="font-mono text-xs text-[color:var(--color-fg-muted)]">
                      {emp.id}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Avatar fallback={emp.name.split(" ").map((n) => n[0]).join("")} className="h-8 w-8" />
                      <div className="text-sm">{emp.name}</div>
                    </TableCell>
                      <TableCell className="text-sm text-[color:var(--color-fg-muted)]">{emp.email}</TableCell>
                      <TableCell className="text-sm">
                        <Badge variant="subtle">{emp.dept}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{emp.title}</TableCell>
                      <TableCell className="text-sm text-[color:var(--color-fg-muted)]">{emp.joined}</TableCell>
                      <TableCell>
                      <Badge variant={STATUS_VARIANT_MAP[emp.statusVariant] || "subtle"}>
                        {emp.status}
                      </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
