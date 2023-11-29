import { configureStore } from "@reduxjs/toolkit"
import user from "./user"
import invoice from "./invoice"
import project from "./project"
import client from "./client"
import history from './invoiceHistory'

const store = configureStore({
    reducer: {
        user,
        client,
        project,
        invoice,
        history
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store