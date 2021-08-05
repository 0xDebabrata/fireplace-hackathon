import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import WebSocket from 'isomorphic-ws'
import { supabase } from "../../../../utils/supabaseClient"
import uuid from 'react-uuid'

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
            const { creatorId, id } = router.query

            if (supabase.auth.session()) {
                if (creatorId === supabase.auth.user().id) {
                    setCreator(true)
                }
            }

            // Send join watchparty request to server
            const payload = {
                "method": "join",
                "clientId": clientId,
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
