import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userImg from '../../assets/user.png'
import { REQ_FOR_POST_MASTER_ATTENDANCE_KEY_PROGRESS, REQ_FOR_POST_MASTER_ATTENDANCE_SUBMIT_PROGRESS } from '../../../redux/action'
import { alert } from '../../../constant/alert'
const ZoneList = () => {

    const adminReducer = useSelector(state => state.adminReducer)
    const dispatch = useDispatch()

    const [proceedChecked, setproceedChecked] = useState(false);
    const [userCount, setUserCount] = useState(0);

    const [description, setDescription] = useState("")
    const [atDate, setAtDate] = useState("")

    const [generateKeyStatus, setGenerateKeyStatus] = useState(false)
    // ================================= Selection zone ================================

    const [selectedOptionsZone, setSelectedOptionsZone] = useState([]);
    const [selectedOptionsZoneDetails, setSelectedOptionsZoneDetails] = useState([]);

    // Get replica of existing id 

    const [isCheckedZone, setisCheckedZone] = useState(true);
    // Single Check
    const handleCheckboxChangeZone = (value) => {
        // Check if the option is already selected
        const isSelected = selectedOptionsZone.includes(value.ID);

        // Update the state based on the current selection
        if (isSelected) {
            setSelectedOptionsZone(selectedOptionsZone.filter((optionId) => optionId !== value.ID));
            setSelectedOptionsZoneDetails(selectedOptionsZoneDetails.filter((optionId) => optionId.ID !== value.ID));
        } else {
            setSelectedOptionsZone([...selectedOptionsZone, value.ID]);
            setSelectedOptionsZoneDetails([...selectedOptionsZoneDetails, value]);
        }
    };

    // Select All (Checkbox)
    const handleCheckboxChangeZoneAll = async (data) => {
        setisCheckedZone(!isCheckedZone)
        if (isCheckedZone === true) {
            const allIds = await adminReducer.zone?.map((option) => {
                return option.ID
            }).filter((element) => element !== undefined)
            setSelectedOptionsZone(allIds);
            // console.log(allIds.filter((element) => element !== undefined));

            const allIdsdetails = await adminReducer.zone?.map((value) => {
                return value
            }).filter((element) => element !== undefined)
            setSelectedOptionsZoneDetails(allIdsdetails);
        } else {
            setSelectedOptionsZone([]);
            setSelectedOptionsZoneDetails([]);
        }
    };

    const clickOnProccedBtn = async () => {
        setproceedChecked(true)
        let userCount = 0
        await adminReducer.users?.map((option) => {
            if (selectedOptionsZone.includes(option.zone) && option.isActive === true) {
                userCount = userCount + 1
            }
        })
        setUserCount(userCount)
    }

    // ================================ End of selection zone ====================


    // ============================= Attendance data ===========================


    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedOptionsDetails, setSelectedOptionsDetails] = useState([]);
    // Get replica of existing id 
    const [selectErr, setselectErr] = useState("");
    const [isChecked, setisChecked] = useState(true);
    // Single Check
    const handleCheckboxChange = (value) => {
        // Check if the option is already selected
        const isSelected = selectedOptions.includes(value._id);

        // Update the state based on the current selection
        if (isSelected) {
            setSelectedOptions(selectedOptions.filter((optionId) => optionId !== value._id));
            setSelectedOptionsDetails(selectedOptionsDetails.filter((optionId) => optionId._id !== value._id));
        } else {
            setSelectedOptions([...selectedOptions, value._id]);
            setSelectedOptionsDetails([...selectedOptionsDetails, value]);
        }
    };

    // Select All (Checkbox)
    const handleCheckboxChangeAll = async (data) => {
        setisChecked(!isChecked)
        if (isChecked === true) {
            const allIds = await adminReducer.users?.map((option) => {
                if (selectedOptionsZone.includes(option.zone) && option.isActive === true) {
                    return option._id
                }
            }).filter((element) => element !== undefined)
            setSelectedOptions(allIds);

            const allIdsdetails = await adminReducer.users?.map((option) => {
                if (selectedOptionsZone.includes(option.zone) && option.isActive === true) {
                    return option
                }
            }).filter((element) => element !== undefined)
            setSelectedOptionsDetails(allIdsdetails);
        } else {
            setSelectedOptions([]);
            setSelectedOptionsDetails([])
        }
    };



    // ============================= Attendance data End ===========================


    // ========================== Generate Attendance Key ==========================

    // Success/err message
    const [isAlertVisibleGenerateMasterKey, setIsAlertVisibleGenerateMasterKey] = useState(false);
    const [statusMasterKey, setStatusMasterKey] = useState('')
    const handleButtonClickMasterKey = () => {
        setIsAlertVisibleGenerateMasterKey(true);
        setTimeout(() => {
            setIsAlertVisibleGenerateMasterKey(false);
        }, 5000);
    }

    if (adminReducer.post_master_attendance_key_success === true && statusMasterKey === true) {
        setStatusMasterKey(false)
        handleButtonClickMasterKey()
        // setAtDate('')
        // setDescription('')
    }

    const generateAttendanceKey = async () => {
        // console.log(description, atDate);
        const data = []
        await selectedOptionsZone.map((value) => {
            data.push({
                description: description,
                zone: value,
                date: atDate,
                createdBy: "Admin",
                attendanceTaken: false,
                isActive: true
            })
        })
        // console.log(data);
        setGenerateKeyStatus(true)
        setStatusMasterKey(true)
        dispatch({ type: REQ_FOR_POST_MASTER_ATTENDANCE_KEY_PROGRESS, payload: { data } })
    }

    // ========================Generate Attendance Key End ==========================


    // ========================= Submit attendacen ========================



    // Success/err message
    const [isAlertVisibleGenerateMastersubmit, setIsAlertVisibleGenerateMastersubmit] = useState(false);
    const [statusMastersubmit, setStatusMastersubmit] = useState('')
    const handleButtonClickMastersubmit = () => {
        setIsAlertVisibleGenerateMastersubmit(true);
        setTimeout(() => {
            setIsAlertVisibleGenerateMastersubmit(false);
            window.location.reload()
        }, 5000);
    }

    if (adminReducer.post_master_attendance_submit_success === true && statusMastersubmit === true) {
        setStatusMastersubmit(false)
        handleButtonClickMastersubmit()
        setAtDate('')
        setDescription('')
    }

    const submitAttendance = async () => {

        const allAIds = await adminReducer.users?.map((option) => {
            if (selectedOptionsZone.includes(option.zone) && option.isActive === true) {
                if (!selectedOptions.includes(option._id)) {
                    return option
                }
            }
        }).filter((element) => element !== undefined)
        const data = {
            presentID: selectedOptionsDetails,
            absentID: allAIds,
            mainAttendance: adminReducer.masterAttendance,
        }
        // console.log(data);
        setStatusMastersubmit(true)
        dispatch({ type: REQ_FOR_POST_MASTER_ATTENDANCE_SUBMIT_PROGRESS, payload: { data } })
    }

    // ========================= Submit attendacen end ========================

    let user = 0


    // console.log(selectedOptionsZone, selectedOptionsZoneDetails);
    return (
        <>
            {
                selectedOptionsZone.length > 1 && selectedOptionsZoneDetails.length > 1
                    ? proceedChecked === false
                        ? <div className='d-flex justify-content-end mb-4'>
                            <button className='btn btn-outline-secondary me-3' onClick={() => clickOnProccedBtn()}>Proceed</button>
                        </div>
                        : <>
                            <div className='d-flex justify-content-end mb-4 me-3'>
                                {
                                    generateKeyStatus === false
                                        ? <button className='btn btn-outline-secondary me-3 mb-3' onClick={() => setproceedChecked(false)}>Back to selection</button>
                                        : ""
                                }

                                {
                                    description !== "" && atDate !== "" && generateKeyStatus === false
                                        ? adminReducer.post_master_attendance_key_progress === true
                                            ? <button className='btn btn-outline-success mb-3' disabled>Generating...</button>
                                            : <button className='btn btn-outline-success mb-3' onClick={() => generateAttendanceKey()}>Generate attendance key</button>
                                        : ""
                                }
                                {
                                    generateKeyStatus === true
                                        ? adminReducer.post_master_attendance_key_success === true
                                            ? adminReducer.post_master_attendance_submit_progress === true
                                                ? <button className='btn btn-outline-success mb-3' onClick={() => submitAttendance()}>Submiting..</button>
                                                : <button className='btn btn-outline-success mb-3' onClick={() => submitAttendance()}>Submit attendance</button>
                                            : ""
                                        : ""
                                }
                            </div>
                        </>
                    : ""
            }

            {
                isAlertVisibleGenerateMasterKey
                    ? alert('success', 'Attendance master key generated successfully 😊')
                    : ""
            }
            {
                adminReducer.post_master_attendance_key_error === true
                    ? <div className="alert alert-danger fade show mt-3" role="alert">
                        <strong> ⚠️ Opps,</strong> Something went wrong!!
                    </div>
                    : ""
            }

            {
                isAlertVisibleGenerateMastersubmit
                    ? alert('success', 'Master attendance submited successfully 😊')
                    : ""
            }
            {
                adminReducer.post_master_attendance_submit_error === true
                    ? <div className="alert alert-danger fade show mt-3" role="alert">
                        <strong> ⚠️ Opps,</strong> Something went wrong!!
                    </div>
                    : ""
            }

            {/* ---------------------------- Selcetion zone --------------------------- */}

            {
                proceedChecked === false
                    ? <>
                        <div className='col-12' style={{ overflowX: 'auto', maxHeight: '500px' }}>
                            <table className="table">
                                <thead style={{ textAlign: 'left' }}>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                // checked="checked"
                                                style={{ height: '15px', width: '15px' }}
                                                onChange={() => handleCheckboxChangeZoneAll(isCheckedZone)}
                                            />
                                        </td>
                                        <td>#</td>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Pincode</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        adminReducer.zone?.map((value, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedOptionsZone.includes(value.ID)}
                                                            onChange={() => handleCheckboxChangeZone(value)}
                                                        />
                                                    </td>
                                                    <td >{index + 1}</td>
                                                    <td>{value?.ID.split('Z')[1]}</td>
                                                    <td>{value?.name}</td>
                                                    <td>{value?.pincode}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        {/* --------------------- End of selection zone --------------------------- */}
                    </>
                    : <>
                        <div className='row'>
                            <div className="mb-3 mt-3 col-12 col-md-6">
                                <p>Description<span className='text-danger'>*</span></p>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    defaultValue={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 mt-3 col-12 col-md-6 ">
                                <p>Date<span className='text-danger'>*</span></p>
                                <input
                                    type="datetime-local"
                                    className="form-control input_field"
                                    defaultValue={atDate}
                                    onChange={(e) => setAtDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='mt-3 mb-4'>
                            <div className='row mt-3 profile'>
                                <div className='col-12'>

                                    <div className='row'>
                                        <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                            <small>Zones 🙎</small>
                                            <h4 className="user_profile_details_text">
                                                {
                                                    selectedOptionsZone.map((value, index) => {
                                                        return (
                                                            <span key={index}>
                                                                {value.split('Z')[1]},&nbsp;
                                                            </span>
                                                        )
                                                    })
                                                }
                                            </h4>
                                        </div>
                                        <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                            <small>CreatedBy </small>
                                            <h4 className="user_profile_details_text">
                                                Admin
                                            </h4>
                                        </div>
                                        <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mb-3'>
                                            <small>Total users </small>
                                            <h4 className="user_profile_details_text">
                                                {userCount}
                                            </h4>
                                        </div>

                                        <div className='col-6 col-sm-6 col-md-6 col-lg-6 col-xl-4 mb-3'>
                                            <small>Assumption </small>
                                            <h4 className="user_profile_details_text">
                                                <div>Z = Zone</div>
                                                <div>U = User ID (Ex:- SATP1 = U1)</div>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* ---------------------------------- User list for Attendance ------------------------ */}
                        <div style={{ overflow: 'auto', maxHeight: '500px' }
                        }>
                            {
                                adminReducer.post_master_attendance_key_success === true
                                    ? <>
                                        <div>
                                            <input
                                                type="checkbox"
                                                // checked="checked"
                                                style={{ height: '15px', width: '15px' }}
                                                onChange={() => handleCheckboxChangeAll(isChecked)}
                                            /> <span className='ms-3'>Click to make all present</span>
                                        </div>
                                        <div className='row mt-4 mb-5'>
                                            {
                                                adminReducer.users?.map((value, index) => {
                                                    if (selectedOptionsZone.includes(value.zone) && value.isActive === true) {
                                                        user = user + 1
                                                        return (
                                                            <div className='col-12 col-sm-6 col-md-4 col-lg-3 mt-4 mb-5' key={index}>

                                                                <span> #{user} </span>
                                                                &nbsp;
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedOptions.includes(value._id)}
                                                                    onChange={() => handleCheckboxChange(value)}
                                                                    style={{ height: '15px', width: '15px' }}
                                                                />
                                                                <span className='mx-3'>Z{value.zone.split('Z')[1]} &nbsp;U {value?.ID.split('P')[1]}</span>
                                                                <br />
                                                                <div className='mt-3'>
                                                                    {
                                                                        value.profilePhotoStatus === false
                                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                            : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                    }
                                                                    &nbsp; {value?.firstname} {value?.lastname}
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    </>
                                    : ""
                            }
                        </div>
                    </>
            }




        </>
    )
}

export default ZoneList