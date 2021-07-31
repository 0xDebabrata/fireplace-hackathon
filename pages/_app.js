import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }) {
  return ( 
      <>
        <Navbar />
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
