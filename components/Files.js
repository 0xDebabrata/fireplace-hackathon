import React from 'react'
import { supabase } from '../utils/supabaseClient'

const Files = () => {
     return (
         <div>
             <button onClick={() => supabase.auth.signOut()}>
                 Sign Out
             </button>
         </div>
     )
}

export default Files
