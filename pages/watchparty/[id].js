import WebSocket from 'isomorphic-ws'
import { supabase } from '../../utils/supabaseClient'
import { useEffect } from 'react'


const Party = () => {

    const clientId = supabase.auth.user().id

    useEffect(() => {

        const ws = new WebSocket(`ws://localhost:8080/${clientId}`)

        ws.onopen = () => {
            console.log("connection open")
        }

        ws.onmessage = message => {
            const result = JSON.parse(message.data)
            console.log(result)
        }

        return () => {
            ws.close()
        }

    })

    return (
        <div>
        </div>
    )
}

export default Party
