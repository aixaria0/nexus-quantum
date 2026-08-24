'use client';
import React from 'react';
import './globals.css';
import { QuantumProvider } from './context/QuantumContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Nexus Quantum | Zero-Noise Error Mitigation</title>
        <meta name="description" content="Revolutionary quantum error mitigation with formal verification" />
      </head>
      <body className="bg-quantum-dark text-white">
        <QuantumProvider>
          {children}
        </QuantumProvider>
      </body>
    </html>
  );
}