import { Box, Skeleton, Typography } from "@mui/material";
import { custom_services__message__schemas__MessageModel } from "../../../../../client";


interface MessageItemProps {
    data?: custom_services__message__schemas__MessageModel
    sender?: boolean
    loading?: boolean
}

export default function MessageItem(props: MessageItemProps) {
    const { data, sender, loading } = props

    return (
        <>
            <Box sx={{ width: "100%", py: "5px", display: "inline-flex", flexDirection: "row", justifyContent: sender ? "flex-end" : "flex-start" }} >
                <Box sx={{ width: "250px", maxWidth: "100%", p: "10px", borderRadius: "10px", border: "1px solid black" }} >
                    {loading ? <Skeleton variant="text" width="100%" /> :
                        <Typography variant="subtitle2" >
                            {data?.text}
                        </Typography>
                    }
                </Box>
            </Box>
        </>
    )
}