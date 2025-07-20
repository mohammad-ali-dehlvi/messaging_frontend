import { Box, Button, Typography } from "@mui/material";
import { AuthService } from "../../client";
import { SubmitHandler, useForm } from "react-hook-form";
import FormTextField from "../../components/FormComponents/FormTextField";
import { useState } from "react";
import { useSnack } from "../../context/SnackContext";
import { useNavigate } from "react-router";

type FormValueType = {
  email: string;
  password: string;
  confirm_password: string;
  display_name: string;
};

export default function Register() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
    watch,
  } = useForm<FormValueType>({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      display_name: "",
    },
    mode: "onChange",
  });
  const navigate = useNavigate();
  const { showSnackbar } = useSnack();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormValueType> = async (values) => {
    setLoading(true);
    try {
      const { email, password, display_name } = values;
      const res = await AuthService.createUserAuthCreateUserPost({
        requestBody: {
          email,
          password,
          display_name,
        },
      });
      showSnackbar({
        message:
          res.message ?? res.success
            ? "Successfully created"
            : "Error in user creation",
        severity: res.success ? "success" : "error",
        autoHideDuration: 2000,
      });
      if (res.success) {
        navigate("/login");
      }
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
            Register
          </Typography>

          <FormTextField
            control={control}
            name="email"
            textFieldProps={{
              fullWidth: true,
              sx: { mb: "10px" },
              disabled: loading,
              label: "Email",
              type: "email",
              placeholder: "Enter email",
            }}
          />

          <FormTextField
            control={control}
            name="display_name"
            textFieldProps={{
              fullWidth: true,
              sx: { mb: "10px" },
              disabled: loading,
              label: "Name",
              type: "name",
              placeholder: "Enter name",
            }}
          />

          <FormTextField
            control={control}
            name="password"
            rules={{
              validate: (value) => {
                const confirmPassword = watch("confirm_password");
                if (!value) {
                  return false;
                } else if (!confirmPassword || value === confirmPassword) {
                  return true;
                }
                return "This should be equal to Confirm Password";
              },
            }}
            textFieldProps={{
              fullWidth: true,
              sx: { mb: "10px" },
              disabled: loading,
              label: "Password",
              type: "password",
              placeholder: "Enter password",
            }}
          />

          <FormTextField
            control={control}
            name="confirm_password"
            rules={{
              validate: (value) => {
                const password = watch("password");
                if (!value) {
                  return false;
                } else if (!password || value === password) {
                  return true;
                }
                return "This should be equal to Password";
              },
            }}
            textFieldProps={{
              fullWidth: true,
              sx: { mb: "10px" },
              disabled: loading,
              label: "Confirm Password",
              type: "password",
              placeholder: "Enter confirm password",
            }}
          />

          <Button
            disabled={loading || !isValid}
            variant="contained"
            fullWidth
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
}
