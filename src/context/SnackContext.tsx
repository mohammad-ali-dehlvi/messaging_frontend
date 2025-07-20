import { Alert, Snackbar } from "@mui/material";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import CustomSnackbar, {
  CustomSnackbarRef,
} from "../components/CustomSnackbar";

type SeverityType = "error" | "info" | "success" | "warning";

type ShowType = {
  message: string;
  severity?: SeverityType;
  autoHideDuration?: number;
};

interface SnackContextInterface {
  showSnackbar: (obj: ShowType) => void;
  hideSnackbar: () => void;
}

const SnackContext = createContext({} as SnackContextInterface);

export const useSnack = () => useContext(SnackContext);

interface SnackContextProviderProps {
  children: ReactNode;
}

export default function SnackContextProvider(props: SnackContextProviderProps) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<SeverityType>("success");
  const [autoHideDuration, setAutoHideDuration] = useState(1000);

  const handleClose = useCallback(() => {
    setOpen(false);
    setMessage("");
    setSeverity("success");
    setAutoHideDuration(1000);
  }, [open, message, severity, autoHideDuration]);

  const handleShow = useCallback(
    (obj: ShowType) => {
      setOpen(!!obj?.message);
      setMessage(obj?.message);
      setSeverity(obj?.severity || "success");
      setAutoHideDuration(obj?.autoHideDuration ?? 1000);
    },
    [open, message, severity, autoHideDuration]
  );

  const contextValue = useMemo(() => {
    return {
      showSnackbar: handleShow,
      hideSnackbar: handleClose,
    };
  }, [handleShow, handleClose]);

  return (
    <SnackContext.Provider value={contextValue}>
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={() => {
          setOpen(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={severity}>{message}</Alert>
      </Snackbar>
      {props.children}
    </SnackContext.Provider>
  );
}
