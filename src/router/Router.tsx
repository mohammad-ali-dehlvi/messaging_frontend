import { useAuthContext } from "../context/AuthContext";
import WebSocketContextProvider from "../context/WebSocketContext";
import PrivateRouter from "./PrivateRouter";
import PublicRouter from "./PublicRouter";

import { Box, CircularProgress } from "@mui/material";

export default function Router() {
  const { currentUser, loading } = useAuthContext();

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {currentUser ?
        <WebSocketContextProvider>
          <PrivateRouter />
        </WebSocketContextProvider>
        : <PublicRouter />}
    </>
  );
}
