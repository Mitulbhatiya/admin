import React from 'react'

const ManageUserExtra = () => {
    return (
        <>
            <div className='col-12' style={{ overflowX: 'auto', maxHeight: '500px' }}>
                <table className="table">
                    <thead style={{ textAlign: 'left' }}>
                        <tr>
                            <td>#</td>
                            <th>UID</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Gender</th>
                            <th>Zone</th>
                            <th>SubZone</th>
                            <th>Attendance</th>
                            <th>Birthdate</th>
                            {/* <th>District</th>
                            <th>Taluka</th>
                            <th>Village</th> */}
                            <th>Role</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            adminReducer.users?.length === 0
                                ? <tr>
                                    <td colSpan={10} className='text-center'>🙁 No users data</td>
                                </tr>
                                :

                                <>
                                    {query ? (
                                        // If there is a search query, display filtered results
                                        filteredData.map((value, index) => (
                                            <tr key={index}>
                                                <td >{index + 1}</td>
                                                <td className={`${value.isActive === false ? "text-danger" : ""}`}>{value?.ID.split('P')[1]}</td>
                                                <td>
                                                    {
                                                        value.profilePhotoStatus === false
                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                            : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    }
                                                    &nbsp;{value?.firstname} {value?.lastname}
                                                </td>
                                                <td>{value?.mobile}</td>
                                                <td>{value?.gender}</td>
                                                <td>{value?.zone.split('Z')[1] || "-"}</td>
                                                <td>{value?.subzone || "-"}</td>
                                                <td style={{ fontWeight: '600' }}><span className={`${value?.attendance >= 75 ? "text-success" : value?.attendance < 75 && value?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{value?.attendance}%</span></td>
                                                <td>{value?.birthdate?.split('T')[0]?.split('-')[2]}-{value?.birthdate?.split('T')[0]?.split('-')[1]}-{value?.birthdate?.split('T')[0]?.split('-')[0]}</td>
                                                {/* <td>{value?.district === "NULL" ? "-" : value?.district}</td>
                                                <td>{value?.taluka === "NULL" ? "-" : value?.taluka}</td>
                                                <td>{value?.village === "NULL" ? "-" : value?.village}</td> */}
                                                <td style={{ textTransform: 'capitalize' }}>{value?.role === "zonesubadmin" ? "Sub-admin" : value?.role}</td>
                                                <td>
                                                    <Link to={`/user/${value?.ID}`}>
                                                        <button className='adminHomeEditBtn mb-2 me-2'>
                                                            {/* <i className='bx bx-edit-alt'></i> */}
                                                            <i className='bx bx-right-arrow-alt'></i>
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : queryuserID !== "" ? (
                                        // If there is a search query, display filtered results
                                        filteredDataUserID.map((value, index) => (
                                            <tr key={index}>
                                                <td >{index + 1}</td>
                                                <td className={`${value.isActive === false ? "text-danger" : ""}`}>{value?.ID.split('P')[1]}</td>
                                                <td>
                                                    {
                                                        value.profilePhotoStatus === false
                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                            : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    }
                                                    &nbsp;{value?.firstname} {value?.lastname}
                                                </td>
                                                <td>{value?.mobile}</td>
                                                <td>{value?.gender}</td>
                                                <td>{value?.zone.split('Z')[1] || "-"}</td>
                                                <td>{value?.subzone || "-"}</td>
                                                <td style={{ fontWeight: '600' }}><span className={`${value?.attendance >= 75 ? "text-success" : value?.attendance < 75 && value?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{value?.attendance}%</span></td>
                                                <td>{value?.birthdate?.split('T')[0]?.split('-')[2]}-{value?.birthdate?.split('T')[0]?.split('-')[1]}-{value?.birthdate?.split('T')[0]?.split('-')[0]}</td>
                                                {/* <td>{value?.district === "NULL" ? "-" : value?.district}</td>
                                                <td>{value?.taluka === "NULL" ? "-" : value?.taluka}</td>
                                                <td>{value?.village === "NULL" ? "-" : value?.village}</td> */}
                                                <td style={{ textTransform: 'capitalize' }}>{value?.role === "zonesubadmin" ? "Sub-admin" : value?.role}</td>
                                                <td>
                                                    <Link to={`/user/${value?.ID}`}>
                                                        <button className='adminHomeEditBtn mb-2 me-2'>
                                                            {/* <i className='bx bx-edit-alt'></i> */}
                                                            <i className='bx bx-right-arrow-alt'></i>
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : queryuserMobile !== "" ? (
                                        // If there is a search query, display filtered results
                                        filteredDataUserMobile.map((value, index) => (
                                            <tr key={index}>
                                                <td >{index + 1}</td>
                                                <td className={`${value.isActive === false ? "text-danger" : ""}`}>{value?.ID.split('P')[1]}</td>
                                                <td>
                                                    {
                                                        value.profilePhotoStatus === false
                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                            : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    }
                                                    &nbsp;{value?.firstname} {value?.lastname}
                                                </td>
                                                <td>{value?.mobile}</td>
                                                <td>{value?.gender}</td>
                                                <td>{value?.zone.split('Z')[1] || "-"}</td>
                                                <td>{value?.subzone || "-"}</td>
                                                <td style={{ fontWeight: '600' }}><span className={`${value?.attendance >= 75 ? "text-success" : value?.attendance < 75 && value?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{value?.attendance}%</span></td>
                                                <td>{value?.birthdate?.split('T')[0]?.split('-')[2]}-{value?.birthdate?.split('T')[0]?.split('-')[1]}-{value?.birthdate?.split('T')[0]?.split('-')[0]}</td>
                                                {/* <td>{value?.district === "NULL" ? "-" : value?.district}</td>
                                                <td>{value?.taluka === "NULL" ? "-" : value?.taluka}</td>
                                                <td>{value?.village === "NULL" ? "-" : value?.village}</td> */}
                                                <td style={{ textTransform: 'capitalize' }}>{value?.role === "zonesubadmin" ? "Sub-admin" : value?.role}</td>
                                                <td>
                                                    <Link to={`/user/${value?.ID}`}>
                                                        <button className='adminHomeEditBtn mb-2 me-2'>
                                                            {/* <i className='bx bx-edit-alt'></i> */}
                                                            <i className='bx bx-right-arrow-alt'></i>
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        // If there is no search query, display the full list
                                        adminReducer.users?.map((value, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td >{index + 1}</td>
                                                    <td className={`${value.isActive === false ? "text-danger" : ""}`}>{value?.ID.split('P')[1]}</td>
                                                    <td>
                                                        {
                                                            value.profilePhotoStatus === false
                                                                ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                        }
                                                        &nbsp;{value?.firstname} {value?.lastname}
                                                    </td>
                                                    <td>{value?.mobile}</td>
                                                    <td>{value?.gender}</td>
                                                    <td>{value?.zone.split('Z')[1] || "-"}</td>
                                                    <td>{value?.subzone || "-"}</td>
                                                    <td style={{ fontWeight: '600' }}><span className={`${value?.attendance >= 75 ? "text-success" : value?.attendance < 75 && value?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{value?.attendance}%</span></td>
                                                    <td>{value?.birthdate?.split('T')[0]?.split('-')[2]}-{value?.birthdate?.split('T')[0]?.split('-')[1]}-{value?.birthdate?.split('T')[0]?.split('-')[0]}</td>
                                                    {/* <td>{value?.district === "NULL" ? "-" : value?.district}</td>
                                                    <td>{value?.taluka === "NULL" ? "-" : value?.taluka}</td>
                                                    <td>{value?.village === "NULL" ? "-" : value?.village}</td> */}
                                                    <td style={{ textTransform: 'capitalize' }}>{value?.role === "zonesubadmin" ? "Sub-admin" : value?.role}</td>
                                                    <td>
                                                        <Link to={`/user/${value?.ID}`}>
                                                            <button className='adminHomeEditBtn mb-2 me-2'>
                                                                {/* <i className='bx bx-edit-alt'></i> */}
                                                                <i className='bx bx-right-arrow-alt'></i>
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}


                                </>

                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ManageUserExtra