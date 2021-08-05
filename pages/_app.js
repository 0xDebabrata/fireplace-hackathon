import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }) {
  return ( 
      <>
        <Component {...pageProps} />
        <Toaster 
            toastOptions={{
                style: {
                    minWidth: "300px"
                }
            }} />
      </>
  )
}

export default MyApp
