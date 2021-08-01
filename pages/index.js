import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabaseClient'

import Login from '../components/Login.js'
import Files from '../components/Files.js'
import UploadButton from '../components/UploadButton'

import styles from '../styles/Home.module.css'

export default function Home() {
    
    const [session, setSession] = useState(null)

    useEffect(() => {
        setSession(supabase.auth.session())

        supabase.auth.onAuthStateChange((event, session) => {
            setSession(session)
        })

    }, [])

    return (
        <div>
            {!session && <Login />}
            {session && (
                <>
                    <Files />
                    <UploadButton />
                </>
            )}
        </div>
    )
}
