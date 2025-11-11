import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { alert, btnspinner, spinner } from '../../../constant/alert'
import { useForm } from 'react-hook-form'
import { REQ_FOR_PATCH_ZONE_PROGRESS } from '../../../redux/action'


const ZoneLocation = (props) => {

    const dispatch = useDispatch()
    const { zdata } = props

    const adminReducer = useSelector(state => state.adminReducer)

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const [currentLocation, setCurrentLocation] = useState({})
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
        window.location.reload()
    }

    const onSubmit = (dataa) => {
        setStatus(true)
        const data = {
            _id: zdata._id,
            location: dataa.location,
            type: "location"
        }
        dispatch({ type: REQ_FOR_PATCH_ZONE_PROGRESS, payload: { data } })

    }
    // console.log(zdata);
    useEffect(() => {
        setCurrentLocation(zdata?.location)
        setValue('name', zdata?.name)

    }, [zdata])
    return (
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
                    {
                        currentLocation
                            ?
                            <div className="mb-3 mt-3">
                                <p>Current location</p>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    defaultValue={`${currentLocation?.country}-${currentLocation?.state}-${currentLocation?.city}`}
                                    disabled
                                />
                            </div>
                            : spinner()
                    }
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3 mt-4">
                            <p>New Location<span className='text-danger'>*</span></p>
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
    )
}

export default ZoneLocation