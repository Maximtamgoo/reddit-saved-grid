import { useGetSignedInUser } from "./services/queries";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";

export default function App() {
  const { data, isPending, isError } = useGetSignedInUser();
  if (isError) return <LoginPage />;
  if (isPending) return null;

  return (
    <div className="bg-slate-50 text-slate-800">
      <Header username={data.name} userIconUrl={data.icon_img} />
      <MainPage username={data.name} />
    </div>
  );
}
