import { Avatar, Box, ButtonBase, Grid, Skeleton, Typography } from "@mui/material"
import { FriendWithMessageOut } from "../../../../client"
import { useMemo } from "react"


interface UserItemProps {
    data?: FriendWithMessageOut
    loading?: boolean
    onClick?: () => void
}

export default function UserItem(props: UserItemProps) {
    const { data, loading, onClick } = props

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

    return (
        <>
            <Grid size={{ md: 4, sm: 6, xs: 12 }} >
                <Box component={ButtonBase} onClick={onClick} sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", alignItems: "center", gap: "10px", p: "15px", borderRadius: "15px", border: "1px solid rgba(0,0,0,0.5)" }} >
                    <Box sx={{ minWidth: "40px" }} >
                        {loading ? <Skeleton variant="circular" width={"40px"} height={"40px"} /> : (
                            <Avatar variant="circular" >
                                {name[0].toUpperCase()}
                            </Avatar>
                        )}
                    </Box>
                    <Box flex={1} >
                        {loading ? <Skeleton variant="text" width={"100%"} /> : (
                            <Typography variant="subtitle2" lineHeight={1} sx={{ textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} >{name}</Typography>
                        )}
                        {loading ? <Skeleton variant="text" width={"80%"} /> : (
                            <Typography variant="caption" component={"p"} lineHeight={1.1} sx={{ textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} >{email}</Typography>
                        )}
                    </Box>
                </Box>
            </Grid>
        </>
    )
}