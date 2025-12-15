// This layout is a pass-through for admin routes
// The ConditionalLayout in the root layout will handle hiding navigation
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

