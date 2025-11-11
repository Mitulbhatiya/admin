import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux'
import { alert, btnspinner } from '../../constant/alert';
import { REQ_FOR_POST_LOCATION_DATA_ADMIN_PROGRESS } from '../../redux/action';

const AddLocality = () => {

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

    if (adminReducer.post_locationData_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
        setValue('city', '')
        setValue('state', '')
        setValue('country', '')
    }

    const onSubmit = (dataa) => {
        setStatus(true)
        const data = {
            city: dataa.city,
            state: dataa.state,
            country: dataa.country,
        }
        dispatch({ type: REQ_FOR_POST_LOCATION_DATA_ADMIN_PROGRESS, payload: { data } })
    }
    return (
        <>
            <h5>Create Locality</h5>
            <small className='mt-4'>Note:- Use all latters in capital!</small>
            <form onSubmit={handleSubmit(onSubmit)}>
                {
                    isAlertVisible
                        ? alert('success', 'Location created successfully 😊')
                        : ""
                }
                {
                    adminReducer.post_locationData_error === true
                        ? <div className="alert alert-danger fade show mt-3" role="alert">
                            <strong> ⚠️ Opps,</strong> Duplication occur! OR Something went wrong!!
                        </div>
                        : ""
                }
                <div className="mb-3 mt-4">
                    <p>Country <span className='text-danger'>*</span></p>
                    <input
                        type="text"
                        className="form-control input_field"
                        placeholder="Ex:- INDIA"
                        {...register("country", {
                            required: true,
                            pattern: /^[A-Z0-9-_\s]+$/,
                        })}
                    />
                    <small className="text-danger">{errors.country?.type === 'required' && "Country is required!"}</small>
                    <small className="text-danger">{errors.country?.type === 'pattern' && "Sorry! only letters(A-Z) are allowed."}</small>
                </div>
                <div className="mb-3 mt-4">
                    <p>State <span className='text-danger'>*</span></p>
                    <input
                        type="text"
                        className="form-control input_field"
                        placeholder="Ex:- GUJARAT"
                        {...register("state", {
                            required: true,
                            pattern: /^[A-Z0-9-_\s]+$/,
                        })}
                    />
                    <small className="text-danger">{errors.state?.type === 'required' && "State is required!"}</small>
                    <small className="text-danger">{errors.state?.type === 'pattern' && "Sorry! only letters(A-Z) are allowed."}</small>
                </div>
                <div className="mb-3 mt-4">
                    <p>City <span className='text-danger'>*</span></p>
                    <input
                        type="text"
                        className="form-control input_field"
                        placeholder="Ex:- SURAT"
                        {...register("city", {
                            required: true,
                            pattern: /^[A-Z0-9-_\s]+$/,
                        })}
                    />
                    <small className="text-danger">{errors.city?.type === 'required' && "City is required!"}</small>
                    <small className="text-danger">{errors.city?.type === 'pattern' && "Sorry! only letters(A-Z) are allowed."}</small>
                </div>

                {
                    adminReducer.post_locationData_progress === true
                        ? <button disabled className="btn btn_signin mb-3 mt-4 col-12">{btnspinner()}</button>
                        : <button type="submit" className="btn btn_signin mb-3 mt-4 col-12">Create</button>
                }

            </form>
        </>
    )
}

export default AddLocality