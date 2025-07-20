import { Box, Tab, Tabs, Typography } from "@mui/material";
import { FriendRequestStatus } from "../../../client";
import { useRef, useState } from "react";
import { TabPanel } from "../../../components/Tabs";
import FriendsTable from "./components/FriendsTable";


export default function Requests() {
    const tabs = useRef(Object.keys(FriendRequestStatus))
    const [tabValue, setTabValue] = useState(tabs.current[0])

    return (
        <>
            <Box>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} >
                    {tabs.current.map((key) => {
                        return (
                            <Tab key={key} label={key} value={key} />
                        )
                    })}
                </Tabs>
                {tabs.current.map((key) => {
                    return (
                        <TabPanel key={`tab-panel-${key}`} index={key} value={tabValue} >
                            <FriendsTable status={key as FriendRequestStatus} />
                        </TabPanel>
                    )
                })}
            </Box>
        </>
    )
}