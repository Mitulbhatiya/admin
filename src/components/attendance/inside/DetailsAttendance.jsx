import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom';
import { REQ_FOR_PATCH_EACH_ATTENDANCE_PROGRESS } from '../../../redux/action';
import { spinner } from '../../../constant/alert';
import userImg from '../../assets/user.png'

const DetailsAttendance = () => {
    const { id } = useParams();
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)
    let usersdata = adminReducer.users

    const location = useLocation();
    const receivedData = location.state?.data;
    // console.log(receivedData);

    // Success/err message
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [status, setStatus] = useState('')
    const handleButtonClick = () => {
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
            window.location.reload()
        }, 2000);
    }


    const getTimeFunction = (dd) => {
        const utcTimestamp = dd; // Note the 'Z' at the end, indicating UTC
        const utcDate = new Date(utcTimestamp);
        const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // 5.5 hours in milliseconds
        // Date
        var istDateString = istDate.toISOString();
        istDateString = istDateString.split("T")[0].split("-")[2] + "-" + istDateString.split("T")[0].split("-")[1] + "-" + istDateString.split("T")[0].split("-")[0]
        // This gives you the IST timestamp
        const date = new Date(utcTimestamp);
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());
        // Time
        const istTime = date.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        return {
            istTime,
            istDateString
        }
    }



    const [selectedOptions, setSelectedOptions] = useState([]);
    // Get replica of existing id 
    const [selectErr, setselectErr] = useState("");
    const [isChecked, setisChecked] = useState(true);
    // Single Check
    const handleCheckboxChange = (id) => {
        // Check if the option is already selected
        const isSelected = selectedOptions.includes(id);

        // Update the state based on the current selection
        if (isSelected) {
            setSelectedOptions(selectedOptions.filter((optionId) => optionId !== id));
        } else {
            setSelectedOptions([...selectedOptions, id]);
        }
    };

    // Select All (Checkbox)
    const handleCheckboxChangeAll = async (data) => {
        setisChecked(!isChecked)
        if (isChecked === true) {
            const allIds = await adminReducer.users?.map((option) => {
                if (adminReducer.attendanceEach.attendance.zone === option.zone) {
                    return option._id
                }
            }).filter((element) => element !== undefined)
            setSelectedOptions(allIds);
            // console.log(allIds.filter((element) => element !== undefined));
        } else {
            setSelectedOptions([]);
        }
    };
    // console.log(selectedOptions);

    const submitAttendance = async () => {
        if (user === 0) {
            setselectErr(" ⚠️ No user found in this zone!")
        } else {
            setselectErr("")
            const allAIds = await adminReducer.users?.map((option) => {
                if (adminReducer.attendanceEach?.attendance.zone === option.zone) {
                    if (!selectedOptions.includes(option._id)) {
                        return option._id
                    }
                }
            }).filter((element) => element !== undefined)

            const data = {
                type: adminReducer.attendanceEach.attendance.attendanceTaken === false ? "new" : "update",
                presentID: selectedOptions,
                absentID: allAIds,
                zone: adminReducer.attendanceEach.attendance.zone,
                attendance: id,
                date: adminReducer.attendanceEach.attendance.date
            }
            // console.log(data);
            setStatus(true)
            dispatch({ type: REQ_FOR_PATCH_EACH_ATTENDANCE_PROGRESS, payload: { data } })
        }

    }

    if (adminReducer.patch_each_attendance_success === true && status === true) {
        handleButtonClick()
        setStatus(false)
    }


    // ================================ Filter =========================================

    // Live search by Username
    const [query, setQuery] = useState('');
    // Function to handle changes in the search query
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Filter the array based on the search query
    const filteredData = adminReducer.users.filter(item =>
        (item.firstname.toLowerCase() + " " + item.lastname.toLowerCase()).includes(query.toLowerCase())
    );


    // Live search by zone ID
    const [queryuserID, setQueryuserID] = useState('');

    // Function to handle changes in the search query for ZoneID
    const handleInputChange_UserID = (e) => {
        setQueryuserID(e.target.value)

    };
    // Filter the array based on the search query for ZoneID
    const filteredDataUserID = adminReducer.users.filter(item =>
        item.ID.split('P')[1].toUpperCase().includes(queryuserID.toUpperCase())
    );

    // ================================ Filter END =========================================


    let totalCountUser = 0
    adminReducer.users?.map((value, index) => {
        if (adminReducer.attendanceEach.attendance.zone == value.zone) {
            totalCountUser = totalCountUser + 1
        }
    })


    // Time
    const d = adminReducer.attendanceEach.attendance?.date.split('T')
    const t = d[1].split('.')[0]

    const [hours, minutes, seconds] = t.split(':').map(Number);

    // Create a new Date object and set the time
    const date1 = new Date();
    date1.setHours(hours);
    date1.setMinutes(minutes);
    date1.setSeconds(seconds);

    // Convert to 12-hour format with AM/PM
    const formattedTime = date1.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const date = `${d[0].split('-')[2]}-${d[0].split('-')[1]}-${d[0].split('-')[0]}`
    const time = formattedTime


    // Count user
    let user = 0
    useEffect(() => {

        (async () => {
            const allIds = await adminReducer.attendanceEach.atdetails?.map((option) => {
                if (adminReducer.attendanceEach.attendance._id === option.attendance && option.isPresent === true) {
                    return option.SATID
                }
            }).filter((element) => element !== undefined)
            setSelectedOptions(allIds)
            if (localStorage.getItem('UID')) {
                await setQueryuserID(localStorage.getItem('UID').split('P')[1])
            }
            // console.log("call1");
        })();

        return () => { };
    }, [id])

    return (
        <>

            <div className='mt-3'>
                <div className="d-flex justify-content-between">
                    {/* <h4 className="adminhome_statistics_font">Attendance 🧾</h4> */}
                </div>
                <div className='row mt-3 profile'>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                <small>Zone 🙎</small>
                                <h4 className="user_profile_details_text">
                                    {adminReducer.attendanceEach.attendance.zone.split('Z')[1]}
                                </h4>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                <small>CreatedBy </small>
                                <h4 className="user_profile_details_text">
                                    {adminReducer.attendanceEach.attendance.createdBy || "--"}
                                </h4>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                <small>Description </small>
                                <h4 className="user_profile_details_text">
                                    {adminReducer.attendanceEach.attendance.description || "--"}
                                </h4>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                <small>Attendance Taken</small>
                                <h4 className="user_profile_details_text">
                                    <span className={`${adminReducer.attendanceEach.attendance?.attendanceTaken === false ? 'status_pending' : 'status_completed'}`}>{adminReducer.attendanceEach.attendance?.attendanceTaken === false ? "Pending" : "Comnpleted"}</span>
                                </h4>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                <small>Date </small>
                                <h4 className="user_profile_details_text">
                                    {date} - {formattedTime}
                                </h4>
                            </div>

                            {
                                adminReducer.attendanceEach.attendance?.attendanceTaken === false
                                    ? <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                        <small>Availabile for attendance</small>
                                        <h4 className="user_profile_details_text">
                                            {totalCountUser}
                                        </h4>
                                    </div>
                                    : <>
                                        <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                            <small>Availabile for attendance</small>
                                            <h4 className="user_profile_details_text">
                                                {adminReducer.attendanceEach.atdetails.length || "--"}
                                            </h4>
                                        </div>
                                        <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                            <small>Present</small>
                                            <h4 className="user_profile_details_text">
                                                {selectedOptions.length}
                                            </h4>
                                        </div>
                                        <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                            <small>Absent</small>
                                            <h4 className="user_profile_details_text">
                                                {adminReducer.attendanceEach.atdetails.length - selectedOptions.length}
                                            </h4>
                                        </div>
                                    </>
                            }

                        </div>
                    </div>
                </div>
            </div>



            {
                selectErr !== ""
                    ? <div className="alert alert-warning mt-4" role="alert">
                        {selectErr}
                    </div>
                    : ""
            }
            {
                adminReducer.patch_each_attendance_error === true
                    ? <div className="alert alert-danger fade show mt-4" role="alert">
                        <strong> ⚠️ Opps,</strong>Something went wrong!
                    </div>
                    : ""
            }

            {
                isAlertVisible
                    ? <div className="alert alert-success fade show mt-4" role="alert">
                        <strong> 🔥Attendacen,</strong> updated successfully! Wait for reload!
                    </div>
                    : ""
            }
            {/* {
                adminReducer.patch_each_attendance_success === true
                    ?
                    : ""
            } */}
            <div className='mt-3'>
                <input
                    type="text"
                    className='my-4'
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search by name"
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
            </div>

            <div className='mt-5 d-flex justify-content-between'>
                <div>
                    <input
                        type="checkbox"
                        // checked="checked"
                        style={{ height: '15px', width: '15px' }}
                        onChange={() => handleCheckboxChangeAll(isChecked)}
                    /> <span className='ms-3'>Click to make all present</span>
                </div>
                <div>
                    {
                        adminReducer.patch_each_attendance_progress === true
                            ? <button className='adminHomeEditBtn mb-2 me-2' disabled>
                                {spinner()}
                            </button>
                            : <button className='adminHomeEditBtn mb-2 me-2' onClick={() => submitAttendance()}>
                                Update
                            </button>
                    }
                </div>
            </div>

            <div className='row mt-4 mb-5'>

                <>
                    {query ? (
                        // If there is a search query, display filtered results
                        adminReducer.attendanceEach.atdetails.length != 0
                            ? filteredData.map((value, index) => {
                                if (adminReducer.attendanceEach.attendance?.zone == value.zone && value.isActive === true && adminReducer.attendanceEach.atdetails.find(obj => obj.SATID === value._id)) {
                                    user = user + 1
                                    return (
                                        <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-4' key={index}>


                                            <input
                                                type="checkbox"

                                                checked={selectedOptions.includes(value._id)}
                                                onChange={() => handleCheckboxChange(value._id)}
                                            />
                                            <span className='mx-3'>{value?.ID}</span>

                                            {
                                                value.profilePhotoStatus === false
                                                    ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                            }
                                            &nbsp; {value?.firstname} {value?.lastname}

                                        </div>
                                    )
                                }
                            })
                            : filteredData.map((value, index) => {
                                if (adminReducer.attendanceEach.attendance?.zone == value.zone && value.isActive === true) {
                                    user = user + 1
                                    return (
                                        <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-4' key={index}>


                                            <input
                                                type="checkbox"

                                                checked={selectedOptions.includes(value._id)}
                                                onChange={() => handleCheckboxChange(value._id)}
                                            />
                                            <span className='mx-3'>{value?.ID}</span>

                                            {
                                                value.profilePhotoStatus === false
                                                    ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                            }
                                            &nbsp; {value?.firstname} {value?.lastname}

                                        </div>
                                    )
                                }
                            })
                    ) : queryuserID !== "" ? (
                        // If there is a search query, display filtered results
                        adminReducer.attendanceEach.atdetails.length != 0
                            ? filteredDataUserID.map((value, index) => {
                                if (adminReducer.attendanceEach.attendance?.zone == value.zone && value.isActive === true && adminReducer.attendanceEach.atdetails.find(obj => obj.SATID === value._id)) {
                                    localStorage.clear()
                                    user = user + 1
                                    return (
                                        <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-4' key={index}>


                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.includes(value._id)}
                                                onChange={() => handleCheckboxChange(value._id)}
                                            />
                                            <span className='mx-3'>{value?.ID}</span>
                                            {
                                                value.profilePhotoStatus === false
                                                    ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                            }
                                            &nbsp; {value?.firstname} {value?.lastname}

                                        </div>
                                    )
                                }
                            })
                            : filteredDataUserID.map((value, index) => {
                                if (adminReducer.attendanceEach.attendance?.zone == value.zone && value.isActive === true) {
                                    localStorage.clear()
                                    user = user + 1
                                    return (
                                        <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-4' key={index}>


                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.includes(value._id)}
                                                onChange={() => handleCheckboxChange(value._id)}
                                            />
                                            <span className='mx-3'>{value?.ID}</span>
                                            {
                                                value.profilePhotoStatus === false
                                                    ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                            }
                                            &nbsp; {value?.firstname} {value?.lastname}

                                        </div>
                                    )
                                }
                            })
                    ) : (
                        // If there is no search query, display the full list
                        adminReducer.attendanceEach.atdetails.length != 0
                            ? adminReducer.users?.map((value, index) => {
                                if (adminReducer.attendanceEach.attendance?.zone == value.zone && value.isActive === true && adminReducer.attendanceEach.atdetails.find(obj => obj.SATID === value._id)) {
                                    user = user + 1
                                    return (
                                        <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-4' key={index}>


                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.includes(value._id)}
                                                onChange={() => handleCheckboxChange(value._id)}
                                            />
                                            <span className='mx-3'>{value?.ID}</span>
                                            {
                                                value.profilePhotoStatus === false
                                                    ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                            }
                                            &nbsp; {value?.firstname} {value?.lastname}

                                        </div>
                                    )
                                }
                            })
                            : adminReducer.users?.map((value, index) => {
                                if (adminReducer.attendanceEach.attendance?.zone == value.zone && value.isActive === true) {
                                    user = user + 1
                                    return (
                                        <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-4' key={index}>


                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.includes(value._id)}
                                                onChange={() => handleCheckboxChange(value._id)}
                                            />
                                            <span className='mx-3'>{value?.ID}</span>
                                            {
                                                value.profilePhotoStatus === false
                                                    ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                            }
                                            &nbsp; {value?.firstname} {value?.lastname}

                                        </div>
                                    )
                                }
                            })
                    )}
                </>

                {
                    user === 0
                        ? <div className="alert alert-success fade show mt-4" role="alert">
                            <strong> ⚠️ No USER,</strong> linked with zone!
                        </div>
                        : ""
                }
            </div>
        </>
    )
}

export default DetailsAttendance