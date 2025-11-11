import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { REQ_FOR_POST_SUBZONE_PROGRESS } from '../../../../redux/action';
import { alert, btnspinner } from '../../../../constant/alert';
import { useParams } from 'react-router-dom';

const AddSubZone = () => {
    const { id } = useParams();
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

    if (adminReducer.post_subzone_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
        setValue('ID', '')
    }

    const onSubmit = (dataa) => {
        setStatus(true)
        const data = {
            ID: dataa.ID,
            zoneID: id,
        }
        dispatch({ type: REQ_FOR_POST_SUBZONE_PROGRESS, payload: { data } })

    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {
                isAlertVisible
                    ? alert('success', 'SubZone created successfully 😊')
                    : ""
            }
            {
                adminReducer.post_subzone_error === true
                    ? <div className="alert alert-danger fade show mt-3" role="alert">
                        <strong> ⚠️ Opps,</strong>Duplication occur else Something went wrong!!
                    </div>
                    : ""
            }
            <div className="mb-3 mt-3">
                <p>Name<span className='text-danger'>*</span></p>
                <input
                    type="text"
                    className="form-control input_field"
                    placeholder="*******"
                    {...register("ID", {
                        required: true,
                    })}
                />
                <small className="text-danger">{errors.ID?.type === 'required' && "SubZone name is required!"}</small>
                <small className="text-danger">{errors.ID?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
            </div>

            {
                adminReducer.post_subzone_progress === true
                    ? <button disabled className="btn btn_signin mb-3 mt-3 col-12">{btnspinner()}</button>
                    : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12">Add</button>
            }

        </form>
    )
}

export default AddSubZone