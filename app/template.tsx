export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Hanya opacity: transform di sini akan merusak posisi navbar yang fixed
  return <div className="flex flex-1 flex-col motion-safe:animate-page-fade">{children}</div>;
}
