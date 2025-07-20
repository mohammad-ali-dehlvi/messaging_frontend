import { Avatar, Box, Button, Chip, Skeleton, Typography } from "@mui/material";
import { FriendRequestStatus, FriendsService, SocialActionsService, UserOut } from "../../../../client";
import { useCallback, useMemo, useState } from "react";
import { useSnack } from "../../../../context/SnackContext";


interface SearchUserItemProps {
    data?: UserOut
    loading?: boolean
}


export default function SearchUserItem(props: SearchUserItemProps) {
    const { data: propsData, loading } = props
    const { showSnackbar } = useSnack()
    const [actionLoading, setActionLoading] = useState(false)
    const [data, setData] = useState(propsData)

    const status = data?.friend_status

    const name = useMemo(() => {
        if (data) {
            return data.display_name
        }
        return "User"
    }, [data])

    const email = useMemo(() => {
        if (data) {
            return data.email
        }
        return "Email"
    }, [data])

    const addFriend = useCallback(async () => {
        if (!data) {
            showSnackbar({
                message: "Data is not valid",
                severity: "error"
            })
            return
        }
        setActionLoading(true)
        try {
            const res = await FriendsService.sendFriendRequestFriendsSendRequestPost({
                requestBody: {
                    email: data.email
                }
            })
            if (res.success) {
                await refetchData({ skipLoading: true })
                showSnackbar({
                    message: "Request send",
                    severity: "success"
                })
            } else {
                showSnackbar({
                    message: res.message || "Request not send",
                    severity: "info"
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
    }, [data])

    const removeFriend = useCallback(async () => {
        if (!data) {
            showSnackbar({
                message: "Data is not valid",
                severity: "error"
            })
            return
        }
        setActionLoading(true)
        try {
            const res = await FriendsService.friendRequestRemoveFriendsRemovePost({
                requestBody: {
                    email: data.email
                }
            })
            if (res.success) {
                await refetchData({ skipLoading: true })
                showSnackbar({
                    message: "Request removed",
                    severity: "success"
                })
            } else {
                showSnackbar({
                    message: res.message || "Request not removed",
                    severity: "info"
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
    }, [data])

    const refetchData = useCallback(async (obj?: { skipLoading?: boolean }) => {
        const { skipLoading } = obj || {}
        if (!skipLoading) {
            setActionLoading(true)
        }
        try {
            const res = await SocialActionsService.searchUsersSocialActionsSearchUsersPost({
                requestBody: {
                    q: data?.email || null,
                    limit: 1,
                    offset: 0
                }
            })
            if (res.data.length > 0) {
                setData(res.data[0])
            }
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error"
            })
        } finally {
            if (!skipLoading) {
                setActionLoading(false)
            }
        }
    }, [data])

    return (
        <>
            <Box sx={{ width: "250px", display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", p: "15px", borderRadius: "15px", border: "1px solid rgba(0,0,0,0.5)" }} >
                <Box sx={{ minWidth: "40px" }} >
                    {loading ? <Skeleton variant="circular" width={"40px"} height={"40px"} /> : (
                        <Avatar variant="circular" >
                            {name[0].toUpperCase()}
                        </Avatar>
                    )}
                </Box>
                <Box flex={1} >
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }} >
                        {loading ? <Skeleton variant="text" width={"100%"} /> : (
                            <Typography variant="subtitle2" lineHeight={1} sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} >{name}</Typography>
                        )}
                        {!!data?.friend_status && <Chip variant="outlined" size="small" label={data.friend_status} />}
                    </Box>
                    {loading ? <Skeleton variant="text" width={"80%"} /> : (
                        <Typography variant="caption" lineHeight={1} sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} >{email}</Typography>
                    )}
                </Box>
                {!loading && (
                    <Box>
                        {status === FriendRequestStatus.ACCEPTED && (
                            <Button variant="contained" size="small" color="error" disabled={actionLoading} onClick={removeFriend} >Remove</Button>
                        )}
                        {(!status || [FriendRequestStatus.REJECTED, FriendRequestStatus.REMOVED].includes(status)) && (
                            <Button variant="contained" size="small" color="primary" disabled={actionLoading} onClick={addFriend} >Add</Button>
                        )}
                    </Box>
                )}
            </Box>
        </>
    )
}
