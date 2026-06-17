export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full overflow-y-auto bg-background px-4 py-4 text-text-primary sm:px-6 sm:py-6">
      <div className="">{children}</div>
    </div>
  );
}
