import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { spinner } from '../../constant/alert';
import AbsentRatio from './absentRatio/AbsentRatio';
import UserRatio from './userRatio/UserRatio';
import AbsentRatioByMonth from './absentRatio/AbsentRatioByMonth';
import Stastistic from './statistics/v2/Stastistic';
import Calendar from './Calendar';
import Support from '../support/Support';

const Home = () => {
    const navigate = useNavigate()
    const adminReducer = useSelector(state => state.adminReducer)

    return (
        <>
            <div className='container-fluid px-4 navbar_fixed_container admin_home'>
                {
                    adminReducer.get_locationData_success === true
                        && adminReducer.get_userData_success === true
                        && adminReducer.get_zone_success === true
                        && adminReducer.get_user_success === true
                        && adminReducer.get_details_attendance_success === true
                        && adminReducer.get_attendance_success === true
                        ? <>
                            {/* 
                            <div className="d-flex justify-content-between mt-5">
                                <h4 className="adminhome_statistics_font">Calendar of Sabha 📅</h4>
                            </div>
                            <Calendar /> */}
                            <div className="d-flex justify-content-between mt-5">
                                <h4 className="adminhome_statistics_font">Statistics 😀</h4>
                            </div>
                            <Stastistic />
                            <div className='row mt-5'>
                                <div className="d-flex justify-content-between">
                                    <h4 className="adminhome_statistics_font">Graphical 📈</h4>
                                </div>
                                {/* <div className='col-12 col-sm-12 col-md-6 col-lg-4 mt-3 order-1 order-sm-0'>
                                    <div className='card p-4 mt-4 mb-4' style={{ borderRadius: '15px', overflow: 'auto' }}>
                                        <h5>Absent ratio by Zone</h5>
                                        <AbsentRatio />
                                    </div>
                                </div> */}
                                <div className='col-12 col-sm-12 col-md-6 col-lg-8 mt-3'>
                                    <div className='card p-4 mt-4 mb-4' style={{ borderRadius: '15px', overflow: 'auto' }}>
                                        {/* <h5>Absent & user ratio by Zone</h5> */}
                                        <h5>User ratio by Zone</h5>
                                        <UserRatio />
                                    </div>
                                </div>
                                <div className='col-12 col-sm-12 col-md-6 col-lg-4 mt-3'>
                                    <div className='card p-4 mt-4 mb-4' style={{ borderRadius: '15px', overflow: 'auto', border: 'none' }}>
                                        {/* <h5>Absent ratio by month</h5>
                                        <AbsentRatioByMonth /> */}


                                        <div className="d-flex justify-content-between ">
                                            <h4 className="adminhome_statistics_font">Calendar of Sabha 📅</h4>
                                        </div>
                                        <Calendar />

                                    </div>
                                </div>
                            </div>
                        </>
                        : <div className='row mt-5'>
                            {spinner()}
                        </div>
                }
            </div>

            <Support />
        </>
    )
}

export default Home