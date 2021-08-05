import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import WebSocket from 'isomorphic-ws'
import { supabase } from "../../../../utils/supabaseClient"
import uuid from 'react-uuid'
import toast from "react-hot-toast"

import Loader from "../../../../components/Loading"

import styles from "../../../../styles/Watch.module.css"

const Watch = () => {

    const [creator, setCreator] = useState(false)
    const [clientId, setClientId] = useState(null)
    const [videoSrc, setVideoSrc] = useState(null)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {

        if (supabase.auth.session()) {
            setClientId(supabase.auth.user().id)
            console.log("supa", clientId)
        } else {
            setClientId(uuid())
            console.log("uuid", clientId)
        }

        const ws = new WebSocket(`ws://localhost:8080/${clientId}`)

        if (router.isReady) {
            const { creatorId, id, nickname } = router.query

            if (supabase.auth.session()) {
                if (creatorId === supabase.auth.user().id) {
                    setCreator(true)
                }
            }

            // Send join watchparty request to server
            const payload = {
                "method": "join",
                "clientId": clientId,
                "nickname": nickname,
                "partyId": id
            }

            ws.onopen = () => {
                ws.send(JSON.stringify(payload))
            }

        }

        ws.onmessage = message => {
            const response = JSON.parse(message.data)

            if (response.method === "join") {
                console.log(response)
                setVideoSrc(response.party.src)
                setLoading(false)
            }

            // New user joined watchparty
            if (response.method === "new") {
                console.log(response.nickname + " joined!")
                toast(`${response.nickname} joined!`, {
                    icon: "✌️",
                    position: "top-right",
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                })
            }

            if (response.method === "leave") {
                console.log(response.nickname + " left!")
                toast(`${response.nickname} left!`, {
                    icon: "👋",
                    position: "top-right",
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                })
            }

        }

        return () => {
            ws.close()
        }

    }, [router.isReady, router.query, clientId])

    return (
        <div>
            {loading ? <Loader loading={loading} /> :
            <div className={styles.container}>
                <video 
                    id="video"
                    src={videoSrc} 
                    autoPlay={false} 
                    controls={true}
                />
            </div>
            }
        </div>
    )
}

export default Watch
