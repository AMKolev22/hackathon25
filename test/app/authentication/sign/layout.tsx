import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Warp | Sign In',
  icons: {
    icon: "/favicon-32x32.png",
  },
};

 
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
    <html lang="en" style={{fontSize: "62.5%"}}>
        <body>{children}</body>
    </html>
  )
}