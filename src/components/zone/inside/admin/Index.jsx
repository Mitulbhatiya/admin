import React from 'react'
import ManageAdminUser from './ManageAdminUser'
import AddAdminUser from './AddAdminUser'

const Index = () => {
    return (
        <>
            <div className='row mt-5'>
                <div className=' col-12 mt-4 order-1 order-sm-0'>
                    <div className="d-flex justify-content-between">
                        <h4 className="adminhome_statistics_font">Admin</h4>
                        <div>
                            <i class='bx bxs-plus-circle bx-sm' style={{ color: "#47BE68", cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#AddAdmin"></i>
                        </div>
                    </div>

                    <div className='card p-4 mt-4' style={{ borderRadius: '15px' }}>
                        <ManageAdminUser />
                    </div>
                </div>
            </div>
            <AddAdminUser />
        </>
    )
}

export default Index