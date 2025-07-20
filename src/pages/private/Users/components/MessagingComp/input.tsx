import { ButtonBase, InputAdornment, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useCallback, useState } from "react";
import { useSnack } from "../../../../../context/SnackContext";
import { MessagingService } from "../../../../../client";

interface InputProps {
    email: string
}

export default function Input(props: InputProps) {
    const { email } = props
    const { showSnackbar } = useSnack()
    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)

    const sendMessage = useCallback(async () => {
        setLoading(true)
        try {
            const res = await MessagingService.sendMessageMessagingSendMessagePost({
                requestBody: {
                    text: value,
                    email
                }
            })
            if (!res.success) {
                showSnackbar({
                    message: res.message || "Message not sent",
                    severity: "error"
                })
            }
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error"
            })
        } finally {
            setLoading(false)
        }
    }, [value, email])

    return (
        <TextField
            fullWidth
            multiline
            variant="outlined"
            label="Type Message"
            placeholder="Type Message"
            value={value}
            onChange={(e) => {
                setValue(e.target.value)
            }}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end" component={ButtonBase} onClick={sendMessage} >
                            <SendIcon />
                        </InputAdornment>
                    )
                }
            }}

        />
    )
}