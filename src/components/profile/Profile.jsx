import React from 'react'
import ChangePassword from './ChangePassword'
import { useSelector } from 'react-redux'
import { spinner } from '../../constant/alert'
import Support from '../support/Support'

const Profile = () => {
    const adminuser = useSelector(state => state.adminReducer)
    return (
        <div className='container navbar_fixed_container admin_home'>
            <div className='row mt-5'>
                <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mt-4 order-1 order-sm-0'>
                    <h4 className="adminhome_statistics_font">Profile 👤</h4>
                    <div className='card p-4 mt-4' style={{ borderRadius: '15px' }}>
                        {
                            adminuser.get_userData_success === true
                                ? <>
                                    <span>Admin Id</span>
                                    <input
                                        type="text"
                                        disabled
                                        className="form-control input_field mt-3 mb-3"
                                        defaultValue={adminuser.userData.adminid}
                                        style={{ backgroundColor: 'white' }}
                                    />
                                    <span>Admin name</span>
                                    <input
                                        type="text"
                                        disabled
                                        className="form-control input_field mt-3 mb-3"
                                        defaultValue={adminuser.userData.name}
                                        style={{ backgroundColor: 'white' }}
                                    />

                                    <span>Admin Type</span>
                                    <input
                                        type="text"
                                        disabled
                                        className="form-control input_field mt-3"
                                        defaultValue={adminuser.userData.type}
                                        style={{ backgroundColor: 'white' }}
                                    />
                                </>
                                : spinner()
                        }
                    </div>
                </div>
                <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mt-4 order-1 order-sm-0'>
                    <h4 className="adminhome_statistics_font">Change Password 🔐</h4>
                    <div className='card p-4 mt-4' style={{ borderRadius: '15px' }}>
                        {
                            adminuser.get_userData_success === true
                                ? <ChangePassword />
                                : spinner()
                        }
                    </div>
                </div>
            </div>
            <Support />
        </div>
    )
}

export default Profile