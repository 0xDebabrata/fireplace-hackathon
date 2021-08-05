import React from 'react'

const Loader = ({ loading }) => {

    if (loading) {
        return (
            <div className="loader">
            </div>
        )
    } else {
        return null
    }
}

export default Loader
