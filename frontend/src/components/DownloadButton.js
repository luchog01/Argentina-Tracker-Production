import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'

const DownloadButton = ({exportFunds}) => {
  return (
        <button onClick={() => exportFunds()}>
                <FontAwesomeIcon className='excel-icon' icon={faFileExcel} />
                Descargar
        </button>
  )
}

export default DownloadButton