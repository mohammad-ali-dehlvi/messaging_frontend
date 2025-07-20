import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { JSX, useCallback, useEffect, useMemo, useState } from "react";


interface CustomTableProps<T extends object> {
    loading?: boolean
    data: T[]
    columns: ({
        title: string;
        field: keyof T;
        render?: (data: T) => JSX.Element
    } | {
        title: string;
        field: string;
        render: (data: T) => JSX.Element
    })[]
    onLastPage?: () => void
}
export default function CustomTable<T extends Record<string, any>>(props: CustomTableProps<T>) {
    const { loading, columns, data: propsData, onLastPage } = props
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const data = useMemo(() => {
        if (loading) {
            return Array.from({ length: 10 }, () => ({})) as T[]
        }
        return propsData
    }, [propsData, loading])

    const handleOnLastPage = useCallback(() => {
        if (onLastPage) {
            onLastPage()
        }
    }, [onLastPage])

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        setPage(page)
    }

    const handleChangeRowsPerPage: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setRowsPerPage(Number(e.target.value))
    }

    useEffect(() => {
        const isLastPage = ((page + 1) * rowsPerPage) >= data.length
        if (isLastPage) {
            handleOnLastPage()
        }
    }, [page, data.length, rowsPerPage, handleOnLastPage])

    return (
        <Box>
            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                >
                    <TableHead>
                        <TableRow>
                            {columns.map((e) => {
                                return (
                                    <TableCell key={e.title} >
                                        <Typography>{e.title}</Typography>
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((d, i) => {
                            return (
                                <TableRow key={`data-${i}`} >
                                    {columns.map((c, j) => {
                                        return (
                                            <TableCell key={`cell-${i}-${j}`} >
                                                {loading ? <Skeleton variant="text" width={"100%"} /> :
                                                    c.render ? <>{c.render(d)}</> : (
                                                        <Typography>{d[c.field]}</Typography>
                                                    )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {!loading && data.length === 0 && (
                <Box sx={{ width: "100%", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }} >
                    <Typography>Data not available</Typography>
                </Box>
            )}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>

    )
}