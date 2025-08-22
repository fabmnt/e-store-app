export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>sidebar</aside>
      {children}
    </div>
  );
}
