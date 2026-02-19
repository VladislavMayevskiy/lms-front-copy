import { useEffect } from "react";
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from "routes/appRoutes";
import { useLoadingStore } from "./components/shared/loading/useLoadingStore";
import { useLoadCurrentUser } from "hooks/useLoadCurrentUser";

function App() {
  const { isLoading } = useLoadCurrentUser();
  const setIsLoading = useLoadingStore((store) => store.setIsLoading);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [setIsLoading, isLoading]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
