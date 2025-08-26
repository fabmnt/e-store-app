export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl 2xl:max-w-7xl">
      {children}
    </div>
  );
}
