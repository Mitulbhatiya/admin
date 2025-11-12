import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { REQ_FOR_POST_ROLE_USER_PROGRESS } from '../../../../redux/action';
import { alert, btnspinner } from '../../../../constant/alert';
import userImg from '../../../assets/user.png'
const AddAdminUser = () => {
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
            document.getElementById('closeModelAddAdmin').click()
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
    const onSubmitAdmin = async () => {
        if (selectedOptions.length === 0) {
            setErr("Please select at-least one user!")
        } else {
            setErr("")
            const data = {
                id: id,
                user: selectedOptions,
                type: 'admin'
            }
            setStatus(true)
            dispatch({ type: REQ_FOR_POST_ROLE_USER_PROGRESS, payload: { data } })
        }
    }

    // console.log(selectedOptions); 

    let count = 0
    return (
        <div className="modal fade" id="AddAdmin" tabIndex="-1" aria-labelledby="AddAdminLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="AddAdminLabel">Add admin</h1>

                        <button type="button" id='closeModelAddAdmin' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="d-flex justify-content-end">
                            {
                                adminReducer.post_role_user_progress === true
                                    ? <button className='btn btn-md btn-outline-primary ' disabled>{btnspinner()}</button>
                                    : <button className='btn btn-md btn-outline-primary ' onClick={() => onSubmitAdmin()}>Add</button>
                            }
                        </div>
                        <div className='row mt-4'>
                            {
                                isAlertVisible
                                    ? alert('success', 'User role updated successfully 😊')
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            adminReducer.users?.map((value, index) => {
                                                if (id == value.zone && value?.role === 'user') {
                                                    count = count + 1
                                                    return (
                                                        <tr key={index}>
                                                            <td><input
                                                                type="checkbox"
                                                                checked={selectedOptions.includes(value._id)}
                                                                onChange={() => handleCheckboxChange(value._id)}
                                                            /></td>
                                                            <td >{count}</td>
                                                            <td>{value?.ID}</td>
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

                                                            <td style={{ textTransform: 'capitalize' }}>{value?.role}</td>

                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                        {
                                            count === 0
                                                ? <tr>
                                                    <td colSpan={8} className='text-center'>🙁 No User data</td>
                                                </tr>
                                                : ""
                                        }
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddAdminUser