import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { REQ_FOR_POST_ZONE_PROGRESS } from '../../redux/action';
import { alert, btnspinner } from '../../constant/alert';

const AddZone = () => {

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
        }, 3000);
    }

    if (adminReducer.post_zone_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
        setValue('name', '')
        setValue('location', '')
        setValue('pincode', '')
        document.getElementById('closeModelAddZone').click()
        window.location.reload()
    }

    const onSubmit = (data) => {
        setStatus(true)
        dispatch({ type: REQ_FOR_POST_ZONE_PROGRESS, payload: { data } })

    }


    return (
        <div className="modal fade" id="AddZone" tabIndex="-1" aria-labelledby="AddZoneLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="AddZoneLabel">Add Zone</h1>
                        <button type="button" id='closeModelAddZone' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {
                                isAlertVisible
                                    ? alert('success', 'Zone created successfully 😊')
                                    : ""
                            }
                            {
                                adminReducer.post_zone_error === true
                                    ? <div className="alert alert-danger fade show mt-3" role="alert">
                                        <strong> ⚠️ Opps,</strong>Invalid authentication!!
                                    </div>
                                    : ""
                            }
                            <div className="mb-3 mt-3">
                                <p>Name<span className='text-danger'>*</span></p>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    {...register("name", {
                                        required: true,
                                        pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                    })}
                                />
                                <small className="text-danger">{errors.name?.type === 'required' && "Zone name is required!"}</small>
                                <small className="text-danger">{errors.name?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                            </div>

                            <div className="mb-3 mt-4">
                                <p>Location<span className='text-danger'>*</span></p>
                                <select
                                    className="form-control input_field"
                                    {...register("location", {
                                        required: true,
                                    })}
                                >
                                    <option value="">Tap to select</option>
                                    {
                                        adminReducer.location.map((value, index) => {
                                            return (
                                                <option value={value._id} key={index}>{value.country} - {value.state} - {value.city}</option>
                                            )
                                        })
                                    }
                                </select>
                                <small className="text-danger">{errors.location?.type === 'required' && "Zone location is required!"}</small>
                            </div>

                            <div className="mb-3 mt-4">
                                <p>Pincode<span className='text-danger'>*</span></p>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    {...register("pincode", {
                                        required: true,
                                        pattern: /^[0-9]+$/i,
                                    })}
                                />
                                <small className="text-danger">{errors.pincode?.type === 'required' && "Zone pincode is required!"}</small>
                                <small className="text-danger">{errors.pincode?.type === 'pattern' && "Sorry! only numbers(0-9) are allowed."}</small>
                            </div>

                            {
                                adminReducer.post_zone_progress === true
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

export default AddZone