import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TableUser from '../TableUser/TableUser'

        

export const Documents = () => {
  
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllDocument')
      .then(response => {
        setDataSource(response.data)
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error)
      })
  }, [])

  const columns = [ 
    { label: 'Name', dataField: 'Name', dataType: 'string' },
    { label: 'Document', dataField: 'Document', dataType: 'string' },
    { label: 'Description', dataField: 'Description', dataType: 'string' },
    { label: 'Status', dataField: 'Status', dataType: 'string' },
    
    
  ]


  return (
    <div>

         <TableUser/>

    </div>
  )
}

export default Documents