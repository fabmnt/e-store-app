import { ThemeProvider } from '@/providers/theme-provider';

export default function PublicStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background [font-family:var(--font-mona-sans)]">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        enableSystem
        forcedTheme="light"
      >
        {children}
      </ThemeProvider>
    </div>
  );
}
