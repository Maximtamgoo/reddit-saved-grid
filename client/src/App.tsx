import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import { useGetSignedInUser } from "./services/queries";

export default function App() {
  const { isPending, isError } = useGetSignedInUser();

  if (isPending) return null;
  if (isError) return <LoginPage />;

  return (
    <main className="m-auto max-w-screen-2xl pl-3 pr-3.5">
      <Header />
      <MainPage />
    </main>
  );
}
