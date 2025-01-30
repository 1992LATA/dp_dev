import React from 'react'
import TableUser from '../TableUser/TableUser'
import ModalUser from '../ModalUser/ModalUser'

export const BusinessProcess = () => {
  return (
    <div> 
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>
        <ModalUser 
		    headerTitle='Add New Process'
            buttonTriggerTitle='Add New'
            buttonSubmitTitle='Add'
            buttonColor='green'
		/>
    </div>
		
		
     <TableUser/>

        
    </div>
  )
}
export default BusinessProcess