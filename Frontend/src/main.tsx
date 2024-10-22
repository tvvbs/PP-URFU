import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router-dom";
import AuthProvider from "./auth/AuthProvider.tsx";
import {router} from "./routes.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "react-hot-toast";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
          <QueryClientProvider client={queryClient}>
              <Toaster toastOptions={{duration: 2000}}/>
              <RouterProvider router={router}/>
          </QueryClientProvider>
      </AuthProvider>
  </StrictMode>,
)
