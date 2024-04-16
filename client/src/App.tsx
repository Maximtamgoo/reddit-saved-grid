import { useGetSignedInUser } from "./services/queries";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";

export default function App() {
  const { data: username, isPending, isError } = useGetSignedInUser();
  if (isError) return <LoginPage />;
  if (isPending) return null;

  return (
    <>
      <Header username={username} />
      <MainPage username={username} />
    </>
  );
}
