import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { spinner } from '../../constant/alert'
import RequestTable from './RequestTable'


const Index = () => {

    const adminReducer = useSelector(state => state.adminReducer)

    const [req, setReq] = useState('Pending')
    return (
        <>

            <div className='container-fluid px-md-5 px-0 navbar_fixed_container admin_home'>
                {
                    adminReducer.get_locationData_success === true
                        && adminReducer.get_userData_success === true
                        && adminReducer.get_zone_success === true
                        && adminReducer.get_user_success === true
                        && adminReducer.get_request_success === true
                        ? <>
                            <div className='row mt-5 px-3' >
                                <div className=' col-12 mt-4' style={{ paddingRight: '0px' }}>
                                    <div className="d-flex justify-content-between">
                                        <h4 className="adminhome_statistics_font">Requests 🙎</h4>
                                    </div>
                                    <p className="d-inline-flex gap-1 mt-3">
                                        <a href="#" className={`btn ${req === "Pending" ? 'active' : ''}`} role="button" data-bs-toggle="button" onClick={() => setReq("Pending")}>Pending</a>
                                        <a href="#" className={`btn ${req === "Accepted" ? 'active' : ''}`} role="button" data-bs-toggle="button" aria-pressed="true" onClick={() => setReq("Accepted")}>Accepted</a>
                                        <a href="#" className={`btn ${req === "Rejected" ? 'active' : ''}`} role="button" data-bs-toggle="button" aria-pressed="true" onClick={() => setReq("Rejected")}>Rejected</a>
                                    </p>
                                    <div className='card p-4 mt-4 mb-4' style={{ borderRadius: '15px' }}>
                                        <RequestTable data={{ reqType: req }} />
                                    </div>
                                </div>
                            </div>
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