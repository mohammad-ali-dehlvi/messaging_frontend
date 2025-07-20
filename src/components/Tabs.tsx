import { Box, SxProps } from "@mui/material"
import { ReactNode, useEffect, useRef, useState } from "react"


interface TabPanelProps<T> {
    index: T
    value: T
    children: ReactNode
    sx?: SxProps
}

export function TabPanel<T>(props: TabPanelProps<T>) {
    const { index, value, sx, children } = props
    const [focused, setFocused] = useState(false)

    useEffect(() => {
        if (index === value) {
            setFocused(true)
        }
    }, [index, value])

    return (
        <>
            <Box sx={{ ...sx, display: index === value ? undefined : "none" }} >
                {focused && <>{children}</>}
            </Box>
        </>
    )
}