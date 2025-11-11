import React from 'react'
import AddSubUser from './AddSubUser'
import ManageSubUser from './ManageSubUser'

const Index = () => {
    return (
        <>
            <div className='row mt-5'>
                <div className=' col-12 mt-4 order-1 order-sm-0'>
                    <div className="d-flex justify-content-between">
                        <h4 className="adminhome_statistics_font">Sub admin</h4>
                        <div>
                            <i class='bx bxs-plus-circle bx-sm' style={{ color: "#47BE68", cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#AddSubUser"></i>
                        </div>
                    </div>

                    <div className='card p-4 mt-4' style={{ borderRadius: '15px' }}>
                        <ManageSubUser />
                    </div>
                </div>
            </div>
            <AddSubUser />
        </>
    )
}

export default Index