import { Avatar, Box, Button, ButtonBase, Menu, MenuItem, AppBar as MuiAppBar, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useAuthContext } from "../../context/AuthContext"
import { JSX, useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { useWebSocketContext } from "../../context/WebSocketContext"

interface AppBarProps {
    title?: string
    onLayoutChange?: (data: DOMRect) => void
    leftComponent?: JSX.Element
    rightComponent?: JSX.Element | null
    insideAdmin?: boolean
}

export default function AppBar(props: AppBarProps) {
    const { title, leftComponent, rightComponent, insideAdmin, onLayoutChange } = props
    const { currentUser, logout } = useAuthContext()
    const { webSocketStatus, connectSocket } = useWebSocketContext()
    const appBarRef = useRef<HTMLElement | null>(null)
    const [appBarRect, setAppBarRect] = useState<DOMRect | undefined>(undefined)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const theme = useTheme()
    const isLarge = useMediaQuery(theme.breakpoints.up("md"))

    const handleLogout = useCallback(async () => {
        await logout()
        setAnchorEl(null)
    }, [logout, anchorEl])

    useEffect(() => {
        if (onLayoutChange && appBarRect) {
            onLayoutChange(appBarRect)
        }
    }, [onLayoutChange, appBarRect])

    useEffect(() => {
        if (!appBarRef.current) {
            return
        }
        const resizeObserver = new ResizeObserver(() => {
            const rect = appBarRef.current?.getBoundingClientRect()
            setAppBarRect(rect)
        })
        resizeObserver.observe(appBarRef.current)
        return () => {
            resizeObserver.disconnect()
        }
    }, [appBarRef.current])

    return (
        <>
            <MuiAppBar sx={{ bgcolor: "#FFF", color: "#000" }} ref={appBarRef} >
                <Toolbar sx={{ gap: "10px" }} >
                    {title && (
                        <Typography variant="h5" >{title}</Typography>
                    )}
                    {rightComponent}
                    <Box sx={{ flex: 1 }} />
                    {leftComponent}
                    <Box sx={{ position: "relative" }} >
                        <Tooltip title={webSocketStatus === "CLOSE" ? "Closed" : webSocketStatus === "ERROR" ? "Error" : webSocketStatus === "OPEN" ? "Connected" : "Connecting"} >
                            <Box
                                component={ButtonBase}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (webSocketStatus !== "OPEN") {
                                        connectSocket()
                                    }
                                }}
                                sx={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    bgcolor: webSocketStatus === "CLOSE" ?
                                        "black" :
                                        webSocketStatus === "ERROR" ?
                                            "red" : webSocketStatus === "OPEN" ?
                                                "green" : "pink",
                                    position: "absolute",
                                    top: "0px",
                                    left: "0px",
                                    zIndex: 20
                                }}
                            />
                        </Tooltip>

                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "5px", p: "5px", borderRadius: "5px" }} component={ButtonBase} onClick={(e) => {
                            setAnchorEl(e.currentTarget)
                        }} >
                            <Box>
                                {currentUser?.photoURL ?
                                    <Avatar src={currentUser?.photoURL} alt={currentUser?.email || "User"} /> :
                                    <Avatar>{(currentUser?.displayName || currentUser?.email || "U")[0].toUpperCase()}</Avatar>
                                }
                            </Box>
                            {isLarge && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ lineHeight: 1, textAlign: "left" }} >{currentUser?.displayName || currentUser?.email}</Typography>
                                    {currentUser?.displayName && (
                                        <Typography variant="caption" sx={{ lineHeight: 1, textAlign: "left" }} >{currentUser?.email}</Typography>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Toolbar>
            </MuiAppBar>

            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => { setAnchorEl(null) }}
            >
                {currentUser?.email === "alidehlvi082@gmail.com" && !insideAdmin && (
                    <Link to={"/admin/users"} style={{ color: "inherit", textDecoration: "none" }} >
                        <MenuItem  >Admin</MenuItem>
                    </Link>
                )}
                {insideAdmin && (
                    <Link to={"/users"} style={{ color: "inherit", textDecoration: "none" }}>
                        <MenuItem  >Users</MenuItem>
                    </Link>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    )
}