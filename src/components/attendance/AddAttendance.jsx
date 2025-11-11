import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { alert, btnspinner } from '../../constant/alert';
import { REQ_FOR_POST_ATTENDANCE_PROGRESS } from '../../redux/action';

const AddAttendance = () => {

    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();

    // Success/err message
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [status, setStatus] = useState('')
    const handleButtonClick = () => {
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
    }

    if (adminReducer.post_attendance_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
        setValue('description', '')
        setValue('zone', '')
        setValue('date', '')
        document.getElementById('closeModelAddAttendance').click()
    }


    const onSubmit = (dataa) => {
        const data = {
            description: dataa.description,
            zone: dataa.zone,
            date: dataa.date,
            createdBy: "Admin"
        }
        setStatus(true)
        dispatch({ type: REQ_FOR_POST_ATTENDANCE_PROGRESS, payload: { data } })
    }
    return (
        <div className="modal fade" id="AddAttendance" tabIndex="-1" aria-labelledby="AddAttendanceLabel" aria-hidden="true">
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="AddAttendanceLabel">Add attendance</h1>
                        <button type="button" id='closeModelAddAttendance' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)} enctype="multipart/form-data">
                            {
                                isAlertVisible
                                    ? alert('success', 'Attendance created successfully 😊')
                                    : ""
                            }
                            {
                                adminReducer.post_attendance_error === true
                                    ? <div className="alert alert-danger  fade show mt-3" role="alert">
                                        <strong> ⚠️ Opps,</strong>Something went wrong!
                                    </div>
                                    : ""
                            }
                            <div className='row'>
                                <div className="mb-3 mt-3 col-12 ">
                                    <p>Description<span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("description", {
                                            required: true,
                                            pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                        })}
                                    />
                                    <small className="text-danger">{errors.description?.type === 'required' && "Description is required!"}</small>
                                    <small className="text-danger">{errors.description?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                                </div>
                                <div className="mb-3 mt-3 col-12 ">
                                    <p>Zone<span className='text-danger'>*</span></p>
                                    <select
                                        className="form-control input_field"
                                        {...register("zone", {
                                            required: true,
                                        })}
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

                                <div className="mb-3 mt-3 col-12 ">
                                    <p>Date<span className='text-danger'>*</span></p>
                                    <input
                                        type="datetime-local"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("date", {
                                            required: true,
                                        })}
                                    />
                                    <small className="text-danger">{errors.date?.type === 'required' && "Date is required!"}</small>
                                </div>
                            </div>


                            {
                                adminReducer.post_attendance_progress === true
                                    ? <button disabled className="btn btn_signin mb-3 mt-3 col-12">{btnspinner()}</button>
                                    : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12">Add</button>
                            }

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddAttendance