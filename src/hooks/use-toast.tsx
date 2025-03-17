"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const ToastContext = createContext<any>(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<any>(null);

  const showToast = (options: { title: string; description: string; variant?: string }) => {
    setToast(options);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      {toast && (
        <div className={`toast ${toast.variant || "default"}`}>
          <strong>{toast.title}</strong>
          <p>{toast.description}</p>
        </div>
      )}
    </ToastContext.Provider>
  );
}
