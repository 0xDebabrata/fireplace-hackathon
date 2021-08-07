import React, {useEffect, useState} from 'react'
import { supabase } from '../utils/supabaseClient'

import Loader from "./Loading"
import Card from './Card'

const Files = ({ flag }) => {

    const [loading, setLoading] = useState(true)
    const [videos, setVideos] = useState(null)

    const getFiles = async () => {
        const { data, error } = await supabase
          .storage
          .from('videos')
          .list(`${supabase.auth.user().id}`, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' },
          })

        setVideos(data)
        setLoading(false)
    }

    useEffect(() => {
        getFiles()
    }, [flag])

     return (
         <div>
             {loading ? <Loader loading={loading} /> :
                 videos ?
                     videos.map(video => {
                         return <Card key={video.id} video={video} list={videos} setVideos={setVideos} />
                     }) :
                     <p>Upload a video to start a watchparty</p>
             }
         </div>
     )
}

export default Files
