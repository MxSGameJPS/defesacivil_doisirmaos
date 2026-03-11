import "./globals.css";

export const metadata = {
  title: "SISPDEC - Defesa Civil Dois Irmãos",
  description: "Sistema de Gestão da Defesa Civil de Dois Irmãos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
