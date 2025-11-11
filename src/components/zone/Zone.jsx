import React from 'react'
import AddZone from './AddZone'
import { useSelector } from 'react-redux'
import { spinner } from '../../constant/alert'
import ManageZone from './v2/ManageZone'

const Zone = () => {
    const adminReducer = useSelector(state => state.adminReducer)
    return (
        <>
            <div className='container-fluid navbar_fixed_container admin_home'>
                {
                    adminReducer.get_locationData_success === true
                        && adminReducer.get_userData_success === true
                        && adminReducer.get_zone_success === true
                        && adminReducer.get_subzone_success === true
                        && adminReducer.get_user_success === true
                        && adminReducer.get_detailsData_attendance_success === true
                        ? <>
                            <div className='row mt-5'>
                                <div className=' col-12 mt-4 order-1 order-sm-0'>
                                    <div className="d-flex justify-content-between">
                                        <h4 className="adminhome_statistics_font">Zone 🛕</h4>
                                        <div>
                                            <i class='bx bxs-plus-circle bx-sm' style={{ color: "#47BE68", cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#AddZone"></i>
                                        </div>
                                    </div>

                                    <div className='card p-4 mt-4' style={{ borderRadius: '15px' }}>
                                        <ManageZone />
                                    </div>
                                </div>
                            </div>
                            <AddZone />
                        </>
                        : <div className='row mt-5'>
                            {spinner()}
                        </div>
                }

            </div>
        </>
    )
}

export default Zone