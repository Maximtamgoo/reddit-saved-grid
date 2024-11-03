import { useMemo } from "react";
import { useBrowserLocation } from "wouter/use-browser-location";
import Header from "./components/Header";
import Dialog from "./components/Modal/Dialog";
import Modal from "./components/Modal/Modal";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import { RedditItem } from "./schema/RedditItem";
import { useGetSignedInUser } from "./services/queries";

export default function App() {
  const { isPending, isError } = useGetSignedInUser();
  const [location, navigate] = useBrowserLocation();

  const historyState = useMemo(() => {
    const splitStr = location.split("/");
    const isModalRoute = splitStr.length === 3 && splitStr[0] === "" && splitStr[1] === "modal";
    const paramId = isModalRoute ? splitStr[2] : undefined;
    if (!isModalRoute || !paramId) return undefined;
    const result = RedditItem.try(history.state);
    if (result.ok && result.value.id === paramId) {
      return result.value;
    } else {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  if (isPending) return null;
  if (isError) return <LoginPage />;

  return (
    <>
      <Dialog isOpen={!!historyState} onClose={() => history.back()}>
        {!!historyState && <Modal item={historyState} />}
      </Dialog>
      <Header />
      <MainPage />
    </>
  );
}
