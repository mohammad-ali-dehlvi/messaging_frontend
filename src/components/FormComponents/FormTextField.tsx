import { TextField, TextFieldProps } from "@mui/material";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T, any, T>;
  name: FieldPath<T>;
  rules?:
    | Omit<
        RegisterOptions<T, Path<T>>,
        "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate"
      >
    | undefined;
  textFieldProps?: Omit<TextFieldProps, "value" | "onChange">;
}

export default function FormTextField<T extends FieldValues>(
  props: FormTextFieldProps<T>
) {
  const { control, name, rules, textFieldProps = {} } = props;

  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          return (
            <TextField
              value={value}
              onChange={onChange}
              helperText={error?.message}
              error={!!error?.message}
              {...textFieldProps}
            />
          );
        }}
      />
    </>
  );
}
