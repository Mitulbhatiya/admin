import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'
import { REQ_FOR_DELETE_LOCATION_DATA_ADMIN_PROGRESS, REQ_FOR_PATCH_LOCATION_DATA_ADMIN_PROGRESS } from '../../redux/action';
import { btnspinner, spinner } from '../../constant/alert';

const ManageLocality = () => {
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    // Data
    const [location, setlocation] = useState()
    // Status
    const [updateStatus, setupdateStatus] = useState(false)

    const locationData = (value) => {
        setupdateStatus(true)
        setlocation(value)
        setValue('city', value.city)
        setValue('state', value.state)
        setValue('country', value.country)
    }

    if (adminReducer.patch_locationData_success === true && updateStatus === true) {
        document.getElementById('admin_editLocationModalClose').click()
        setupdateStatus(false)
    }
    const onSubmit = (dataa) => {
        setupdateStatus(true)
        const data = {
            _id: location._id,
            city: dataa.city,
            state: dataa.state,
            country: dataa.country,
        }
        dispatch({ type: REQ_FOR_PATCH_LOCATION_DATA_ADMIN_PROGRESS, payload: { data } })
    }

    // DELETE
    const deleteLocality = (id) => {
        const data = {
            id: id,
        }
        dispatch({ type: REQ_FOR_DELETE_LOCATION_DATA_ADMIN_PROGRESS, payload: { data } })
    }

    return (
        <>
            <h5 className='mb-3'>Locations list </h5>
            <div>Total location: <span className="badge text-bg-primary" style={{ fontSize: '11px' }}>{adminReducer.location?.length}</span></div>
            <div className='homeDPList'>
                <div className='row mt-4'>

                    <div className='col-12' style={{ overflowX: 'auto' }}>
                        <table className="table">
                            <thead style={{ textAlign: 'left' }}>
                                <tr>
                                    <td>#</td>
                                    <th>Country</th>
                                    <th>State</th>
                                    <th>City</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    adminReducer.location?.length === 0
                                        ? <tr>
                                            <td colSpan={5} className='text-center'>🙁 No location data</td>
                                        </tr>
                                        : adminReducer.location?.map((value, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td >{index + 1}</td>
                                                    <td>{value?.country}</td>
                                                    <td>{value?.state}</td>
                                                    <td>{value?.city}</td>
                                                    <td>
                                                        <button className='adminHomeEditBtn mb-2 me-2' data-bs-toggle="modal" data-bs-target="#admin_LocationEdit" onClick={() => locationData(value)} >
                                                            <i className='bx bx-edit-alt'></i>
                                                        </button>
                                                        {/* {
                                                            adminReducer.delete_locationData_progress == true
                                                                ? <button className='adminHomeDeleteBtn'>
                                                                    ...
                                                                </button>
                                                                : <button className='adminHomeDeleteBtn' onClick={() => deleteLocality(value._id)}>
                                                                    <i className='bx bxs-trash-alt text-danger'></i>
                                                                </button>
                                                        } */}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* UPDATE */}
            <div className="modal fade" id="admin_LocationEdit" tabIndex="-1" aria-labelledby="admin_LocationEditLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="admin_LocationEditLabel">Update locality</h1>
                            <button type="button" id="admin_editLocationModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {
                                    adminReducer.patch_locationData_error === true
                                        ? <div className="alert alert-danger fade show mt-3" role="alert">
                                            <strong> ⚠️ Opps,</strong>Duplication ocuur! OR Something went wrong!!
                                        </div>
                                        : ""
                                }
                                <div className="mb-3 mt-3">
                                    <p>Country<span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field mt-2"
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
                                    <p>State<span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field mt-2"
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
                                    <p>City<span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field mt-2"
                                        placeholder="Ex:- SURAT"
                                        {...register("city", {
                                            required: true,
                                            pattern: /^[A-Z0-9-_\s]+$/,
                                        })}
                                    />
                                    <small className="text-danger">{errors.city?.type === 'required' && "city is required!"}</small>
                                    <small className="text-danger">{errors.city?.type === 'pattern' && "Sorry! only letters(A-Z) are allowed."}</small>
                                </div>

                                {
                                    adminReducer.patch_locationData_progress === true
                                        ? <button disabled className="btn btn_signin mb-3 mt-3 col-12">{btnspinner()}</button>
                                        : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12">Update</button>
                                }

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageLocality