import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import ZoneInfo from './ZoneInfo';
import { useSelector } from 'react-redux';
import { spinner } from '../../../constant/alert';
import ZoneLocation from './ZoneLocation';
import ZoneUser from './ZoneUser';
import IndexSub from './subAdmin/Index'
import IndexAdmin from './admin/Index'
import IndexSubZone from './subzone/Index'
import DeleteAttendance from './deleteAttendance/DeleteAttendance';

const Index = () => {
    const { id } = useParams();
    const adminReducer = useSelector(state => state.adminReducer)
    const [zone, setZone] = useState({})
    useEffect(() => {
        adminReducer?.zone?.map(value => {
            if (value.ID === id) {
                setZone(value)
            }
        })
    })
    return (
        <>
            <div className='container-fluid px-4 zone_nav navbar_fixed_container admin_home'>
                <div className='row mt-5'>
                    <div className='col-xxl-2 col-xl-2 col-lg-3 col-md-3 col-sm-12 col-12 mt-4 order-1 order-sm-0'>
                        <h4 className="adminhome_statistics_font">Zone 🛕</h4>
                        <div className="nav flex-column nav-pills mt-5" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <span className="nav-link active" id="v-pills-zone-tab" data-bs-toggle="pill" data-bs-target="#v-pills-zone" type="button" role="tab" aria-controls="v-pills-zone" aria-selected="true">Zone</span>
                            <span className="nav-link" id="v-pills-subzone-tab" data-bs-toggle="pill" data-bs-target="#v-pills-subzone" type="button" role="tab" aria-controls="v-pills-subzone" aria-selected="false">Subzone</span>
                            <span className="nav-link" id="v-pills-location-tab" data-bs-toggle="pill" data-bs-target="#v-pills-location" type="button" role="tab" aria-controls="v-pills-location" aria-selected="false">Location</span>
                            <span className="nav-link" id="v-pills-admin-tab" data-bs-toggle="pill" data-bs-target="#v-pills-admin" type="button" role="tab" aria-controls="v-pills-admin" aria-selected="false">Admin</span>
                            <span className="nav-link" id="v-pills-sub-admin-tab" data-bs-toggle="pill" data-bs-target="#v-pills-sub-admin" type="button" role="tab" aria-controls="v-pills-sub-admin" aria-selected="false">Sub-admin</span>
                            <span className="nav-link" id="v-pills-users-tab" data-bs-toggle="pill" data-bs-target="#v-pills-users" type="button" role="tab" aria-controls="v-pills-users" aria-selected="false">Members</span>
                            <span className="nav-link" id="v-pills-deleteAttendance-tab" data-bs-toggle="pill" data-bs-target="#v-pills-deleteAttendance" type="button" role="tab" aria-controls="v-pills-deleteAttendance" aria-selected="false">Delete attendance</span>
                        </div>
                    </div>
                    <div className='col-xxl-10 col-xl-10 col-lg-9 col-md-9 col-sm-12 col-12 mt-4 order-1 order-sm-0'>
                        <div className="tab-content mt-5" id="v-pills-tabContent">
                            <div className="tab-pane fade show active" id="v-pills-zone" role="tabpanel" aria-labelledby="v-pills-zone-tab" tabindex="0">
                                {
                                    adminReducer.get_userData_success === true
                                        && adminReducer.get_zone_success === true
                                        ? <ZoneInfo zdata={zone} />
                                        : <div className='row mt-5'>
                                            {spinner()}
                                        </div>
                                }
                            </div>
                            <div className="tab-pane fade" id="v-pills-subzone" role="tabpanel" aria-labelledby="v-pills-subzone-tab" tabindex="0">
                                {
                                    adminReducer.get_userData_success === true
                                        && adminReducer.get_zone_success === true
                                        && adminReducer.get_subzone_success === true
                                        && adminReducer.get_locationData_success === true
                                        ? <IndexSubZone />
                                        : <div className='row mt-5'>
                                            {spinner()}
                                        </div>
                                }
                            </div>
                            <div className="tab-pane fade" id="v-pills-location" role="tabpanel" aria-labelledby="v-pills-location-tab" tabindex="0">
                                {
                                    adminReducer.get_userData_success === true
                                        && adminReducer.get_zone_success === true
                                        && adminReducer.get_locationData_success === true
                                        ? <ZoneLocation zdata={zone} />
                                        : <div className='row mt-5'>
                                            {spinner()}
                                        </div>
                                }
                            </div>
                            <div className="tab-pane fade" id="v-pills-admin" role="tabpanel" aria-labelledby="v-pills-admin-tab" tabindex="0">
                                {
                                    adminReducer.get_userData_success === true
                                        && adminReducer.get_zone_success === true
                                        && adminReducer.get_locationData_success === true
                                        ? <IndexAdmin />
                                        : <div className='row mt-5'>
                                            {spinner()}
                                        </div>
                                }
                            </div>
                            <div className="tab-pane fade" id="v-pills-sub-admin" role="tabpanel" aria-labelledby="v-pills-sub-admin-tab" tabindex="0">
                                {
                                    adminReducer.get_userData_success === true
                                        && adminReducer.get_zone_success === true
                                        && adminReducer.get_locationData_success === true
                                        ? <IndexSub />
                                        : <div className='row mt-5'>
                                            {spinner()}
                                        </div>
                                }
                            </div>
                            <div className="tab-pane fade" id="v-pills-users" role="tabpanel" aria-labelledby="v-pills-users-tab" tabindex="0">
                                {
                                    adminReducer.get_userData_success === true
                                        && adminReducer.get_zone_success === true
                                        && adminReducer.get_locationData_success === true
                                        && adminReducer.get_subzone_success === true
                                        && adminReducer.get_user_success === true
                                        ? <ZoneUser />
                                        : <div className='row mt-5'>
                                            {spinner()}
                                        </div>
                                }
                            </div>
                            <div className="tab-pane fade" id="v-pills-deleteAttendance" role="tabpanel" aria-labelledby="v-pills-deleteAttendance-tab" tabindex="0">
                                {
                                    adminReducer.get_userData_success === true
                                        && adminReducer.get_zone_success === true
                                        && adminReducer.get_locationData_success === true
                                        && adminReducer.get_subzone_success === true
                                        && adminReducer.get_user_success === true
                                        ? <DeleteAttendance />
                                        : <div className='row mt-5'>
                                            {spinner()}
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index