import { useGetSignedInUser } from "./services/queries";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";

export default function App() {
  const { isPending, isError } = useGetSignedInUser();
  if (isError) return <LoginPage />;
  if (isPending) return null;
  return (
    <>
      <Header />
      <MainPage />
    </>
  );
}
