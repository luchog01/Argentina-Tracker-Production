import React from 'react'
import './Loader.css'
import ClipLoader from "react-spinners/ClipLoader";

const Loader = () => {
  return (
        <div className='loader-container'>
                <ClipLoader
                        color={"#9a9a9a"}
                        loading={true}
                        size={100}
                />
        </div>
        
  )
}

export default Loader