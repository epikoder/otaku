import { DataStore } from "@utils/storage";
import { createContext, ReactNode, useContext, useState } from "react";

class JournalDataStore extends DataStore<Journal> {}

class ChatDataStore extends DataStore<Chat> {}

export const __DataStoreContext__ = createContext({
    chat: new ChatDataStore("chats"),
    journal: new JournalDataStore("journal"),
});

export default function DataStoreProvider(
    { children }: { children: ReactNode },
) {
    const datastore = useContext(__DataStoreContext__);

    return (
        <__DataStoreContext__.Provider value={datastore}>
            {children}
        </__DataStoreContext__.Provider>
    );
}
