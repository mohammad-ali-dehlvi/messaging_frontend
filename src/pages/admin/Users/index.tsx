import { Box, Button, Table, TableBody, TableContainer, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AdminService, GetAllUsersResponse } from "../../../client";
import { useSnack } from "../../../context/SnackContext";
import CustomTable from "../../../components/CustomTable";
import AddUsersDialog from "./components/AddUsersDialog";
import UserTableMenu from "./components/UserTableMenu";

export default function Users() {
    const { showSnackbar } = useSnack()
    const [usersData, setUsersData] = useState<GetAllUsersResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [openAddUsersDialog, setOpenAddUsersDialog] = useState(false)

    const getUsersData = async (obj: { limit: number; offset: number }) => {
        const { offset, limit } = obj
        setLoading(true)
        try {
            const res = await AdminService.getAllUsersAdminGetAllUsersPost({ requestBody: { q: "", limit, offset } })
            setUsersData((prev) => {
                if (offset === 0) {
                    return res
                }
                return {
                    ...res,
                    data: [...(prev?.data || []), ...res.data]
                }
            })
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error",
                autoHideDuration: 5000
            })
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUsersData({ limit: 100, offset: 0 })
    }, [])

    return (
        <>
            <AddUsersDialog
                open={openAddUsersDialog}
                onClose={() => { setOpenAddUsersDialog(false) }}
                onSuccess={() => {
                    getUsersData({ limit: Math.max(usersData?.data?.length || 0, 100), offset: 0 })
                }}
            />
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }} >
                <Typography variant="h3" >Users</Typography>
                <Button size="small" variant="contained" onClick={() => { setOpenAddUsersDialog(true) }} >Add Users</Button>
            </Box>
            <Box>
                <CustomTable
                    loading={loading}
                    data={usersData?.data || []}
                    columns={[
                        {
                            title: "Name",
                            field: "display_name"
                        },
                        {
                            title: "Email",
                            field: "email"
                        },
                        {
                            title: "Phone",
                            field: "phone"
                        },
                        {
                            title: "Menu",
                            field: "menu",
                            render: (data) => {
                                return (
                                    <UserTableMenu data={data} onDelete={async () => {
                                        await getUsersData({ limit: Math.max(usersData?.data?.length || 0, 100), offset: 0 })
                                    }} />
                                )
                            }
                        }
                    ]}
                    onLastPage={() => {
                        if (typeof usersData?.next_offset === "number") {
                            getUsersData({
                                limit: 100,
                                offset: usersData.next_offset
                            })
                        }
                    }}
                />
            </Box>
        </>
    );
}
