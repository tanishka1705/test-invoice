import Cookies from "js-cookie";

export default function setCookie(token: string) {
    Cookies.set('token', token, { expires: 7 })
}

export const getCookie = () => {
    return Cookies.get('token')
}

export const removeCookie = () => {
    return Cookies.remove('token')
}