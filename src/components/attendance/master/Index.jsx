import React from 'react'
import { useSelector } from 'react-redux'
import { spinner } from '../../../constant/alert'
import ZoneList from './ZoneList'

const Index = () => {
    const adminReducer = useSelector(state => state.adminReducer)
    return (
        <div className='container-fluid px-lg-5 px-2 navbar_fixed_container admin_home'>
            {
                adminReducer.get_locationData_success === true
                    && adminReducer.get_userData_success === true
                    && adminReducer.get_zone_success === true
                    && adminReducer.get_user_success === true
                    && adminReducer.get_details_attendance_success === true
                    && adminReducer.get_attendance_success === true
                    ? <>
                        <div className='row mt-5'>
                            <div className="d-flex justify-content-between">
                                <h4 className="adminhome_statistics_font">Master attendace 😀</h4>
                            </div>
                            <div className='px-3'>

                                <div className="accordion accordion-flush mt-3" id="accordionWarning">
                                    <div className="accordion-item alert alert-warning" style={{ borderRadius: '12px' }}>
                                        <h2 className="accordion-header">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseWarning" aria-expanded="false" aria-controls="flush-collapseWarning" style={{ backgroundColor: 'transparent' }}>
                                                ⚠️ Be Focused!! ⚠️ Do not Refresh and make sure internet connection is stable!
                                            </button>
                                        </h2>
                                        <div id="flush-collapseWarning" className="accordion-collapse collapse" data-bs-parent="#accordionWarning">
                                            <div className="accordion-body alert-warning ">
                                                <ul className='mt-4 '>
                                                    <li>One you submit master attendance data, we'll create attendace separated by zones!</li>
                                                    <li>If you want to update attendace, so you need go to their attendance details by zone, that will be available on attendace section! </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className='col-12 mt-4 order-1 order-sm-0'>
                                <div className='card p-4 ' style={{ borderRadius: '15px' }}>
                                    <ZoneList />
                                </div>
                            </div>
                        </div>
                    </>
                    : <div className='row mt-5'>
                        {spinner()}
                    </div>
            }

        </div>
    )
}

export default Index