import { useRouter } from 'next/router'
import WebSocket from 'isomorphic-ws'
import { supabase } from '../../utils/supabaseClient'
import { useEffect, useState } from 'react'

import styles from '../../styles/Party.module.css'

const Party = () => {

    const [videoSrc, setVideoSrc] = useState(null)
    const [loading1, setLoading1] = useState(true)
    const [loading2, setLoading2] = useState(true)

    const router = useRouter()

    const getVideoSrc = async (id) => {
        const { data: watchparties, error } = await supabase
            .from("watchparties")
            .select("video_url")
            .eq("id", id)

        if (!error) {
            setVideoSrc(watchparties[0].video_url)
            setLoading1(false)
        } else {
            console.log(error)
            alert("There was a problem")
        }
    }

    useEffect(() => {

        const clientId = supabase.auth.user().id
        const ws = new WebSocket(`ws://localhost:8080/${clientId}`)

        if (router.isReady) {
            const { creatorId, id } = router.query

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
                    }
                }

            } else {
                // Join watchparty
            }
        }

        ws.onmessage = message => {
            const response = JSON.parse(message.data)

            if (response.method === "create") {
                console.log(response.party)
            }
        }

        return () => {
            ws.close()
        }

    })

    return (
        <div>
            {loading1 || loading2 && (
                <div className={styles.nicknameContainer}>
                    <input placeholder="Enter a nickname" />
                    <button
                        className={styles.button}
                    >
                        Join watchparty
                    </button>
                </div>
            )}
        </div>
    )
}

export default Party
