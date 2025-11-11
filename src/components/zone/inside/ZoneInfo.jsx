import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { alert, btnspinner, spinner } from '../../../constant/alert'
import { useForm } from 'react-hook-form'
import { REQ_FOR_PATCH_ZONE_PROGRESS } from '../../../redux/action'

const ZoneInfo = (props) => {
    const dispatch = useDispatch()
    const { zdata } = props
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

    if (adminReducer.patch_zone_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
    }

    const onSubmit = (dataa) => {
        setStatus(true)
        const data = {
            _id: zdata._id,
            name: dataa.name,
            pincode: dataa.pincode,
            type: "name"
        }
        dispatch({ type: REQ_FOR_PATCH_ZONE_PROGRESS, payload: { data } })

    }

    useEffect(() => {
        setValue('name', zdata?.name)
        setValue('pincode', zdata?.pincode)
    }, [zdata])
    return (
        <>
            <div className='container navbar_fixed_container admin_home'>
                <div className='row mt-5'>
                    <div className=' col-12 mt-4'>
                        {
                            isAlertVisible
                                ? alert('success', 'Zone updated successfully 😊')
                                : ""
                        }
                        {
                            adminReducer.patch_zone_error === true
                                ? <div className="alert alert-danger fade show mt-3" role="alert">
                                    <strong> ⚠️ Opps,</strong>Invalid authentication!!

                                </div>
                                : ""
                        }

                        <div className="mb-3 mt-3">
                            <p>ZID <small>(Not updatable)</small></p>
                            <input
                                type="text"
                                className="form-control input_field"
                                defaultValue={zdata.ID}
                                disabled
                            />
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3 mt-5">
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
                                <small className="text-danger">{errors.pincode?.type === 'required' && "Pincode is required!"}</small>
                                <small className="text-danger">{errors.pincode?.type === 'pattern' && "Sorry! numbers(0-9) are allowed."}</small>
                            </div>
                            <div>

                                {
                                    adminReducer.patch_zone_progress === true
                                        ? <button disabled className="btn btn_signin mb-3 mt-3 col-12 col-sm-12 col-md-3 col-lg-2">{btnspinner()}</button>
                                        : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12 col-sm-12 col-md-3 col-lg-2">Update</button>
                                }
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ZoneInfo