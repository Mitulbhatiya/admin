import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { alert, btnspinner } from '../../../../constant/alert';
import { REQ_FOR_POST_REMARK_ADMIN_PROGRESS } from '../../../../redux/action';

const AddRemark = () => {

    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    // Success/err message
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [status, setStatus] = useState('')
    const handleButtonClick = () => {
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 5000);
    }


    if (adminReducer.post_remark_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
        setValue('note', '')
        setValue('SATID', '')
    }

    const onSubmit = (dataa) => {
        setStatus(true)
        // console.log(dataa);
        const data = {
            SATID: dataa.SATID,
            note: dataa.note,
            zone: adminReducer.attendanceEach.attendance.zone,
            createdBy: "Admin",
            attendance: adminReducer.attendanceEach.attendance._id,
        }
        dispatch({ type: REQ_FOR_POST_REMARK_ADMIN_PROGRESS, payload: { data } })
    }

    return (
        <>
            <div className='card p-4 mt-5' style={{ borderRadius: '15px' }}>
                {
                    adminReducer.attendanceEach.attendance.attendanceTaken === false
                        ? <div className="alert alert-warning" role="alert">
                            You can add remark after attendance taken!
                        </div>
                        : <>
                            <h5>Create Remark</h5>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {
                                    isAlertVisible
                                        ? alert('success', 'Remark created successfully 😊')
                                        : ""
                                }
                                {
                                    adminReducer.post_remark_error === true
                                        ? <div className="alert alert-danger fade show mt-3" role="alert">
                                            <strong> ⚠️ Opps,</strong> Duplication occur! OR Something went wrong!!
                                        </div>
                                        : ""
                                }

                                <div className="mb-3 mt-3 col-12">
                                    <p>Member<span className='text-danger'>*</span></p>
                                    <select
                                        className="form-control input_field"
                                        {...register("SATID", {
                                            required: true,
                                        })}
                                    >
                                        <option value="">Tap to select</option>
                                        {
                                            adminReducer.attendanceEach.atdetails.length != 0
                                                ? adminReducer.users?.map((value, index) => {
                                                    if (adminReducer.attendanceEach.attendance.zone == value.zone && value.isActive === true && adminReducer.attendanceEach.atdetails.find(obj => obj.SATID === value._id)) {
                                                        return (
                                                            <option value={value.ID} key={index}>{value.ID.split('P')[1]} - {value.name} - {value.lastname} {value.firstname}</option>
                                                        )
                                                    }
                                                })
                                                : adminReducer.users?.map((value, index) => {
                                                    if (adminReducer.attendanceEach.attendance.zone == value.zone && value.isActive === true) {
                                                        return (
                                                            <option value={value.ID} key={index}>{value.ID.split('P')[1]} - {value.name} - {value.lastname} {value.firstname}</option>
                                                        )
                                                    }

                                                })

                                        }
                                    </select>
                                    <small className="text-danger">{errors.SATID?.type === 'required' && "Member is required!"}</small>
                                </div>

                                <div className="mb-3 mt-4">
                                    <p>Note <span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("note", {
                                            required: true,
                                        })}
                                    />
                                    <small className="text-danger">{errors.note?.type === 'required' && "Note is required!"}</small>
                                    <small className="text-danger">{errors.note?.type === 'pattern' && "Sorry! only letters(A-Z) are allowed."}</small>
                                </div>

                                {
                                    adminReducer.post_remark_progress === true
                                        ? <button disabled className="btn btn_signin mb-3 mt-4 col-12">{btnspinner()}</button>
                                        : <button type="submit" className="btn btn_signin mb-3 mt-4 col-12">Create</button>
                                }

                            </form>
                        </>
                }

            </div>
        </>
    )
}

export default AddRemark