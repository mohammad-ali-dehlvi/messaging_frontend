import { Link, useNavigate } from "react-router";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import CustomSnackbar, {
  CustomSnackbarRef,
} from "../../components/CustomSnackbar";
import { SubmitHandler, useForm } from "react-hook-form";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import FormTextField from "../../components/FormComponents/FormTextField";
import { useSnack } from "../../context/SnackContext";

type FormType = { email: string; password: string };

export default function Login() {
  const { showSnackbar } = useSnack();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormType>({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });
  const [passwordInputType, setPasswordInputType] = useState<
    "password" | "text"
  >("password");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormType> = async ({ email, password }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      showSnackbar({
        message: (err as Error).message,
        severity: "error",
        autoHideDuration: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: "100%",
            width: "250px",
            border: "1px solid rgba(0,0,0,0.5)",
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <Typography variant="h5" textAlign={"center"} sx={{ mb: "20px" }}>
            Login Form
          </Typography>
          <FormTextField
            control={control}
            name="email"
            rules={{
              validate: (v) => {
                return true;
              },
            }}
            textFieldProps={{
              fullWidth: true,
              sx: { mb: "20px" },
              disabled: loading,
              label: "Email",
              type: "email",
              placeholder: "Enter email",
            }}
          />

          <FormTextField
            control={control}
            name="password"
            rules={{
              validate: (value) => {
                if (value?.length < 6) {
                  return false;
                }
                return true;
              },
            }}
            textFieldProps={{
              fullWidth: true,
              label: "Password",
              placeholder: "Enter password",
              type: passwordInputType,
              disabled: loading,
              sx: { mb: "20px" },
              slotProps: {
                input: {
                  endAdornment: (
                    <IconButton
                      onClick={() => {
                        setPasswordInputType((prev) =>
                          prev === "password" ? "text" : "password"
                        );
                      }}
                    >
                      {passwordInputType === "password" ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  ),
                },
              },
            }}
          />

          <Box sx={{ mb: "10px" }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={loading || !isValid}
              startIcon={loading && <CircularProgress />}
            >
              Submit
            </Button>
          </Box>
          <Box>
            <Typography
              component={Link}
              to="/register"
              sx={{ textDecoration: "none" }}
            >
              Register
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
