// app/components/ClientWrapper.tsx
"use client";

import { useState, useEffect } from "react";

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Avoid hydration issues by not rendering until client-side
  }

  return <>{children}</>;
};

export default ClientWrapper;
