import { useCallback, useEffect, useMemo, useState } from "react";
import { FriendRequestStatus, FriendsListResponse, FriendsService } from "../../../../client";
import { useSnack } from "../../../../context/SnackContext";
import CustomTable from "../../../../components/CustomTable";
import { useAuthContext } from "../../../../context/AuthContext";
import { Box, Button, Chip, Typography } from "@mui/material";
import { useWebSocketContext } from "../../../../context/WebSocketContext";
import { WebSocketTypes } from "../../../../utils/websocket";


interface FriendsTableProps {
    status: FriendRequestStatus
}

export default function FriendsTable(props: FriendsTableProps) {
    const { status } = props
    const { currentUser } = useAuthContext()
    const { showSnackbar } = useSnack()
    const { subscribeCallback, unsubscribeCallback } = useWebSocketContext()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<FriendsListResponse | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    const tableData = useMemo(() => {
        if (!data || !currentUser) {
            return []
        }
        return data.data.map((item) => {
            const isRequester = item.requester.email !== currentUser.email
            const obj = isRequester ? item.requester : item.recipient
            const status = item.status as FriendRequestStatus
            return {
                isRequester,
                status,
                ...obj
            }
        })
    }, [data, currentUser])

    const removeFriend = useCallback(async (email: string) => {
        setActionLoading(true)
        try {
            const res = await FriendsService.friendRequestRemoveFriendsRemovePost({
                requestBody: {
                    email
                }
            })
            if (res.success) {
                getData({ offset: 0, limit: 100 })
                showSnackbar({
                    message: "Request removed",
                    severity: "success"
                })
            } else {
                showSnackbar({
                    message: res.message || "Request not removed",
                    severity: "error"
                })
            }
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error"
            })
        } finally {
            setActionLoading(false)
        }
    }, [])

    const addFriend = useCallback(async (email: string) => {
        setActionLoading(true)
        try {
            const res = await FriendsService.sendFriendRequestFriendsSendRequestPost({
                requestBody: {
                    email
                }
            })
            if (res.success) {
                getData({ offset: 0, limit: 100 })
                showSnackbar({
                    message: "Request added",
                    severity: "success"
                })
            } else {
                showSnackbar({
                    message: res.message || "Request not added",
                    severity: "error"
                })
            }
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error"
            })
        } finally {
            setActionLoading(false)
        }
    }, [])

    const answerFriend = useCallback(async (email: string, status: FriendRequestStatus.ACCEPTED | FriendRequestStatus.REJECTED) => {
        setActionLoading(true)
        try {
            const res = await FriendsService.friendRequestAnswerFriendsAnswerPost({
                requestBody: {
                    email,
                    status
                }
            })
            if (res.success) {
                getData({ offset: 0, limit: 100 })
                showSnackbar({
                    message: `Request ${status.toLowerCase()}`,
                    severity: "success"
                })
            } else {
                showSnackbar({
                    message: res.message || `Request not ${status.toLowerCase()}`,
                    severity: "error"
                })
            }
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error"
            })
        } finally {
            setActionLoading(false)
        }
    }, [])

    const getData = useCallback(async (obj: { limit: number; offset: number }) => {
        setLoading(true)
        try {
            const res = await FriendsService.getFriendRequestsFriendsListPost({
                requestBody: {
                    status: [status.toLowerCase() as FriendRequestStatus],
                    ...obj
                }
            })
            setData((prev) => {
                if (obj.offset === 0) return res
                if (prev) return {
                    ...res,
                    data: [...prev.data, ...res.data]
                }
                return null
            })
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error"
            })
        } finally {
            setLoading(false)
        }
    }, [status])

    useEffect(() => {
        getData({ limit: 100, offset: 0 })
    }, [status])

    useEffect(() => {
        const uid = subscribeCallback((e) => {
            const data: { type: WebSocketTypes, data: any } = JSON.parse(e.data)
            const refreshCondition = (
                [
                    WebSocketTypes.FRIEND_REQUEST_ANSWER,
                    WebSocketTypes.FRIEND_REQUEST_RECEIVED,
                    WebSocketTypes.FRIEND_REQUEST_REMOVED,
                    WebSocketTypes.FRIEND_REQUEST_SENT
                ].includes(data.type)
            )

            if (refreshCondition) {
                getData({ limit: 100, offset: 0 })
            }
        })

        return () => {
            unsubscribeCallback(uid)
        }
    }, [])

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }} >
                <Button variant="contained" size="small" onClick={() => { getData({ limit: 100, offset: 0 }) }} >Refresh</Button>
            </Box>
            <CustomTable
                loading={loading}
                data={tableData}
                columns={[
                    {
                        title: "Email",
                        field: "email",
                        render: (data) => {
                            return (
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }} >
                                    <Typography>{data.email}</Typography>
                                    <Chip variant="outlined" size="small" label={data.isRequester ? "Requester by user" : "Requester by you"} />
                                </Box>
                            )
                        }
                    },
                    {
                        title: "Name",
                        field: "display_name"
                    },
                    {
                        title: "Action",
                        field: "status",
                        render: (data) => {
                            const { email, status, isRequester } = data
                            return (
                                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px", flexWrap: "wrap" }} >
                                    {status === FriendRequestStatus.ACCEPTED && (
                                        <Button variant="contained" size="small" color="error" onClick={() => removeFriend(email)} >Remove</Button>
                                    )}
                                    {[FriendRequestStatus.REJECTED, FriendRequestStatus.REMOVED].includes(status) && (
                                        <Button variant="contained" size="small" color="primary" onClick={() => addFriend(email)} >Add</Button>
                                    )}
                                    {status === FriendRequestStatus.PENDING && (
                                        <>
                                            {isRequester ? <>
                                                <Button variant="contained" size="small" color="success" onClick={() => answerFriend(email, FriendRequestStatus.ACCEPTED)} >Accept</Button>
                                                <Button variant="contained" size="small" color="error" onClick={() => answerFriend(email, FriendRequestStatus.REJECTED)} >Reject</Button>
                                            </> : <>
                                                <Button variant="contained" size="small" color="error" onClick={() => removeFriend(email)} >Remove</Button>
                                            </>}

                                        </>
                                    )}
                                </Box>
                            )
                        }
                    }
                ]}
            />
        </>
    )
}