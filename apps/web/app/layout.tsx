import "./globals.css";
import { AuditProvider } from "./store/AuditContext";
import { AgentsProvider } from "./store/AgentsContext";

export const metadata = {
  title: "EaseChequ Admin",
  description: "Administration panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuditProvider>
          <AgentsProvider>
            {children}
          </AgentsProvider>
        </AuditProvider>
      </body>
    </html>
  );
}