import React, { useState } from 'react'
import {supabase} from '../utils/supabaseClient'

import styles from '../styles/Login.module.css'

const Login = () => {

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (email) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signIn({ email })
            if (error) throw error
            alert("Check your email to login")
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    const handleClick = (e) => {
        e.preventDefault()
        handleLogin(email)
    }

    return (
        <div>
            <input
                className={styles.input}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <button
                className={styles.button}
                onClick={(e) => handleClick(e)}
                disabled={loading}
            >
                {loading ? "Loading..." : "Login"}
            </button>
        </div>
    )
}

export default Login
