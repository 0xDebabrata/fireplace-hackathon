import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import WebSocket from 'isomorphic-ws'
import { supabase } from "../../../../utils/supabaseClient"
import toast from "react-hot-toast"

import Loader from "../../../../components/Loading"

import styles from "../../../../styles/Watch.module.css"

const Watch = () => {

    const ws = useRef(null)

    const [creator, setCreator] = useState(false)
    const [videoSrc, setVideoSrc] = useState(null)
    const [loading, setLoading] = useState(true)
    const [handlePlay, setHandlePlay] = useState(null)
    const [handlePause, setHandlePause] = useState(null)
    const [handleSeeked, setHandleSeeked] = useState(null)
    const [playheadStart, setPlayheadStart] = useState(0)
    const [show, setShow] = useState(true)

    const router = useRouter()

    const loadStartPosition = () => {
        const vid = document.getElementById("video")
        console.log(playheadStart)
        vid.currentTime = playheadStart
    }

    useEffect(() => {

        const clientId = supabase.auth.user().id

        if (!clientId) {
            alert("You need to be logged in")
            return
        }
            

        if (router.isReady) {
            const { creatorId, id, nickname } = router.query

            if (supabase.auth.session()) {
                if (creatorId === supabase.auth.user().id) {
                    setCreator(true)

                    let handlePlayFunc = () => {
                        const payload = {
                            "method": "play",
                            "partyId": id,
                            "clientId": creatorId
                        }

                        ws.current.send(JSON.stringify(payload))
                    }

                    setHandlePlay(() => handlePlayFunc) 

                    let handlePauseFunc = () => {
                        const payload = {
                            "method": "pause",
                            "partyId": id,
                            "clientId": creatorId
                        }

                        ws.current.send(JSON.stringify(payload))
                    }

                    setHandlePause(() => handlePauseFunc) 

                    let handleSeekedFunc = () => {
                        const vid = document.getElementById("video")
                        const playhead = vid.currentTime

                        const payload = {
                            "method": "seeked",
                            "partyId": id,
                            "clientId": creatorId,
                            "playhead": playhead
                        }

                        ws.current.send(JSON.stringify(payload))
                    }

                    setHandleSeeked(() => handleSeekedFunc)
                }
            }

            ws.current = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/${clientId}`)

            // Send join watchparty request to server
            const payload = {
                "method": "join",
                "clientId": clientId,
                "nickname": nickname,
                "partyId": id
            }

            ws.current.onopen = () => {
                ws.current.send(JSON.stringify(payload))
                console.log("join request sent")
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
        if (!ws.current) return;

        ws.current.onmessage = message => {
            const response = JSON.parse(message.data)

            if (response.method === "join") {

                console.log(response.party.src)

                setVideoSrc(response.party.src)
                setLoading(false)
                setPlayheadStart(response.party.playhead)

                const vid = document.getElementById("video")
                const partyId = response.party.id

                const updatePlayhead = () => {
                    const playhead = vid.currentTime

                    const payload = {
                        "method": "update",
                        "partyId": partyId,
                        "playhead": playhead
                    }

                    ws.current.send(JSON.stringify(payload))

                    setTimeout(updatePlayhead, 400)
                }

                const keepAlive = () => {

                    console.log("Connection check")

                    const payload = {
                        "method": "check",
                    }

                    ws.current.send(JSON.stringify(payload))

                    setTimeout(keepAlive, 60000)
                }

                if (creator) {
                    updatePlayhead()
                } else {
                    keepAlive()
                }

            }

            // New user joined watchparty
            if (response.method === "new") {
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
                toast(`${response.nickname} left!`, {
                    icon: "👋",
                    position: "top-right",
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                })
            }

            if (response.method === "play") {
                const vid = document.getElementById("video")

                if (!creator && !show) {
                    vid.play()
                }
            }

            if (response.method === "pause") {
                const vid = document.getElementById("video")
                if (!creator && !show) {
                    vid.pause()
                }
            }

            if (response.method === "seeked") {
                const vid = document.getElementById("video")
                vid.currentTime = response.playhead
            }
        }
    }, [creator, show])


    return (
        <div>
            {loading ? <Loader loading={loading} /> :
            <div className={styles.container}>
                { creator ?
                    <video 
                        id="video"
                        src={videoSrc} 
                        autoPlay={true} 
                        controls={true}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onSeeked={handleSeeked}
                        onLoadedMetadata={loadStartPosition}
                    />
                    :
                    <video 
                        id="video"
                        src={videoSrc} 
                        autoPlay={false} 
                        onPlay={() => setShow(false)}
                        controls={show}
                        onLoadedMetadata={loadStartPosition}
                    />
                }
            </div>
            }
        </div>
    )
}

export default Watch
