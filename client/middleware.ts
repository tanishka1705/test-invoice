import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {

    const path = req.nextUrl.pathname

    const publicPath = path === '/'
    const isExists = req.cookies.get('token')?.value

    if (!publicPath && isExists) return NextResponse.next()
    if (!publicPath && !isExists) return NextResponse.redirect(new URL('/', req.nextUrl))
}
export const config = {
    matcher: [
        '/',
        '/dashboard',
        '/generateInvoice',
        '/addClient',
        '/addProject',
        '/history'
    ]
}