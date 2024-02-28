import { useGetSignedInUser } from "./services/queries";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";

export default function App() {
  const { data: username, isPending, isError } = useGetSignedInUser();
  if (isError) return <LoginPage />;
  if (isPending) return null;

  return (
    <>
      <Navbar username={username} />
      <MainPage username={username} />
    </>
  );
}
