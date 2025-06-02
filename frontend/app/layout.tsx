// app/layout.tsx
import '../src/styles/globals.css'

export const metadata = {
  title: 'HRIS',
  description: 'Your HR system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts: Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;600;700;900&display=swap"
          rel="stylesheet"
        />

        {/* FontAwesome: agar <i className="fas fa-..."> berfungsi */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-p+1f9E2zIJ/Crb+6rKq2u4O10K4qLhxx0jmBjQrsOnLuXz2MHT7p+brI8b5k7XZ/N+Pq4ZVx0hj6Y5V1hvR1Bw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="font-inter antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
