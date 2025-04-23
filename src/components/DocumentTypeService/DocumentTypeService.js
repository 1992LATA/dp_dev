import React from 'react'
import DocumentTypeServiceForm from '../DocumentTypeService/DocumentTypeServiceForm.js';
import  DocumentServiceTypeTable  from '../DocumentTypeService/DocumentServiceTypeTable.js';



export const  DocumentTypeService = () => {
  return (
    <div> 
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '10px'}}>
        <DocumentTypeServiceForm 
		    headerTitle='Add New Document Type'
            buttonTriggerTitle='Add New'
            buttonSubmitTitle='Add'
            buttonColor='green'
		/>
    </div>
		
		
     <DocumentServiceTypeTable/>

        
    </div>
  )
}
export default  DocumentTypeService
