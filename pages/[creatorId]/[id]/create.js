import { useRouter } from 'next/router'
import WebSocket from 'isomorphic-ws'
import { supabase } from '../../../utils/supabaseClient'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import Navbar from "../../../components/Navbar"
import Loader from '../../../components/Loading'

import styles from '../../../styles/Create.module.css'

const Create = () => {

    const ws = useRef(null)
    const [loading, setLoading] = useState(true)
    const [nickname, setNickname] = useState("")
    const [link, setLink] = useState(null)
    const [connected, setConnected] = useState(false)

    const router = useRouter()

    // Get video signed URL and send create request to server
    const createWatchparty = async (id, clientId) => {
        const { data: watchparties, error } = await supabase
            .from("watchparties")
            .select("video_url")
            .eq("id", id)

        if (!error) {

            ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/${clientId}`)

            const payload = {
                "method": "create",
                "partyId": id,
                "src": watchparties[0].video_url,
                "clientId": clientId
            }

            ws.current.onopen = () => {
                ws.current.send(JSON.stringify(payload))
                console.log("create request sent")
                setConnected(true)
            }

        } else {
            console.log(error)
            alert("There was a problem")
        }
    }

    const handleClick = () => {
        if (!nickname) {
            // toast alert
            toast.error("Please enter a nickname")
        } else {
            // Join watchparty
            router.push(`${link}${nickname}/`)
        }
    }

    const copyLink = () => {
        const link = document.querySelector("#link")
        link.select()
        document.execCommand("copy")
        toast.success("Link copied successfully!")
    }

    useEffect(() => {

        const clientId = supabase.auth.user().id

        if (router.isReady) {
            const { creatorId, id } = router.query
            setLink(`/${creatorId}/${id}/join/`)

            if (creatorId === clientId) {
                // Create watchparty
                createWatchparty(id, clientId)
            }
        }

        return () => {
            if (ws.current) {
                ws.current.close()
                console.log("connection closed")
            }
        }

    }, [router.isReady, router.query])

    useEffect(() => {
        if (!connected) return

        ws.current.onmessage = message => {
            const response = JSON.parse(message.data)

            if (response.method === "create") {
                setLoading(false)
                console.log(response.party)
            }
        }

    })


    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <input 
                        className={styles.input}
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                        placeholder="Enter a nickname" />
                    <button
                        onClick={handleClick}
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Creating watchparty" : "Join watchparty"}
                    </button>
                </div>

                <Loader loading={loading} />
                {!loading && (
                    <div className={styles.wrapper}>
                        <p>Share the following link</p>
                        <input id="link" type="text" readOnly={true} value={`https://fireplace-debabratajr.vercel.app/${link}`} className={styles.url} />
                        <button 
                            onClick={copyLink}
                            className={styles.copyButton}>
                            Copy link
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default Create 
