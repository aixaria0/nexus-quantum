'use client';
import React from 'react';
import './globals.css';
import { AgentVQEProvider } from './context/AgentVQEContext';

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
        <title>Nexus Quantum | Agent-Driven VQE with Formal Verification</title>
        <meta name="description" content="AI-powered quantum optimization with hard-stop constraint enforcement" />
      </head>
      <body className="bg-quantum-dark text-white">
        <AgentVQEProvider>
          {children}
        </AgentVQEProvider>
      </body>
    </html>
  );
}