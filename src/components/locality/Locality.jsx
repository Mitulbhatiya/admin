import React, { useEffect } from 'react'
import AddLocality from './AddLocality'
import { useSelector } from 'react-redux'
import { spinner } from '../../constant/alert'
import ManageLocality from './ManageLocality'
// import AddLocalityByFile from './AddLocalityByFile'
import { useNavigate } from 'react-router-dom'

const Locality = () => {
    const adminuser = useSelector(state => state.adminReducer)
    const navigate = useNavigate()
    if (adminuser.get_userData_success === true) {
        if (adminuser.userData.type !== "main") return navigate('/');
    }
    return (
        <div className='container navbar_fixed_container admin_home'>
            <div className='row mt-5'>
                <h4 className="adminhome_statistics_font">Locality ⛳</h4>
                <div className='col-xxl-8 col-xl-8 col-lg-8 col-md-6 col-sm-12 col-12 mt-4 order-1 order-sm-0'>
                    <div className='card p-4 ' style={{ borderRadius: '15px' }}>
                        {
                            adminuser.get_locationData_success === true
                                ? <ManageLocality />
                                : spinner()
                        }
                    </div>
                </div>
                <div className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mt-4'>
                    <div className='card p-4 ' style={{ borderRadius: '15px' }}>
                        {
                            adminuser.get_userData_success === true
                                ? <AddLocality />
                                : spinner()
                        }

                    </div>
                    {/* <div className='card p-4 mt-4' style={{ borderRadius: '15px' }}>
                        {
                            adminuser.get_userData_success === true
                                ? <AddLocalityByFile />
                                : spinner()
                        }
                    </div> */}
                </div>
            </div>

            {/* <a href="#adminLocalitytop" className='dwntopbtn'>
                <i className='bx bx-chevrons-up bx-sm'></i>
            </a> */}
        </div>
    )
}

export default Locality