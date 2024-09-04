import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: Infinity },
    mutations: { retry: false }
  }
});

ReactDOM.createRoot(document.getElementById("root") as Element).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
