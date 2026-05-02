'use client';

import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title = 'Yuvafashona - Luxury Fashion E-commerce',
  description = 'Discover luxury fashion at Yuvafashona. Shop premium perfumes, designer shoes, elegant heels, beauty products, and accessories in Kenya.',
  keywords = 'luxury fashion, perfumes, shoes, heels, beauty products, accessories, Kenya fashion, online shopping',
  image = '/og-image.jpg',
  url = 'https://yuvafashona.com'
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
      <link rel="icon" href="/favicon.ico" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Robots */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
}