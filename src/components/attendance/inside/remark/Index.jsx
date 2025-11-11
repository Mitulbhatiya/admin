import React from 'react'
import ManageRemark from './ManageRemark'
import AddRemark from './AddRemark'

const Index = () => {
    return (
        <>
            <div className='row'>
                <div className='col-12 col-sm-12 col-md-7 col-lg-8 mb-3'>
                    <ManageRemark />
                </div>
                <div className='col-12 col-sm-12 col-md-5 col-lg-4 mb-3'>
                    <AddRemark />
                </div>
            </div>
        </>
    )
}

export default Index