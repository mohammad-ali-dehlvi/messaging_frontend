import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { AuthService, CreateUserModel } from "../../../../client";
import FormTextField from "../../../../components/FormComponents/FormTextField";
import { useEffect, useRef, useState } from "react";
import { useSnack } from "../../../../context/SnackContext";


interface AddUsersDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddUsersDialog(props: AddUsersDialogProps) {
    const { open, onClose } = props
    const defaultPassword = useRef("123456")
    const { showSnackbar } = useSnack()
    const { control, handleSubmit, reset } = useForm<{ users: CreateUserModel[] }>({ mode: "onSubmit", defaultValues: { users: [{ email: "", password: defaultPassword.current, display_name: "", email_verified: true }] } })
    const { fields, append, remove } = useFieldArray({ control, name: "users" })
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        onClose()
    }

    const onSubmit: SubmitHandler<{ users: CreateUserModel[]; }> = async (data) => {
        setLoading(true)
        try {
            const res = await AuthService.bulkCreateUsersAuthBulkCreateUserPost({ requestBody: data })
            const failedRes = res.result.filter(e => !e.success)

            const message = failedRes.map(e => e.message).join(", ")

            if (failedRes.length > 0) {
                showSnackbar({
                    message,
                    severity: "error",
                    autoHideDuration: 10 * 1000
                })
            } else {
                showSnackbar({
                    message: "All Users created",
                    severity: "success",
                    autoHideDuration: 5 * 1000
                })
            }
        } catch (err) {
            showSnackbar({ message: (err as Error).message, severity: "error", autoHideDuration: 5000 })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => {
            reset()
        }
    }, [open])

    return (
        <>
            <Dialog open={open} onClose={handleClose} >
                <DialogTitle>Add Users</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "stretch" }} >
                        {fields.map((field, i) => {

                            return (

                                <Box key={field.id} sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }} >
                                    <FormTextField control={control} name={`users.${i}.email`}
                                        rules={{
                                            validate: (val) => {
                                                if (!val) {
                                                    return "Email is required"
                                                }
                                                return true
                                            }
                                        }}
                                        textFieldProps={{
                                            fullWidth: true,
                                            disabled: loading,
                                            label: "Email",
                                            type: "email",
                                            placeholder: "Enter email",
                                        }} />
                                    <FormTextField
                                        control={control}
                                        name={`users.${i}.display_name`}
                                        rules={{
                                            validate: (val) => {
                                                if (!val) {
                                                    return "Name is required"
                                                }
                                                return true
                                            }
                                        }}
                                        textFieldProps={{
                                            fullWidth: true,
                                            disabled: loading,
                                            label: "Name",
                                            type: "text",
                                            placeholder: "Enter name",
                                        }} />
                                    <Button size="small" variant="contained" color="error" disabled={fields.length === 1} onClick={() => { remove(i) }} >Remove</Button>
                                </Box>
                            )
                        })}
                    </Box>

                </DialogContent>
                <DialogActions>
                    <Button size="small" variant="contained" onClick={() => {
                        append({ email: "", display_name: "", password: defaultPassword.current, email_verified: true })
                    }} >Add User</Button>
                    <Button size="small" variant="text" onClick={() => {
                        handleClose()
                    }} >Close</Button>
                    <Button size="small" variant="contained" onClick={handleSubmit(onSubmit)} >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}