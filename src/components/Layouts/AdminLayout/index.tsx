import { Box, Divider, Drawer, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { Outlet } from "react-router";
import AppBar from "../../AppBar";
import URLDrawer from "../../URLDrawer";
import MenuIcon from '@mui/icons-material/Menu';

interface AdminLayoutProps {
    prefix: string;
}

export default function AdminLayout(props: AdminLayoutProps) {
    const { prefix } = props;

    const theme = useTheme()
    const isLarge = useMediaQuery(theme.breakpoints.up("md"))
    const [drawerOpen, setDrawerOpen] = useState(true)
    const [appBarRect, setAppBarRect] = useState<DOMRect | null>(null)

    const urls = useMemo(() => {
        return [
            {
                url: `/${prefix}/users`,
                title: "Users",
            },
        ];
    }, [prefix]);

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "stretch",
                }}
            >
                <AppBar insideAdmin onLayoutChange={setAppBarRect}
                    rightComponent={
                        !isLarge ? (
                            <IconButton onClick={() => { setDrawerOpen(true) }} >
                                <MenuIcon />
                            </IconButton>
                        ) : null
                    }
                />
                <URLDrawer title="Admin" urls={urls} open={drawerOpen} onClose={() => { setDrawerOpen(false) }} />
                <Box sx={{ flex: 1, p: "15px", mt: !!appBarRect?.height ? `${appBarRect.height}px` : null }}>
                    <Outlet />
                </Box>
            </Box>
        </>
    );
}
