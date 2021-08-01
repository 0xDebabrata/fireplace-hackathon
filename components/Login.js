import React, { useState } from 'react'
import {supabase} from '../utils/supabaseClient'
import toast from 'react-hot-toast'

import styles from '../styles/Login.module.css'

const Login = () => {

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (email) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signIn({ email })
            if (error) throw error 
        } catch (error) {
            console.log(error)
            throw new Error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleClick = async (e) => {
        e.preventDefault()

        const promise = handleLogin(email) 

        toast.promise(promise, {
            loading: "Sending email",
            success: "Check your email for login link",
            error: "Error logging in"
        })
    }

    return (
        <div className={styles.parent}>
            <div className={styles.container}>
                <h1 className={styles.header}>Login</h1>
                <div className={styles.wrapper}>
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
                        {loading ? "Loading" : "Login"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
