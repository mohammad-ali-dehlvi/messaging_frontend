import { Alert, Snackbar } from "@mui/material";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

interface CustomSnackbarProps {}

type SeverityType = "error" | "info" | "success" | "warning";

type ShowType = {
  message: string;
  severity?: SeverityType;
  autoHideDuration?: number;
};

export interface CustomSnackbarRef {
  show: (obj: ShowType) => void;
  hide: () => void;
}

const CustomSnackbar = forwardRef<CustomSnackbarRef, CustomSnackbarProps>(
  (props, ref) => {
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

    useImperativeHandle(
      ref,
      () => {
        return {
          show: (obj) => {
            setOpen(true);
            setMessage(obj?.message);
            if (obj?.severity) {
              setSeverity(obj?.severity);
            }
            if (obj?.autoHideDuration) {
              setAutoHideDuration(obj?.autoHideDuration);
            }
          },
          hide: () => {
            handleClose();
          },
        };
      },
      [message, severity, autoHideDuration, handleClose]
    );

    return (
      <>
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
      </>
    );
  }
);

export default CustomSnackbar;
