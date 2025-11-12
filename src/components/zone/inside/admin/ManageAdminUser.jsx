import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { REQ_FOR_POST_ATTENDANCE_ACCESS_PROGRESS, REQ_FOR_POST_ROLE_USER_PROGRESS } from '../../../../redux/action';
import { alert, btnspinner } from '../../../../constant/alert';
import userImg from '../../../assets/user.png'
const ManageAdminUser = () => {
    const { id } = useParams();
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)



    // Success/err message
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [status, setStatus] = useState('')
    const handleButtonClick = () => {
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 2000);
    }




    const [selectedOptions, setSelectedOptions] = useState([]);

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

    if (adminReducer.post_role_user_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
        setSelectedOptions([])
    }

    const [err, setErr] = useState('')
    const onSubmitSubUser = async () => {
        if (selectedOptions.length === 0) {
            setErr("Please select at-least one user!")
        } else {
            setErr("")
            const data = {
                id: id,
                user: selectedOptions,
                type: 'user'
            }
            setStatus(true)
            dispatch({ type: REQ_FOR_POST_ROLE_USER_PROGRESS, payload: { data } })
        }
    }


    let count = 0

    // Attendance Access
    const [isChangeAccess, setisChangeAccess] = useState(false);
    // Success/err message
    const [isAlertVisible1, setIsAlertVisible1] = useState(false);
    const handleButtonClick1 = () => {
        setIsAlertVisible1(true);
        setTimeout(() => {
            setIsAlertVisible1(false);
        }, 2000);
    }


    const ToggleButton = ({ defaultState, userData }) => {
        const [isOn, setIsOn] = useState(defaultState);

        const toggleState = async () => {
            setIsOn(!isOn);
            const data = {
                userId: userData._id,
                attendanceAccess: userData?.attendancePermission === true ? false : true
            }
            await dispatch({ type: REQ_FOR_POST_ATTENDANCE_ACCESS_PROGRESS, payload: { data } })
            setisChangeAccess(true)
        };
        if (isOn) {
            return (
                <i class='bx bx-toggle-right bx-md' style={{ color: "#47BE68", cursor: 'pointer' }} onClick={toggleState}></i>
            )
        } else {
            return (
                <i class='bx bx-toggle-left bx-md' style={{ color: "#cccccc", cursor: 'pointer' }} onClick={toggleState}></i>
            )
        }
    }


    if (adminReducer.post_attendance_access_success === true && isChangeAccess === true) {
        setisChangeAccess(false)
        handleButtonClick1()
    }

    let subAdmin_count = 0
    adminReducer.users?.map((value, index) => {
        if (id == value.zone && value.role === "admin") {
            subAdmin_count = subAdmin_count + 1
        }
    })
    return (
        <>
            <p>Admins count : {subAdmin_count}</p>
            <div className="d-flex justify-content-end">
                {
                    adminReducer.post_role_user_progress === true
                        ? <button className='btn btn-md btn-outline-primary ' disabled>{btnspinner()}</button>
                        : <button className='btn btn-md btn-outline-danger' onClick={() => onSubmitSubUser()}>Admin to User</button>
                }
            </div>
            <div className='row mt-4'>
                {
                    isAlertVisible
                        ? alert('success', 'User role updated successfully 😊')
                        : ""
                }
                {
                    isAlertVisible1
                        ? alert('success', 'User attendance access updated successfully 😊')
                        : ""
                }
                {
                    adminReducer.post_attendance_access_progress === true
                        ? <div className="alert alert-warning  fade show mt-3" role="alert">
                            <strong> ⚠️ Wait,</strong>We are updating details!
                        </div>
                        : ""
                }
                {
                    adminReducer.post_attendance_access_error === true
                        ? <div className="alert alert-danger  fade show mt-3" role="alert">
                            <strong> ⚠️ Opps,</strong>Something went wrong! On update attendance access role!

                        </div>
                        : ""
                }
                {
                    adminReducer.post_role_user_error === true
                        ? <div className="alert alert-danger  fade show mt-3" role="alert">
                            <strong> ⚠️ Opps,</strong>Something went wrong!

                        </div>
                        : ""
                }
                {
                    err !== ""
                        ? <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                            <strong> ⚠️ Opps,</strong> {err}
                        </div>
                        : ""
                }
                <div className='col-12 ' style={{ overflowX: 'auto' }}>
                    <table className="table">
                        <thead style={{ textAlign: 'left' }}>
                            <tr>
                                <td></td>
                                <td>#</td>
                                <th>UID</th>
                                <th>Name</th>
                                <th>Zone</th>
                                <th>Subzone</th>
                                <th>Gender</th>
                                <th>Role</th>
                                <th>Attendance access</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                adminReducer.users?.map((value, index) => {
                                    if (id == value.zone && value?.role === 'admin') {
                                        count = count + 1

                                        return (
                                            <tr key={index}>
                                                <td><input
                                                    type="checkbox"
                                                    checked={selectedOptions.includes(value._id)}
                                                    onChange={() => handleCheckboxChange(value._id)}
                                                /></td>
                                                <td >{count}</td>
                                                <td>
                                                    <Link to={`/user/${value?.ID}`}>
                                                        <button className='adminHomeEditBtn mb-2 me-2'>
                                                            {value?.ID}
                                                        </button>
                                                    </Link>
                                                </td>
                                                <td>
                                                    {
                                                        value.profilePhotoStatus === false
                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                            : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                    }
                                                    &nbsp;{value?.firstname} {value?.lastname}
                                                </td>
                                                <td>{value?.zone.split('Z')[1] || "-"}</td>
                                                <td>{value?.subzone || "-"}</td>
                                                <td>{value.gender}</td>

                                                <td style={{ textTransform: 'capitalize' }}>{value?.role === "zonesubadmin" ? "Sub-admin" : value?.role}</td>
                                                <td style={{ textTransform: 'capitalize' }}>
                                                    {value?.attendancePermission === true
                                                        ? <ToggleButton defaultState={true} userData={value} />
                                                        : <ToggleButton defaultState={false} userData={value} />}
                                                </td>
                                            </tr>
                                        )
                                    }
                                })
                            }
                            {
                                count === 0
                                    ? <tr>
                                        <td colSpan={9} className='text-center'>🙁 No User data</td>
                                    </tr>
                                    : ""
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}

export default ManageAdminUser