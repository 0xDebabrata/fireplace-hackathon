import React, {useEffect, useState} from 'react'
import { supabase } from '../utils/supabaseClient'

const Files = () => {

    const [videos, setVideos] = useState(null)

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
    }

    useEffect(() => {
        getFiles()
    })

     return (
         <div>
         </div>
     )
}

export default Files
