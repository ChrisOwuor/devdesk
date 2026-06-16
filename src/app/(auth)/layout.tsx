export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex w-full items-center justify-center px-6">
      <div className="">{children}</div>
    </div>
  );
}
