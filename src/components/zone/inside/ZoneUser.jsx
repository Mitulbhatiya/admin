import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import userImg from '../../assets/user.png'
import { useForm } from 'react-hook-form'
import { alert, btnspinner } from '../../../constant/alert'
import { REQ_FOR_USER_CHANGE_ZONE_PROGRESS } from '../../../redux/action'
const ZoneUser = () => {
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)
    const { id } = useParams();
    let count = 0
    let member_count = 0

    adminReducer.users?.map((value, index) => {
        if (id == value.zone) {
            member_count = member_count + 1
        }
    })


    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();
    // Selected Zone
    const [selectedzone, setselectedzone] = useState('')
    const handleChangeSelectedZone = (e) => {
        setselectedzone(e.target.value);
    };

    // Success/err message
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [status, setStatus] = useState('')
    const handleButtonClick = () => {
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
            document.getElementById('userChangeZoneModalClose').click()
            window.location.reload()
        }, 1000);
    }




    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedOptionsDetails, setSelectedOptionsDetails] = useState([]);

    // Single Check
    const handleCheckboxChange = (val) => {
        // Check if the option is already selected
        const isSelected = selectedOptions.includes(val._id);

        // Update the state based on the current selection
        if (isSelected) {
            setSelectedOptions(selectedOptions.filter((optionId) => optionId !== val._id));
            setSelectedOptionsDetails(selectedOptionsDetails.filter((optionId) => optionId._id !== val._id));
        } else {
            setSelectedOptions([...selectedOptions, val._id]);
            setSelectedOptionsDetails([...selectedOptionsDetails, val]);
        }
    };


    const [isChecked, setisChecked] = useState(true);
    // Select All (Checkbox)
    const handleCheckboxChangeAll = async (data) => {
        setisChecked(!isChecked)
        if (isChecked === true) {
            const allIds = await adminReducer.users?.map((value) => {
                if (id == value.zone) {
                    return value._id
                }
            }).filter((element) => element !== undefined)
            setSelectedOptions(allIds);

            const allIdsdetails = await adminReducer.users?.map((value) => {
                if (id == value.zone) {
                    return value
                }
            }).filter((element) => element !== undefined)
            setSelectedOptionsDetails(allIdsdetails);
            // console.log(allIds.filter((element) => element !== undefined));
        } else {
            setSelectedOptions([]);
            setSelectedOptionsDetails([])
        }
    };

    // console.log(selectedOptions);
    // console.log(selectedOptionsDetails);


    const onSubmit = (dataa) => {
        const data = {
            users: selectedOptions,
            zone: dataa.zone,
            subzone: dataa.subzone
        }
        // console.log(data);
        dispatch({ type: REQ_FOR_USER_CHANGE_ZONE_PROGRESS, payload: { data } })
        setStatus(true)
    }

    if (adminReducer.user_change_zone_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
        reset()
        setselectedzone('')
        setSelectedOptions([]);
        setSelectedOptionsDetails([])

    }




    // Live search by Username
    const [query, setQuery] = useState('');
    // Function to handle changes in the search query
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Filter the array based on the search query
    const filteredData = adminReducer.users.filter(item =>
        (item.zone === id && (item.firstname.toLowerCase() + " " + item.lastname.toLowerCase()).includes(query.toLowerCase()))
    );


    // Live search by zone ID
    const [queryuserID, setQueryuserID] = useState('');

    // Function to handle changes in the search query for ZoneID
    const handleInputChange_UserID = (e) => {
        setQueryuserID(e.target.value);

    };
    // Filter the array based on the search query for ZoneID
    const filteredDataUserID = adminReducer.users.filter(item =>
        (item.zone === id && item.ID.split('P')[1].toUpperCase().includes(queryuserID.toUpperCase()))
    );



    // Live search by user mobile
    const [queryuserMobile, setQueryuserMobile] = useState('');

    // Function to handle changes in the search query for User mobile
    const handleInputChange_UserMobile = (e) => {
        setQueryuserMobile(e.target.value);

    };
    // Filter the array based on the search query for User mobile
    const filteredDataUserMobile = adminReducer.users.filter(item =>
        (item.zone === id && item.mobile.toUpperCase().includes(queryuserMobile.toUpperCase()))
    );


    const [selectedSubzone, setselectedSubzone] = useState("")
    const AddSubZoneSelection = async () => {
        if (selectedSubzone !== "") {
            const allIds = await adminReducer.users?.map((value) => {
                if (id == value.zone && selectedSubzone == value.subzone) {
                    return value._id;
                }
            }).filter((element) => element !== undefined);

            // Check for duplicate IDs before adding them to selectedOptions
            const uniqueIds = allIds.filter((id) => !selectedOptions.includes(id));

            setSelectedOptions([...selectedOptions, ...uniqueIds]);

            const allIdsdetails = await adminReducer.users?.map((value) => {
                if (id == value.zone && selectedSubzone == value.subzone) {
                    return value;
                }
            }).filter((element) => element !== undefined);

            // Check for duplicate objects based on _id before adding them to selectedOptionsDetails
            const uniqueDetails = allIdsdetails.filter((detail) => {
                return !selectedOptionsDetails.some((existingDetail) => existingDetail._id === detail._id);
            });

            setSelectedOptionsDetails([...selectedOptionsDetails, ...uniqueDetails]);
        }
    }


    const removeFromChangeUserZone = async (value) => {
        // Filter out the value from selectedOptions
        const updatedOptions = selectedOptions.filter((id) => id !== value._id);
        setSelectedOptions(updatedOptions);

        // Filter out the value from selectedOptionsDetails
        const updatedDetails = selectedOptionsDetails.filter((detail) => detail._id !== value._id);
        setSelectedOptionsDetails(updatedDetails);
    }
    return (
        <>
            <div className='d-flex justify-content-between'>
                <p>Members count <h4 className='mt-3'>{member_count}</h4></p>
                <div>
                    <button className='adminHomeEditBtn mb-2 me-2' data-bs-toggle="modal" data-bs-target="#userChangeZoneModal">
                        Change zone
                    </button>
                </div>
            </div>

            <div>
                <input
                    type="text"
                    className='my-4'
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search by user name"
                />
                <span> -- OR -- </span>
                <input
                    type="number"
                    className='my-4'
                    min={0}
                    value={queryuserID}
                    onChange={handleInputChange_UserID}
                    placeholder="Search by UID"
                />
                <span> -- OR -- </span>
                <input
                    type="number"
                    className='my-4'
                    min={0}
                    value={queryuserMobile}
                    onChange={handleInputChange_UserMobile}
                    placeholder="Search by Mobile"
                />
            </div>
            <hr />
            <div>
                <div className="mb-3 mt-3 col-12">
                    <p>Subzone<span className='text-danger'>*</span></p>
                    <select
                        className=""
                        onChange={(e) => setselectedSubzone(e.target.value)}
                    >
                        <option value="">Tap to select</option>
                        <option value="0">0</option>
                        {
                            adminReducer.subzone.map((value, index) => {
                                if (value.zoneID === id) {
                                    return (
                                        <option value={value.ID} key={index}>{value.ID}</option>
                                    )
                                }
                            })
                        }
                    </select>
                    <button className='btn btn-outline-secondary ms-3' onClick={() => AddSubZoneSelection()}>Add for selection</button>
                </div>
            </div>

            <div className='col-12 mt-4 mb-5' style={{ overflow: 'auto', maxHeight: '500px' }}>
                <table className="table">
                    <thead style={{ textAlign: 'left' }}>
                        <tr>
                            <td>
                                <input
                                    type="checkbox"
                                    // checked="checked"
                                    onChange={() => handleCheckboxChangeAll(isChecked)}
                                />
                            </td>
                            <td>#</td>
                            <th>UID</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Gender</th>
                            <th>Zone</th>
                            <th>Subzone</th>
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
                        <>
                            {query ? (
                                // If there is a search query, display filtered results
                                filteredData.map((value, index) => {
                                    count = count + 1
                                    return (
                                        <tr key={index}>
                                            <td><input
                                                type="checkbox"
                                                checked={selectedOptions.includes(value._id)}
                                                onChange={() => handleCheckboxChange(value)}
                                                style={{ height: '15px', width: "15px" }}
                                            /></td>
                                            <td >{count}</td>
                                            <td>
                                                <Link to={`/user/${value?.ID}`}>
                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                        <span className={`${value.isActive !== true ? 'text-danger fw-bold' : ""}`}>{value?.ID}</span>
                                                    </button>
                                                </Link>
                                            </td>
                                            <td>
                                                {
                                                    value.profilePhotoStatus === false
                                                        ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                        : <img src={`https://dzhov20ss4n5i.cloudfront.net/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                }
                                                &nbsp;{value?.firstname} {value?.lastname}
                                            </td>
                                            <td>{value.mobile}</td>
                                            <td>{value.gender}</td>
                                            <td>{value?.zone.split('Z')[1] || "-"}</td>
                                            <td>{value?.subzone || "-"}</td>
                                            <td style={{ fontWeight: '600' }}><span className={`${value?.attendance >= 75 ? "text-success" : value?.attendance < 75 && value?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{value?.attendance}%</span></td>
                                            <td>{value?.birthdate?.split('T')[0]?.split('-')[2]}-{value?.birthdate?.split('T')[0]?.split('-')[1]}-{value?.birthdate?.split('T')[0]?.split('-')[0]}</td>
                                            {/* <td>{value?.district}</td>
                                            <td>{value?.taluka}</td>
                                            <td>{value?.village}</td> */}
                                            <td style={{ textTransform: 'capitalize' }}>{value?.role === "zonesubadmin" ? "Sub-admin" : value?.role}</td>
                                            <td>
                                                <Link to={`/user/${value.ID}`}>
                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                        {/* <i className='bx bx-edit-alt'></i> */}
                                                        <i className='bx bx-right-arrow-alt'></i>
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : queryuserID !== "" ? (
                                // If there is a search query, display filtered results
                                filteredDataUserID.map((value, index) => {
                                    count = count + 1
                                    return (
                                        <tr key={index}>
                                            <td><input
                                                type="checkbox"
                                                checked={selectedOptions.includes(value._id)}
                                                onChange={() => handleCheckboxChange(value)}
                                                style={{ height: '15px', width: "15px" }}
                                            /></td>
                                            <td >{count}</td>
                                            <td>
                                                <Link to={`/user/${value?.ID}`}>
                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                        <span className={`${value.isActive !== true ? 'text-danger fw-bold' : ""}`}>{value?.ID}</span>
                                                    </button>
                                                </Link>
                                            </td>
                                            <td>
                                                {
                                                    value.profilePhotoStatus === false
                                                        ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                        : <img src={`https://dzhov20ss4n5i.cloudfront.net/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                }
                                                &nbsp;{value?.firstname} {value?.lastname}
                                            </td>
                                            <td>{value.mobile}</td>
                                            <td>{value.gender}</td>
                                            <td>{value?.zone.split('Z')[1] || "-"}</td>
                                            <td>{value?.subzone || "-"}</td>
                                            <td style={{ fontWeight: '600' }}><span className={`${value?.attendance >= 75 ? "text-success" : value?.attendance < 75 && value?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{value?.attendance}%</span></td>
                                            <td>{value?.birthdate?.split('T')[0]?.split('-')[2]}-{value?.birthdate?.split('T')[0]?.split('-')[1]}-{value?.birthdate?.split('T')[0]?.split('-')[0]}</td>
                                            {/* <td>{value?.district}</td>
                                            <td>{value?.taluka}</td>
                                            <td>{value?.village}</td> */}
                                            <td style={{ textTransform: 'capitalize' }}>{value?.role === "zonesubadmin" ? "Sub-admin" : value?.role}</td>
                                            <td>
                                                <Link to={`/user/${value.ID}`}>
                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                        {/* <i className='bx bx-edit-alt'></i> */}
                                                        <i className='bx bx-right-arrow-alt'></i>
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : queryuserMobile !== "" ? (
                                // If there is a search query, display filtered results
                                filteredDataUserMobile.map((value, index) => {
                                    count = count + 1
                                    return (
                                        <tr key={index}>
                                            <td><input
                                                type="checkbox"
                                                checked={selectedOptions.includes(value._id)}
                                                onChange={() => handleCheckboxChange(value)}
                                                style={{ height: '15px', width: "15px" }}
                                            /></td>
                                            <td >{count}</td>
                                            <td>
                                                <Link to={`/user/${value?.ID}`}>
                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                        <span className={`${value.isActive !== true ? 'text-danger fw-bold' : ""}`}>{value?.ID}</span>
                                                    </button>
                                                </Link>
                                            </td>
                                            <td>
                                                {
                                                    value.profilePhotoStatus === false
                                                        ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                        : <img src={`https://dzhov20ss4n5i.cloudfront.net/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                }
                                                &nbsp;{value?.firstname} {value?.lastname}
                                            </td>
                                            <td>{value.mobile}</td>
                                            <td>{value.gender}</td>
                                            <td>{value?.zone.split('Z')[1] || "-"}</td>
                                            <td>{value?.subzone || "-"}</td>
                                            <td style={{ fontWeight: '600' }}><span className={`${value?.attendance >= 75 ? "text-success" : value?.attendance < 75 && value?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{value?.attendance}%</span></td>
                                            <td>{value?.birthdate?.split('T')[0]?.split('-')[2]}-{value?.birthdate?.split('T')[0]?.split('-')[1]}-{value?.birthdate?.split('T')[0]?.split('-')[0]}</td>
                                            {/* <td>{value?.district}</td>
                                            <td>{value?.taluka}</td>
                                            <td>{value?.village}</td> */}
                                            <td style={{ textTransform: 'capitalize' }}>{value?.role === "zonesubadmin" ? "Sub-admin" : value?.role}</td>
                                            <td>
                                                <Link to={`/user/${value.ID}`}>
                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                        {/* <i className='bx bx-edit-alt'></i> */}
                                                        <i className='bx bx-right-arrow-alt'></i>
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                // If there is no search query, display the full list
                                adminReducer.users?.map((value, index) => {
                                    if (id == value.zone) {
                                        count = count + 1
                                        return (
                                            <tr key={index}>
                                                <td><input
                                                    type="checkbox"
                                                    checked={selectedOptions.includes(value._id)}
                                                    onChange={() => handleCheckboxChange(value)}
                                                    style={{ height: '15px', width: "15px" }}
                                                /></td>
                                                <td >{count}</td>
                                                <td>
                                                    <Link to={`/user/${value?.ID}`}>
                                                        <button className='adminHomeEditBtn mb-2 me-2'>
                                                            <span className={`${value.isActive !== true ? 'text-danger fw-bold' : ""}`}>{value?.ID}</span>
                                                        </button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    {
                                                        value.profilePhotoStatus === false
                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                            : <img src={`https://dzhov20ss4n5i.cloudfront.net/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    }
                                                    &nbsp;{value?.firstname} {value?.lastname}
                                                </td>
                                                <td>{value.mobile}</td>
                                                <td>{value.gender}</td>
                                                <td>{value?.zone.split('Z')[1] || "-"}</td>
                                                <td>{value?.subzone || "-"}</td>
                                                <td style={{ fontWeight: '600' }}><span className={`${value?.attendance >= 75 ? "text-success" : value?.attendance < 75 && value?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{value?.attendance}%</span></td>
                                                <td>{value?.birthdate?.split('T')[0]?.split('-')[2]}-{value?.birthdate?.split('T')[0]?.split('-')[1]}-{value?.birthdate?.split('T')[0]?.split('-')[0]}</td>
                                                {/* <td>{value?.district}</td>
                                            <td>{value?.taluka}</td>
                                            <td>{value?.village}</td> */}
                                                <td style={{ textTransform: 'capitalize' }}>{value?.role === "zonesubadmin" ? "Sub-admin" : value?.role}</td>
                                                <td>
                                                    <Link to={`/user/${value.ID}`}>
                                                        <button className='adminHomeEditBtn mb-2 me-2'>
                                                            {/* <i className='bx bx-edit-alt'></i> */}
                                                            <i className='bx bx-right-arrow-alt'></i>
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    }
                                })
                            )}


                        </>
                        {
                            count === 0
                                ? <tr>
                                    <td colSpan={11} className='text-center'>🙁 No User data</td>
                                </tr>
                                : ""
                        }
                    </tbody>
                </table>
            </div>


            {/* User change zone modal */}
            <div className="modal fade" id="userChangeZoneModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="userChangeZoneModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="userChangeZoneModalLabel">User change zone</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="userChangeZoneModalClose"></button>
                        </div>
                        <div className="modal-body">
                            <div className='row mb-3'>
                                <div className='col-12 col-sm-12 col-md-7 col-lg-8'>
                                    <div className='card p-3' style={{ borderRadius: '15px' }}>
                                        <p>Selected option : {selectedOptions.length}</p>
                                        <table className="table">
                                            <thead style={{ textAlign: 'left' }}>
                                                <tr>
                                                    <td>#</td>
                                                    <th>UID</th>
                                                    <th>Name</th>
                                                    <th>Current zone</th>
                                                    <th>Current subzone</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    selectedOptionsDetails.length === 0
                                                        ? <tr>
                                                            <td colSpan={6} className='text-center'>🙎 Please select users for update zone!</td>
                                                        </tr>
                                                        : selectedOptionsDetails?.map((value, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td >{index + 1}</td>
                                                                    <td>
                                                                        {value?.ID}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            value.profilePhotoStatus === false
                                                                                ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                : <img src={`https://dzhov20ss4n5i.cloudfront.net/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                        }
                                                                        &nbsp;{value?.firstname} {value?.lastname}
                                                                    </td>
                                                                    <td>
                                                                        {value?.zone.split('Z')[1]}
                                                                    </td>
                                                                    <td>
                                                                        {value?.subzone}
                                                                    </td>
                                                                    <td className='text-danger' onClick={() => removeFromChangeUserZone(value)}>
                                                                        <i className='bx bx-x bx-md' style={{ cursor: 'pointer' }}></i>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className='col-12 col-sm-12 col-md-5 col-lg-4'>
                                    <div className='card p-3' style={{ borderRadius: '15px' }}>

                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            {
                                                isAlertVisible
                                                    ? alert('success', 'User zone updated successfully 😊')
                                                    : ""
                                            }
                                            {
                                                adminReducer.user_change_zone_error === true
                                                    ? <div className="alert alert-danger fade show mt-3" role="alert">
                                                        <strong> ⚠️ Opps,</strong>Something went wrong!
                                                    </div>
                                                    : ""
                                            }

                                            <div className='row mt-2'>
                                                <div className="mb-3 mt-3 col-12 ">
                                                    <p>Zone<span className='text-danger'>*</span></p>
                                                    <select
                                                        className="form-control input_field"
                                                        {...register("zone", {
                                                            required: true,
                                                        })}
                                                        onChange={handleChangeSelectedZone}
                                                    >
                                                        <option value="">Tap to select</option>
                                                        {
                                                            adminReducer.zone.map((value, index) => {
                                                                return (
                                                                    <option value={value.ID} key={index}>{value.ID.split('Z')[1]} - {value.name} - {value.pincode}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <small className="text-danger">{errors.zone?.type === 'required' && "Zone is required!"}</small>
                                                </div>

                                                <div className="mb-3 mt-3 col-12">
                                                    <p>Subzone<span className='text-danger'>*</span></p>
                                                    <select
                                                        className="form-control input_field"
                                                        {...register("subzone", {
                                                            required: true,
                                                        })}
                                                    >
                                                        <option value="">Tap to select</option>
                                                        <option value="0">0</option>
                                                        {
                                                            adminReducer.subzone.map((value, index) => {
                                                                if (value.zoneID === selectedzone) {
                                                                    return (
                                                                        <option value={value.ID} key={index}>{value.ID}</option>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </select>
                                                    <small className="text-danger">{errors.subzone?.type === 'required' && "Subzone is required!"}</small>
                                                </div>
                                            </div>
                                            {
                                                adminReducer.user_change_zone_progress === true
                                                    ? <button disabled className="btn btn_signin mb-3 mt-3 col-12">{btnspinner()}</button>
                                                    : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12">Update</button>
                                            }

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default ZoneUser