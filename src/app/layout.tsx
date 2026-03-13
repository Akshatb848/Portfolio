import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Akshat Banga | AI Engineer & ML Specialist',
  description:
    'Senior AI Engineer specializing in production-grade machine learning systems, generative AI, LLM pipelines, RAG architectures, and MLOps. Building AI systems that power the future.',
  keywords: [
    'AI Engineer',
    'Machine Learning',
    'Generative AI',
    'MLOps',
    'LangChain',
    'RAG',
    'Python',
    'PyTorch',
    'TensorFlow',
    'AWS',
    'GCP',
    'Akshat Banga',
  ],
  authors: [{ name: 'Akshat Banga' }],
  creator: 'Akshat Banga',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://akshatbanga.dev',
    title: 'Akshat Banga | AI Engineer & ML Specialist',
    description:
      'Building production-grade AI systems powered by machine learning, generative AI, and scalable cloud infrastructure.',
    siteName: 'Akshat Banga Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akshat Banga | AI Engineer',
    description:
      'Building production-grade AI systems powered by machine learning, generative AI, and scalable cloud infrastructure.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
