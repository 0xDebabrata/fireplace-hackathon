import React, {useEffect, useState} from 'react'
import { supabase } from '../utils/supabaseClient'

import Card from './Card'

const Files = () => {

    const [videos, setVideos] = useState(null)
    const [loading, setLoading] = useState(true)

    const getFiles = async () => {
        const { data, error } = await supabase
          .storage
          .from('videos')
          .list(`${supabase.auth.user().id}`, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'asc' },
          })

        setVideos(data)
        setLoading(false)
    }

    useEffect(() => {
        getFiles()
    }, [])

     return (
         <div>
             {loading ? "Loading" :
                 videos.map(video => {
                     return <Card key={video.id} video={video} list={videos} setVideos={setVideos} />
                 })
             }
         </div>
     )
}

export default Files
