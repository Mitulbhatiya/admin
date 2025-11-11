import React from 'react'
import AddUse from './AddUse'
import { useSelector } from 'react-redux'
import { spinner } from '../../constant/alert'
import ManageUsers from './ManageUsers'

const User = () => {

    const adminReducer = useSelector(state => state.adminReducer)
    return (
        <div className='container-fluid px-lg-5 px-2 navbar_fixed_container admin_home'>
            {
                adminReducer.get_locationData_success === true
                    && adminReducer.get_userData_success === true
                    && adminReducer.get_zone_success === true
                    && adminReducer.get_user_success === true
                    && adminReducer.get_details_attendance_success === true
                    ? <>
                        <div className='row mt-5'>
                            <div className="d-flex justify-content-between">
                                <h4 className="adminhome_statistics_font">Users 🙎</h4>
                                <div>
                                    <i class='bx bxs-plus-circle bx-sm' style={{ color: "#47BE68", cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#AddUsers"></i>
                                </div>
                            </div>

                            <div className='col-12 my-4 order-1 order-sm-0'>
                                <div className='card p-4 ' style={{ borderRadius: '15px' }}>
                                    <ManageUsers />
                                </div>
                            </div>
                        </div>
                        <AddUse />
                    </>
                    : <div className='row mt-5'>
                        {spinner()}
                    </div>
            }

        </div>
    )
}

export default User