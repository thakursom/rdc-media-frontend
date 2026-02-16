import { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import ToastNotification from "./components/ToastNotification/ToastNotification";

function App() {

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = decoded.exp * 1000;

        if (Date.now() >= expiryTime) {
          localStorage.clear();
          window.location.href = "/";
        }
      } catch (error) {
        localStorage.clear();
        window.location.href = "/";
      }
    };

    checkToken();
  }, []);

  return (
    <>
      <ToastNotification />
      <AppRouter />
    </>
  );
}

export default App;
