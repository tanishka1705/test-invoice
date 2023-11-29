import { getCookie } from "@/utils/cookies";
import axios from "axios";

const admin = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": 'application/json'
    }
})

export const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": 'application/json',
        Authorization: getCookie()
    }
})

export default admin