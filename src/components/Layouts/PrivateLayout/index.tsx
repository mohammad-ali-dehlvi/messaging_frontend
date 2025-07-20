import { useMemo, useState } from "react";
import AppBar from "../../AppBar";
import { Box, Chip, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router";
import MenuIcon from '@mui/icons-material/Menu';
import URLDrawer from "../../URLDrawer";


interface PrivateLayoutProps {

}

export default function PrivateLayout(props: PrivateLayoutProps) {
    const [appBarRect, setAppBarRect] = useState<DOMRect | null>(null)
    const theme = useTheme()
    const isLarge = useMediaQuery(theme.breakpoints.up("md"))
    const [drawerOpen, setDrawerOpen] = useState(true)

    const urls = useMemo(() => {
        return [
            {
                url: `/users`,
                title: "Users",
            },
            {
                url: `/search`,
                title: "Search"
            },
            {
                url: `/requests`,
                title: "Requests"
            }
        ];
    }, []);

    return (
        <>
            <AppBar
                onLayoutChange={setAppBarRect}
                rightComponent={
                    !isLarge ? (
                        <IconButton onClick={() => { setDrawerOpen(true) }} >
                            <MenuIcon />
                        </IconButton>
                    ) : null
                }
            />
            <Box sx={{
                mt: appBarRect ? `${appBarRect.height}px` : undefined, width: "100%",
                height: `calc(100vh - ${appBarRect?.height || 0}px)`,
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                overflowY: "auto",
                overflowX: "hidden"
            }}>
                <URLDrawer urls={urls} open={drawerOpen} onClose={() => { setDrawerOpen(false) }} />
                <Box sx={{ p: "10px", flex: 1 }} >
                    <Outlet />
                </Box>
            </Box>

        </>
    )
}