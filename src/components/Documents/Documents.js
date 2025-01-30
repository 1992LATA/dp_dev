import React, { useState, useEffect } from 'react'
import { Grid } from 'smart-webcomponents-react/grid'
import axios from 'axios'

        

export const Documents = () => {
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get('http://nhtridevsrv.nht.gov.jm:8777/api/v1/GetAllBusinessProcesses')
      .then(response => {
        setDataSource(response.data)
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error)
      })
  }, [])

  const columns = [ 
    { label: 'Owner', dataField: 'Owner', dataType: 'string' },
    { label: 'Document', dataField: 'Document', dataType: 'string' },
    { label: 'Description', dataField: 'Description', dataType: 'string' },
    { label: 'Status', dataField: 'Status', dataType: 'string' },
    
    
  ]

  return (
    <div>
      <Grid dataSource={dataSource} columns={columns} />
    </div>
  )
}

export default Documents