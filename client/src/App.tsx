import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import { useGetSignedInUser } from "./services/queries";

export default function App() {
  const { isSuccess, isPending } = useGetSignedInUser();
  if (isPending) return null;
  return isSuccess ? <MainPage /> : <LoginPage />;
}
