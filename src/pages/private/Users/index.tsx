import { Box, Typography, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useSnack } from "../../../context/SnackContext";
import { FriendsService, FriendsWithMessageResponse, FriendWithMessageOut } from "../../../client";
import UserItem from "./components/UserItem";
import MessagingComp from "./components/MessagingComp";


export default function Messages() {
    const { showSnackbar } = useSnack()
    const [friendsLoading, setFriendsLoading] = useState(false)
    const [friendsData, setFriendsData] = useState<FriendsWithMessageResponse | null>(null)
    const [searchText, setSearchText] = useState("")
    const [selectedUser, setSelectedUser] = useState<FriendWithMessageOut | null>(null)

    const getFriendsData = async (obj: { limit: number; offset: number }) => {
        setFriendsLoading(true)
        try {
            const res = await FriendsService.getFriendsWithLastMessageFriendsFriendsWithLastMessagePost({
                requestBody: {
                    q: searchText,
                    ...obj
                }
            })
            setFriendsData((prev) => {
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
            setFriendsLoading(false)
        }
    }

    useEffect(() => {
        getFriendsData({ limit: 100, offset: 0 })
    }, [])

    return (
        <>
            <Box sx={{ width: "100%", height: "100%", minHeight: "100%" }} >
                {selectedUser ? (
                    <MessagingComp email={selectedUser.email} onBack={() => { setSelectedUser(null) }} />
                ) : (
                    <>
                        <Grid container spacing={"10px"} >
                            {friendsData && friendsData.data.length ? (
                                <>
                                    {friendsData.data.map((item) => {
                                        return (
                                            <UserItem key={item.id} data={item} onClick={() => {
                                                setSelectedUser(item)
                                            }} />
                                        )
                                    })}
                                    {friendsData.next_offset && !friendsLoading && (
                                        <Button variant="text" onClick={() => {
                                            getFriendsData({ limit: 100, offset: friendsData.next_offset as number })
                                        }} >LOAD MORE</Button>
                                    )}
                                </>
                            ) : !friendsLoading && (
                                <>
                                    <Typography>No Friends</Typography>
                                </>
                            )}

                            {friendsLoading && (
                                <>
                                    <UserItem loading />
                                    <UserItem loading />
                                    <UserItem loading />
                                    <UserItem loading />
                                </>
                            )}
                        </Grid>
                    </>
                )}

            </Box>
        </>
    )
}