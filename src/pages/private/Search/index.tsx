import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"
import DebounceSearch from "../../../components/inputs/DebounceSearch";
import { useCallback, useEffect, useState } from "react";
import { useSnack } from "../../../context/SnackContext";
import { SearchUsersResponse, SocialActionsService } from "../../../client";
import SearchUserItem from "./components/SearchUserItem";


export default function Search() {
    const { showSnackbar } = useSnack()
    const [usersDataLoading, setUsersDataLoading] = useState(false)
    const [usersData, setUsersData] = useState<SearchUsersResponse | null>(null)
    const [searchText, setSearchText] = useState<string>("")

    const getUsersData = useCallback(async (obj: { limit: number; offset: number }) => {
        setUsersDataLoading(true)
        try {
            const res = await SocialActionsService.searchUsersSocialActionsSearchUsersPost({
                requestBody: {
                    q: searchText,
                    ...obj
                }
            })
            setUsersData(res)
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error"
            })
        } finally {
            setUsersDataLoading(false)
        }
    }, [usersData])

    useEffect(() => {
        if (searchText) {
            getUsersData({
                limit: 100,
                offset: 0
            })
        }
    }, [searchText])

    return (
        <>
            <DebounceSearch
                onChange={setSearchText}
                debounceMilliSecond={2000}
                sx={{ mt: "10px" }}
            />
            <Box sx={{ mt: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }} >
                {usersData && usersData.data.length > 0 ? (
                    <>
                        {usersData.data.map((item, i) => {
                            return (
                                <SearchUserItem key={`${i} ${item.email}`} data={item} />
                            )
                        })}
                        {usersData.next_offset && !usersDataLoading && (
                            <Button variant="text" onClick={() => {
                                getUsersData({ limit: 100, offset: usersData.next_offset as number })
                            }} >LOAD MORE</Button>
                        )}
                    </>
                ) : !usersDataLoading && searchText.length > 0 && (
                    <>
                        <Typography>No Friends</Typography>
                    </>
                )}
                {usersDataLoading && (
                    <>
                        <SearchUserItem loading />
                        <SearchUserItem loading />
                        <SearchUserItem loading />
                        <SearchUserItem loading />
                        <SearchUserItem loading />
                    </>
                )}
            </Box>
        </>
    )
}