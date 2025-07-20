import { Box, ButtonBase, IconButton, InputAdornment, SxProps, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSnack } from "../../../../../context/SnackContext";
import { custom_services__message__schemas__MessageModel, MessageGetResponse, MessagingService } from "../../../../../client";
import Input from "./input";
import MessageItem from "./MessageItem";
import { useAuthContext } from "../../../../../context/AuthContext";
import { useWebSocketContext } from "../../../../../context/WebSocketContext";
import { WebSocketTypes } from "../../../../../utils/websocket";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


interface MessagingCompProps {
    email: string
    rootSx?: SxProps
    onBack?: () => void
}

export default function MessagingComp(props: MessagingCompProps) {
    const { email, onBack, rootSx = {} } = props
    const messageContainer = useRef<HTMLDivElement | null>(null)
    const { showSnackbar } = useSnack()
    const { currentUser } = useAuthContext()
    const { subscribeCallback, unsubscribeCallback } = useWebSocketContext()
    const [loading, setLoading] = useState(false)
    const [messageData, setMessageData] = useState<MessageGetResponse | null>(null)

    const getMessages = useCallback(async (obj: { limit: number; offset: number }) => {
        setLoading(true)
        try {
            const res = await MessagingService.messageGetMessagingMessageGetPost({
                requestBody: {
                    email,
                    q: null,
                    ...obj
                }
            })
            setMessageData((prev) => {
                if (obj.offset === 0) return res
                if (prev) return {
                    ...res,
                    data: [...prev.data, ...res.data]
                }
                return null
            })
            messageContainer.current?.scrollTo({
                top: messageContainer.current?.scrollHeight,
                behavior: "smooth"
            })
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error"
            })
        } finally {
            setLoading(false)
        }
    }, [email])

    useEffect(() => {
        getMessages({ limit: 1000, offset: 0 })
        const uid = subscribeCallback((e) => {
            const data: { type: WebSocketTypes, data: custom_services__message__schemas__MessageModel } = JSON.parse(e.data)
            if (
                [WebSocketTypes.MESSAGE_RECEIVED, WebSocketTypes.MESSAGE_SENT].includes(data.type) &&
                (data.data.recipient.email === email || data.data.sender.email === email)
            ) {
                setMessageData(prev => {
                    if (!prev) return null
                    return {
                        ...prev,
                        data: [...prev.data, data.data]
                    }
                })
            }
        })
        return () => {
            unsubscribeCallback(uid)
        }
    }, [email])

    return (
        <Box sx={{ width: "100%", height: "100%", ...rootSx }} >
            <Box sx={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "stretch" }} >
                <Box
                    component={ButtonBase}
                    onClick={onBack}
                    sx={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "5px",
                        px: "10px",
                        py: "5px",
                        borderRadius: "25px",
                        bgcolor: "#FFF",
                        boxShadow: "0px 0px 5px rgba(0,0,0,0.5)",
                        opacity: 0.2,
                        transitionDuration: "0.2s",
                        "&:hover": {
                            opacity: 1
                        }
                    }}
                >
                    <IconButton

                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="subtitle2" >{email}</Typography>
                </Box>
                <Box ref={messageContainer} sx={{ flex: 1, overflowX: "hidden", overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "stretch" }} >
                    <Box sx={{ flex: 1 }} />
                    {loading && (
                        <>
                            <MessageItem loading />
                            <MessageItem loading sender />
                            <MessageItem loading />
                            <MessageItem loading sender />
                            <MessageItem loading />
                            <MessageItem loading sender />
                            <MessageItem loading />
                            <MessageItem loading sender />
                        </>
                    )}
                    {messageData?.data?.map((item, index) => {
                        const isSender = currentUser?.email === item.sender.email
                        return (
                            <MessageItem key={index} sender={isSender} data={item} />
                        )
                    })}
                </Box>
                <Box>
                    <Input email={email} />
                </Box>
            </Box>
        </Box>
    )
}