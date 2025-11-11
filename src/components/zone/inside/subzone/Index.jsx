import React from 'react'
import AddSubZone from './AddSubZone'
import ManageSubZone from './ManageSubZone'

const Index = () => {
    return (
        <>
            <div className='row mt-5'>
                <div className=' col-12 mt-4 order-1 order-sm-0'>
                    <div className="d-flex justify-content-between">
                        <h4 className="adminhome_statistics_font">SubZone</h4>
                        {/* <div>
                            <i class='bx bxs-plus-circle bx-sm' style={{ color: "#47BE68", cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#AddAdmin"></i>
                        </div> */}
                    </div>

                    <div className='row'>
                        <div className='col-12 cool-sm-12 col-md-8 col-lg-8'>
                            <div className='card p-4 mt-4' style={{ borderRadius: '15px' }}>
                                <ManageSubZone />
                            </div>
                        </div>
                        <div className='col-12 cool-sm-12 col-md-4 col-lg-4'>
                            <div className='card p-4 mt-4' style={{ borderRadius: '15px' }}>
                                <AddSubZone />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index