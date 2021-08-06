import { useRouter } from 'next/router'
import WebSocket from 'isomorphic-ws'
import { supabase } from '../../../utils/supabaseClient'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import Navbar from "../../../components/Navbar"
import Loader from '../../../components/Loading'

import styles from '../../../styles/Create.module.css'

const Create = () => {

    const [videoSrc, setVideoSrc] = useState(null)
    const [loading, setLoading] = useState(true)
    const [nickname, setNickname] = useState("")
    const [link, setLink] = useState(null)
    const [connected, setConnected] = useState(false)

    const router = useRouter()

    const getVideoSrc = async (id) => {
        const { data: watchparties, error } = await supabase
            .from("watchparties")
            .select("video_url")
            .eq("id", id)

        if (!error) {
            setVideoSrc(watchparties[0].video_url)
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
        const ws = new WebSocket(`wss://ec2-18-217-250-58.us-east-2.compute.amazonaws.com/8080/${clientId}`)

        if (router.isReady) {
            const { creatorId, id } = router.query
            setLink(`/${creatorId}/${id}/join/`)

            getVideoSrc(id)

            if (creatorId === clientId) {
                // Create watchparty

                const payload = {
                    "method": "create",
                    "partyId": id,
                    "src": videoSrc,
                    "clientId": clientId
                }

                if (videoSrc) {
                    ws.onopen = () => {
                        ws.send(JSON.stringify(payload))
                        console.log("create request sent")
                        setConnected(true)
                    }
                }

            }
        }

        ws.onmessage = message => {
            const response = JSON.parse(message.data)

            if (response.method === "create") {
                setLoading(false)
                console.log(response.party)
            }
        }

        return () => {
            if (connected) {
                ws.close()
            }

            console.log("closed")
        }

    }, [router.isReady, router.query, videoSrc, connected])

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
                        <input id="link" type="text" readOnly={true} value={`http://localhost:3000${link}`} className={styles.url} />
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
