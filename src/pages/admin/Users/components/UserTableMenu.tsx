import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgress, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import { AdminService, AdminUserModel, AuthService } from '../../../../client';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useMemo, useState } from 'react';
import { useAuthContext } from '../../../../context/AuthContext';
import { useSnack } from '../../../../context/SnackContext';
import TokenIcon from '@mui/icons-material/Token';

interface UserTableMenuProps {
    data: AdminUserModel
    onDelete?: () => Promise<void>
}

export default function UserTableMenu(props: UserTableMenuProps) {
    const { data, onDelete } = props
    const { currentUser } = useAuthContext()
    const { showSnackbar } = useSnack()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [status, setStatus] = useState<"deleting" | "creating_token" | null>(null)

    const handleClose = useCallback(() => {
        if (!status) {
            setAnchorEl(null)
        }
    }, [anchorEl, status])

    const canShowDelete = useMemo(() => {
        return data?.email !== currentUser?.email
    }, [data, currentUser])

    const handleDelete = useCallback(async () => {
        if (!!status) {
            return
        }
        setStatus("deleting")
        try {
            const res = await AuthService.deleteUserAuthDeleteUserPost({ requestBody: { email: data?.email } })
            if (res.success) {
                showSnackbar({
                    message: "User deleted",
                    severity: "success"
                })
                handleClose()
                if (onDelete) {
                    await onDelete()
                }
            } else {
                showSnackbar({
                    message: res.message || "Something went wrong while deleting",
                    severity: "error"
                })
            }
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error"
            })
        } finally {
            setStatus(null)
        }
    }, [data, handleClose, onDelete, status])

    const handleCreateLoginUrl = useCallback(async () => {
        if (!!status) {
            return
        }
        setStatus("creating_token")
        try {
            const res = await AdminService.getLoginTokenAdminGetLoginTokenPost({ requestBody: { email: data?.email } })
            if (res.token) {
                const url = new URL(window.location.origin)
                url.searchParams.set("token", res.token)
                navigator.clipboard.writeText(url.href)
                showSnackbar({
                    message: "URL created",
                    severity: "success"
                })
                handleClose()
            } else {
                showSnackbar({
                    message: "Token not created",
                    severity: "warning"
                })
            }
        } catch (err) {
            showSnackbar({
                message: (err as Error).message,
                severity: "error"
            })
        } finally {
            setStatus(null)
        }
    }, [data, handleClose, status])

    return (
        <>
            <IconButton onClick={(e) => { setAnchorEl(e.currentTarget) }} >
                <MoreVertIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => {
                handleClose()
            }} >
                <MenuList>
                    {canShowDelete && (
                        <MenuItem onClick={() => { handleDelete() }} >
                            <ListItemIcon>
                                {status === "deleting" ? <CircularProgress size={"inherit"} /> : (
                                    <DeleteIcon fontSize="small" />
                                )}
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                        </MenuItem>
                    )}
                    <MenuItem onClick={() => { handleCreateLoginUrl() }} >
                        <ListItemIcon>
                            {status === "creating_token" ? <CircularProgress size={"inherit"} /> : (
                                <TokenIcon fontSize="small" />
                            )}
                        </ListItemIcon>
                        <ListItemText>Create Login URL</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}