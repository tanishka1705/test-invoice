import React from 'react'
import InvoiceNumber from './InvoiceNumber'
import SelectClient from './SelectClient'

const MiddleMain = () => {
  return (
    <div className='xs:grid xs:grid-cols-1 md:grid container md:grid-cols-2 my-[2rem]'>
        {/* <InvoiceNumber /> */}
        <div></div>
        <SelectClient />
    </div>
  )
}

export default MiddleMain