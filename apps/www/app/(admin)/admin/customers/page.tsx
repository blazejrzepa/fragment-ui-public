"use client";

import * as React from "react";
import { 
  DataTable,
  DataTableColumn,
  Pagination,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
  Button,
} from "@fragment_ui/ui";
import { Download, Plus } from "lucide-react";

type CustomerStatus = "active" | "inactive" | "pending";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  status: CustomerStatus;
};

const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Nancy", "Daniel", "Lisa",
  "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
  "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
  "Timothy", "Deborah", "Ronald", "Stephanie", "Jason", "Rebecca", "Edward", "Sharon",
  "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
  "Nicholas", "Angela", "Eric", "Shirley", "Jonathan", "Anna", "Stephen", "Brenda",
  "Larry", "Pamela", "Justin", "Emma", "Scott", "Nicole", "Brandon", "Helen",
  "Benjamin", "Samantha", "Samuel", "Katherine", "Gregory", "Christine", "Alexander", "Debra",
  "Patrick", "Rachel", "Frank", "Carolyn", "Raymond", "Janet", "Jack", "Virginia",
  "Dennis", "Maria", "Jerry", "Heather", "Tyler", "Diane", "Aaron", "Julie",
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor",
  "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Sanchez",
  "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
  "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams",
  "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
  "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards",
  "Collins", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez",
  "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed", "Kelly", "Howard",
  "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks", "Chavez",
  "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes", "Price",
  "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster",
];

const ROLES = [
  "Admin", "Manager", "Developer", "Designer", "Sales", "Marketing", "Support", "Analyst",
  "Consultant", "Director", "Engineer", "Specialist", "Coordinator", "Assistant", "Executive", "Lead",
];

const STATUSES: CustomerStatus[] = ["active", "inactive", "pending"];

function generateCustomers(): Customer[] {
  const customers: Customer[] = [];
  let nameIndex = 0;
  let lastNameIndex = 0;
  let roleIndex = 0;
  let statusIndex = 0;
  let phoneArea = 200;
  let phoneMiddle = 100;
  let phoneLast = 1000;
  
  for (let i = 1; i <= 100; i++) {
    const firstName = FIRST_NAMES[nameIndex % FIRST_NAMES.length];
    const lastName = LAST_NAMES[lastNameIndex % LAST_NAMES.length];
    const role = ROLES[roleIndex % ROLES.length];
    const status = STATUSES[statusIndex % STATUSES.length];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const phone = `+1 (${phoneArea}) ${phoneMiddle}-${phoneLast}`;
    
    customers.push({
      id: String(i),
      firstName,
      lastName,
      role,
      email,
      phone,
      status,
    });
    
    nameIndex++;
    if (i % 2 === 0) lastNameIndex++;
    if (i % 3 === 0) roleIndex++;
    if (i % 4 === 0) statusIndex++;
    
    phoneLast++;
    if (phoneLast > 9999) {
      phoneLast = 1000;
      phoneMiddle++;
      if (phoneMiddle > 999) {
        phoneMiddle = 100;
        phoneArea++;
        if (phoneArea > 999) phoneArea = 200;
      }
    }
  }

  return customers;
}

const sampleCustomers = generateCustomers();

export default function CustomersPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(15);
  
  const totalPages = Math.ceil(sampleCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = sampleCustomers.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const customerColumns: DataTableColumn<Customer>[] = [
    { id: "firstName", header: "First Name", accessor: (row) => row.firstName, sortable: true },
    { id: "lastName", header: "Last Name", accessor: (row) => row.lastName, sortable: true },
    { id: "role", header: "Role", accessor: (row) => row.role, sortable: true },
    { id: "email", header: "Email", accessor: (row) => row.email, sortable: true },
    { id: "phone", header: "Phone Number", accessor: (row) => row.phone, sortable: true },
    {
      id: "status",
      header: "Status",
      accessor: (row) => (
        <Badge 
          variant={
            row.status === "active"
              ? "solid"
              : row.status === "pending"
              ? "subtle"
              : "outline"
          }
        >
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6 px-2 sm:px-3">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-medium">Customers</h1>
          <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">Manage your customer base</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leadingIcon={<Download className="h-4 w-4" />}>
              Export
            </Button>
            <Button variant="solid" size="sm" leadingIcon={<Plus className="h-4 w-4" />}>
              Add Customer
            </Button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="w-full space-y-4">
        <DataTable data={paginatedCustomers} columns={customerColumns} selectable />
          
          {/* Pagination and Rows per page */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[color:var(--color-fg-muted)]">Rows per page:</span>
              <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              showFirstLast
                maxVisible={5}
              />
            </div>
          </div>
        </div>
      </div>
  );
}

