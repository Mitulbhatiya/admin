import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { REQ_FOR_GET_USERDATA_PROGRESS } from '../../redux/action'
import { Link, NavLink } from 'react-router-dom'
import NavData from './NavData'
import { btnspinner, spinner } from '../../constant/alert'
import Cookies from 'js-cookie'
import { base_url } from '../../constant/const'
import axios from 'axios'


const Navbar = () => {

    const dispatch = useDispatch()
    const adminuser = useSelector(state => state.adminReducer)



    const header = {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Authorization": "Bearer " + Cookies.get('tkn'),
        "isauth": Cookies.get('isAuth') || "",
        "isr": Cookies.get('isr') || ""
    }


    const Logout = () => {

        axios.post(base_url + "/admin/logout", { data: "logout" }, header)
            .then((res) => {
                if (res.status === 200) {
                    Cookies.remove('isr')
                    Cookies.remove('isAuth')
                    Cookies.remove('tkn')
                    window.location.href = "/"
                }
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    Cookies.remove('isr')
                    Cookies.remove('isAuth')
                    Cookies.remove('tkn')
                    window.location.href = "/"
                }
            })
    }


    useEffect(() => {
        dispatch({ type: REQ_FOR_GET_USERDATA_PROGRESS })
    }, [])
    return (
        <div className='navbar_ pb-3'>
            <div className='text-center satsabha_font pt-4' style={{ fontSize: '40px' }}>
                SAT-Sabha
            </div>
            <div className='text-center' style={{ fontSize: '20px', color: 'white' }}>
                Attendance System
            </div>
            <nav className="navbar navbar-expand-lg ">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#"></a>
                    <i className="navbar-toggler bx bx-menu" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" ></i>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {
                                adminuser.get_userData_success === true
                                    ? <NavData />
                                    : <div className='text-center'>
                                        {btnspinner()}
                                    </div>
                            }
                        </ul>
                        <div className="d-flex">
                            <ul className="navbar-nav mb-2 mb-lg-0">
                                {

                                    adminuser.get_userData_success === true
                                        ? <li className="nav-item me-2">
                                            <NavLink to={'/profile'} className="nav-link navitem"> <i className='bx bx-user'></i> &nbsp;Profile</NavLink>
                                        </li>
                                        : ""
                                }

                                <li className="nav-item me-2">
                                    <NavLink to={'/logout'} className="nav-link navitem" onClick={() => Logout()}> <i className='bx bx-log-out'></i> &nbsp;Logout</NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default Navbar