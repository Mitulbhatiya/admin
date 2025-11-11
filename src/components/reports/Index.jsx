import { React, lazy, Suspense } from 'react'
// import AttendanceZone from './attendance/AttendanceZone'
import { useSelector } from 'react-redux'
import { spinner } from '../../constant/alert'
import AttendanceDate from './attendance/AttendanceDate'
// Use lazy load for load balance
const AttendanceZone = lazy(() => import('./attendance/v2/AttendanceZone'));

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
                        ? <>
                            <div className='row mt-5 mb-5'>
                                <div className="d-flex justify-content-between">
                                    <h4 className="adminhome_statistics_font">Reports 🙎</h4>
                                    {/* <div>Report</div> */}
                                </div>

                                <div className='col-12 mt-4 order-1 order-sm-0'>
                                    <div className='card p-4 ' style={{ borderRadius: '15px' }}>
                                        <Suspense fallback={<p>Loading...</p>}>
                                            <AttendanceZone />
                                        </Suspense>

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