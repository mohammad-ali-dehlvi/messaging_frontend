import { InputAdornment, SxProps, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search'
import { useCallback, useEffect, useState } from "react"


interface DebounceSearchProps {
    onChange: (value: string) => void
    debounceMilliSecond: number
    sx?: SxProps
}

export default function DebounceSearch(props: DebounceSearchProps) {
    const { onChange, debounceMilliSecond, sx } = props
    const [value, setValue] = useState('')

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null
        if (value) {
            timeout = setTimeout(() => {
                onChange(value)
                timeout = null
            }, debounceMilliSecond)
        }
        return () => {
            if (timeout !== null) {
                clearTimeout(timeout)
            }
        }
    }, [value, debounceMilliSecond, onChange])

    return (
        <TextField
            fullWidth
            variant="outlined"
            label="Search Friend"
            placeholder="Search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start" >
                            <SearchIcon />
                        </InputAdornment>
                    )
                }
            }}
            sx={sx}
        />
    )
}