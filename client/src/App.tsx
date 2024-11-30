import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import { useGetSignedInUser } from "./services/queries";

export default function App() {
  const { isPending, isError } = useGetSignedInUser();

  if (isPending) return null;
  if (isError) return <LoginPage />;

  return (
    <>
      <Header />
      <MainPage />
    </>
  );
}
