import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { REQ_FOR_GET_ATTENDANCE_PROGRESS, REQ_FOR_GET_DETAILS_ATTENDANCE_PROGRESS, REQ_FOR_GET_DETAILS_DATA_ATTENDANCE_PROGRESS, REQ_FOR_GET_LOCATION_DATA_ADMIN_PROGRESS, REQ_FOR_GET_REQUEST_PROGRESS, REQ_FOR_GET_SUBZONE_PROGRESS, REQ_FOR_GET_USER_PROGRESS, REQ_FOR_GET_ZONE_PROGRESS } from '../../redux/action'
const NavData = () => {
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)
    useEffect(() => {
        dispatch({ type: REQ_FOR_GET_LOCATION_DATA_ADMIN_PROGRESS })
        dispatch({ type: REQ_FOR_GET_ZONE_PROGRESS })
        dispatch({ type: REQ_FOR_GET_SUBZONE_PROGRESS })
        dispatch({ type: REQ_FOR_GET_USER_PROGRESS })
        dispatch({ type: REQ_FOR_GET_REQUEST_PROGRESS })
        dispatch({ type: REQ_FOR_GET_ATTENDANCE_PROGRESS })
        dispatch({ type: REQ_FOR_GET_DETAILS_ATTENDANCE_PROGRESS })
        dispatch({ type: REQ_FOR_GET_DETAILS_DATA_ATTENDANCE_PROGRESS })
    }, [])
    return (
        <>
            <li className="nav-item me-2">
                <NavLink to={'/'} className="nav-link navitem" > <i className='bx bxs-home'></i> &nbsp;Home</NavLink>
            </li>
            <li className="nav-item me-2">
                <NavLink to={'/zone'} className="nav-link navitem"><i className='bx bx-cube-alt'></i> &nbsp;Zone</NavLink>
            </li>
            <li className="nav-item me-2">
                <NavLink to={'/locality'} className="nav-link navitem"> <i className='bx bxs-location-plus'></i> &nbsp;Locality</NavLink>
            </li>
            <li className="nav-item me-2">
                <NavLink to={'/users'} className="nav-link navitem"> <i className='bx bx-user'></i> &nbsp;Users</NavLink>
            </li>
            <li className="nav-item me-2">
                <NavLink to={'/requests'} className="nav-link navitem"> <i className='bx bx-git-pull-request'></i> &nbsp;Requests</NavLink>
            </li>
            <li className="nav-item me-2">
                <NavLink to={'/attendance'} className="nav-link navitem"> <i className='bx bx-spreadsheet'></i> &nbsp;Attendance</NavLink>
            </li>
            <li className="nav-item me-2">
                <NavLink to={'/reports'} className="nav-link navitem"> <i className='bx bxs-report'></i> &nbsp;Reports</NavLink>
            </li>
        </>
    )
}

export default NavData