import { Box, Divider, Drawer, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useState } from "react";
import { NavLink } from "react-router";

const drawerWidth = 240;

interface URLDrawerProps {
    title?: string
    urls: {
        url: string;
        title: string;
    }[]
    open?: boolean
    onClose?: () => void
}

export default function URLDrawer(props: URLDrawerProps) {
    const { urls, title, open = true, onClose } = props
    const theme = useTheme()
    const isLarge = useMediaQuery(theme.breakpoints.up("md"))

    const handleDrawerClose = () => {
        onClose?.call({})
    };

    return (
        <>
            <Drawer
                variant={isLarge ? "permanent" : "temporary"}
                open={open}
                onClose={handleDrawerClose}
                ModalProps={{
                    keepMounted: false,
                }}
                sx={{
                    // display: { xs: "block", sm: "none" },
                    width: drawerWidth,
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                        overflowX: "hidden",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch"
                    },
                }}
                slotProps={{
                    root: {
                        keepMounted: true, // Better open performance on mobile.
                    },
                }}
            >
                <Toolbar>
                    {title && (
                        <Typography variant="h5">{title}</Typography>
                    )}
                </Toolbar>
                <Divider />
                <Box sx={{ mt: "10px", flex: 1, overflowY: "auto", p: "10px", display: "flex", flexDirection: "column", gap: "5px", alignItems: "stretch" }}>
                    {urls.map((e) => {
                        return (
                            <Box
                                key={e.url}
                                component={NavLink}
                                to={e.url}
                                sx={{
                                    display: "block",
                                    textDecoration: "none",
                                    px: "10px",
                                    py: "5px",
                                    color: "#000",
                                    border: "1px solid rgba(0,0,0,0.2)",
                                    borderRadius: "5px",
                                    "&:hover": {
                                        bgcolor: "rgba(0,0,0,0.2)"
                                    },
                                    "&.active": {
                                        fontWeight: 600,
                                        bgcolor: "rgba(0,0,0,0.1)"
                                    },
                                    "&.active .title": {
                                        fontWeight: 500
                                    }
                                }} >
                                <Typography className="title" >{e.title}</Typography>
                            </Box>
                        )
                    })}
                </Box>
            </Drawer>
        </>
    )
}