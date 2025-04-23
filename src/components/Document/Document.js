import React from 'react'
import DocumentTable from '../Document/DocumentTable'
import DocumentUser from '../Document/DocumentUser'

export const Document = () => {
  return (
    <div> 
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>
        <DocumentUser 
		    headerTitle='Add New Document Type'
            buttonTriggerTitle='Add New'
            buttonSubmitTitle='Add'
            buttonColor='green'
		/>
    </div>
		
		
     < DocumentTable/>

        
    </div>
  )
}
export default Document