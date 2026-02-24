import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database.types'

type UserRole = Database['public']['Tables']['profiles']['Row']['role']

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    const protectedPaths = ['/admin', '/criador', '/assessor']
    const isProtectedPath = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    )

    if (isProtectedPath && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Auth routes - redirect to dashboard if already logged in
    const authPaths = ['/login', '/forgot-password', '/reset-password']
    const isAuthPath = authPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    )

    if (isAuthPath && user) {
        const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = (profileData as { role?: UserRole } | null)?.role
        const url = request.nextUrl.clone()

        // Redirect based on role (admin, criador, acessor)
        switch (role) {
            case 'admin':
                url.pathname = '/admin'
                break
            case 'assessor':
            case 'acessor':
            case 'advisor':
                url.pathname = '/assessor'
                break
            case 'criador':
            default:
                url.pathname = '/criador'
        }

        return NextResponse.redirect(url)
    }

    // Role-based access control
    if (user && isProtectedPath) {
        const { data: profileData } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = (profileData as { role?: UserRole } | null)?.role

        // Check if user has access to the current path
        if (request.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = role === 'assessor' || role === 'acessor' || role === 'advisor' ? '/assessor' : '/criador'
            return NextResponse.redirect(url)
        }

        if (request.nextUrl.pathname.startsWith('/assessor') && role !== 'assessor' && role !== 'acessor' && role !== 'advisor' && role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/criador'
            return NextResponse.redirect(url)
        }

        if (request.nextUrl.pathname.startsWith('/criador') && role !== 'criador' && role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = role === 'assessor' || role === 'acessor' || role === 'advisor' ? '/assessor' : '/criador'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
