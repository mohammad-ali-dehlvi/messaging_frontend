
type LocalStorageKey = "TOKEN"

export function setLocalStorage(key: LocalStorageKey, value: string) {
    localStorage.setItem(key, value)
}

export function getLocalStorage(key: LocalStorageKey) {
    return localStorage.getItem(key)
}

export function deleteLocalStorageKey(key: LocalStorageKey) {
    localStorage.removeItem(key)
}

export function deleteAllLocalStorageKeys() {
    localStorage.clear()
}