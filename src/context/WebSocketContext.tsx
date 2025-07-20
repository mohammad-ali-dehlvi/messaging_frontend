import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuthContext } from "./AuthContext";

type WebSocketStatus = "OPEN" | "CLOSE" | "ERROR" | null

interface WebSocketContextInterface {
    subscribeCallback: (callback: CallbackType) => string
    unsubscribeCallback: (uid: string) => void
    connectSocket: () => Promise<void>
    webSocketStatus: WebSocketStatus
}

const WebSocketContext = createContext({} as WebSocketContextInterface)

export const useWebSocketContext = () => useContext(WebSocketContext)

interface WebSocketContextProviderProps {
    children: ReactNode
}

type CallbackType = (e: MessageEvent) => void

export default function WebSocketContextProvider(props: WebSocketContextProviderProps) {
    const callbacks = useRef<{ [key: string]: CallbackType }>({})
    const websocket = useRef<WebSocket | null>(null)
    const [webSocketStatus, setWebSocketStatus] = useState<WebSocketStatus>(null)
    const { currentUser } = useAuthContext()

    const subscribeCallback = useCallback((callback: CallbackType) => {
        const err = new Error()
        const uid = `${err.stack}_${Date.now()}_${Math.random()}`
        callbacks.current[uid] = callback
        return uid
    }, [callbacks.current])

    const unsubscribeCallback = useCallback((uid: string) => {
        if (uid in callbacks.current) {
            delete callbacks.current[uid]
        }
    }, [callbacks.current])

    const connectSocket = useCallback(async () => {
        if (!currentUser) return
        const token = await currentUser?.getIdToken(true)
        websocket.current = new WebSocket(`${process.env.REACT_APP_BACKEND_SOCKET_URL}/message?token=${token}`)

        websocket.current.onmessage = (e) => {
            const obj = callbacks.current
            Object.keys(obj).forEach((uid) => {
                const func = obj[uid]
                func(e)
            })
        }
        websocket.current.onopen = (e) => {
            setWebSocketStatus("OPEN")
        }
        websocket.current.onerror = (e) => {
            setWebSocketStatus("ERROR")
        }
        websocket.current.onclose = (e) => {
            setWebSocketStatus("CLOSE")
        }
    }, [currentUser, callbacks.current, websocket.current, webSocketStatus])

    useEffect(() => {
        connectSocket()

        return () => {
            callbacks.current = {}
            websocket.current?.close()
        }
    }, [currentUser])

    const contextValue = useMemo(() => {
        return {
            subscribeCallback,
            unsubscribeCallback,
            connectSocket,
            webSocketStatus
        }
    }, [subscribeCallback, unsubscribeCallback, connectSocket, webSocketStatus])

    return (
        <WebSocketContext.Provider value={contextValue} >
            {props.children}
        </WebSocketContext.Provider>
    )
}