import React from 'react'
import { useSelector } from 'react-redux'
import { spinner } from '../../constant/alert'
import AddAttendance from './AddAttendance'
import ManageAttendace from './v2/ManageAttedance'
import { Link } from 'react-router-dom'

const Index = () => {
    const adminReducer = useSelector(state => state.adminReducer)
    return (
        <>
            <div className='container-fluid px-lg-5 px-2 navbar_fixed_container admin_home'>
                {
                    adminReducer.get_locationData_success === true
                        && adminReducer.get_userData_success === true
                        && adminReducer.get_zone_success === true
                        && adminReducer.get_user_success === true
                        && adminReducer.get_details_attendance_success === true
                        && adminReducer.get_attendance_success === true
                        && adminReducer.get_detailsData_attendance_success === true
                        ? <>
                            <div className='row mt-5'>
                                <div className="d-flex justify-content-between">
                                    <h4 className="adminhome_statistics_font">Attendance 🧾</h4>
                                    <div>
                                        <i className='bx bxs-plus-circle bx-sm ' style={{ color: "#47BE68", cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#AddAttendance"></i>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <Link to={'/attendance/master'} className='btn btn-outline-secondary'>Master attendace</Link>
                                </div>

                                <div className='col-12 mt-4 order-1 order-sm-0'>
                                    <div className='card p-4 ' style={{ borderRadius: '15px' }}>
                                        <ManageAttendace />
                                    </div>
                                </div>
                            </div>
                            <AddAttendance />
                        </>
                        : <div className='row mt-5'>
                            {spinner()}
                        </div>
                }

            </div>
        </>
    )
}

export default Index