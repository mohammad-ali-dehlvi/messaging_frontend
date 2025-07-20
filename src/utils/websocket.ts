import { getLocalStorage } from "./localStorage"

export type MessageCallbackType = (e: MessageEvent) => void
export type CloseCallbackType = (e: CloseEvent) => void

export enum WebSocketTypes {
    FRIEND_REQUEST_REMOVED = "FRIEND_REQUEST_REMOVED",
    FRIEND_REQUEST_SENT = "FRIEND_REQUEST_SENT",
    FRIEND_REQUEST_RECEIVED = "FRIEND_REQUEST_RECEIVED",
    FRIEND_REQUEST_ANSWER = "FRIEND_REQUEST_ANSWER",
    MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
    MESSAGE_SENT = "MESSAGE_SENT"
}