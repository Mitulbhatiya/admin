import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { spinner } from '../../../constant/alert';
import DetailsAttendance from './DetailsAttendance';
import { REQ_FOR_GET_EACH_ATTENDANCE_PROGRESS, REQ_FOR_GET_REMARK_ADMIN_PROGRESS } from '../../../redux/action';
import Index from './remark/Index';

const UpdateAttendance = () => {

    const { id } = useParams();
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    useEffect(() => {
        const data = {
            _id: id
        }
        dispatch({ type: REQ_FOR_GET_EACH_ATTENDANCE_PROGRESS, payload: { data } })
        dispatch({ type: REQ_FOR_GET_REMARK_ADMIN_PROGRESS, payload: { data } })
    }, [id])
    return (
        <>
            <div className='container-fluid px-lg-5  navbar_fixed_container admin_home'>
                <ul className="nav nav-tabs mt-4" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="attendance-tab" data-bs-toggle="tab" data-bs-target="#attendance-tab-pane" type="button" role="tab" aria-controls="attendance-tab-pane" aria-selected="true">Attendace 🧾</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="remarks-tab" data-bs-toggle="tab" data-bs-target="#remarks-tab-pane" type="button" role="tab" aria-controls="remarks-tab-pane" aria-selected="false">Remark</button>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="attendance-tab-pane" role="tabpanel" aria-labelledby="attendance-tab" tabindex="0">
                        {
                            adminReducer.get_locationData_success === true
                                && adminReducer.get_userData_success === true
                                && adminReducer.get_zone_success === true
                                && adminReducer.get_user_success === true
                                && adminReducer.get_each_attendance_success === true
                                && adminReducer.get_remark_success === true
                                ? <DetailsAttendance />
                                : <div className='mt-5'>
                                    {spinner()}
                                </div>
                        }
                    </div>
                    <div className="tab-pane fade" id="remarks-tab-pane" role="tabpanel" aria-labelledby="remarks-tab" tabindex="0">
                        {
                            adminReducer.get_locationData_success === true
                                && adminReducer.get_userData_success === true
                                && adminReducer.get_zone_success === true
                                && adminReducer.get_user_success === true
                                && adminReducer.get_each_attendance_success === true
                                && adminReducer.get_remark_success === true
                                ? <Index />
                                : <div className='mt-5'>
                                    {spinner()}
                                </div>
                        }
                    </div>
                </div>

            </div>
        </>
    )
}

export default UpdateAttendance