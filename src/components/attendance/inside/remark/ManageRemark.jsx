import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { btnspinner, spinner } from '../../../../constant/alert';
import { REQ_FOR_DELETE_REMARK_ADMIN_PROGRESS, REQ_FOR_PATCH_REMARK_ADMIN_PROGRESS } from '../../../../redux/action';
import { Link } from 'react-router-dom';

const ManageRemark = () => {
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    // ------------------------------------ Update ------------------------
    // Data
    const [remark, setRemark] = useState()
    // Status
    const [updateStatus, setupdateStatus] = useState(false)

    const remarkData = (value) => {
        setupdateStatus(true)
        setRemark(value)
        setValue('SATID', value.SATID)
        setValue('note', value.note)
        //  setValue('country', value.country)
    }

    if (adminReducer.patch_remark_success === true && updateStatus === true) {
        document.getElementById('admin_RemarkEditClose').click()
        setupdateStatus(false)
    }
    const onSubmit = (dataa) => {
        setupdateStatus(true)
        const data = {
            _id: remark._id,
            SATID: dataa.SATID,
            note: dataa.note,
        }
        dispatch({ type: REQ_FOR_PATCH_REMARK_ADMIN_PROGRESS, payload: { data } })
    }


    // ------------------------------------------------------------

    // ------------------------------------ Delete ------------------------
    // Data
    const [remarkId, setRemarkId] = useState()
    // Status
    const [updateStatus1, setupdateStatus1] = useState(false)

    const remarkDeleteData = (value) => {
        setupdateStatus1(true)
        setRemarkId(value)
    }

    if (adminReducer.delete_remark_success === true && updateStatus1 === true) {
        document.getElementById('admin_RemarkDeleteClose').click()
        setupdateStatus1(false)
    }
    const onSubmitDelete = (dataa) => {
        setupdateStatus1(true)
        const data = {
            _id: remarkId._id,
        }
        dispatch({ type: REQ_FOR_DELETE_REMARK_ADMIN_PROGRESS, payload: { data } })
    }

    adminReducer.remark?.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))

    return (
        <>
            <div className='card p-4 mt-5' style={{ borderRadius: '15px' }}>
                <h5 className='mb-3'>Remark list </h5>
                <div>Total Renark: <span className="badge text-bg-primary" style={{ fontSize: '11px' }}>{adminReducer.remark?.length}</span></div>
                <div className='homeDPList'>
                    <div className='row mt-4'>

                        <div className='col-12' style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead style={{ textAlign: 'left' }}>
                                    <tr>
                                        <td>#</td>
                                        <th>UID</th>
                                        <th>CreatedBy</th>
                                        <th>Note</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        adminReducer.remark?.length === 0
                                            ? <tr>
                                                <td colSpan={5} className='text-center'>🙁 No Remark data</td>
                                            </tr>
                                            : adminReducer.remark?.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td >{index + 1}</td>
                                                        <td>
                                                            <Link to={`/user/${value?.SATID}`}>
                                                                <button className='adminHomeEditBtn mb-2 me-2'>
                                                                    {value?.SATID}
                                                                </button>
                                                            </Link></td>
                                                        <td>{value?.createdBy}</td>
                                                        <td>{value?.note}</td>
                                                        <td>
                                                            <button className='adminHomeEditBtn mb-2 me-2' data-bs-toggle="modal" data-bs-target="#admin_RemarkEdit" onClick={() => remarkData(value)}>
                                                                <i className='bx bx-edit-alt'></i>
                                                            </button>
                                                            <button className='adminHomeDeleteBtn' data-bs-toggle="modal" data-bs-target="#admin_RemarkDelete" onClick={() => remarkDeleteData(value)}>
                                                                <i className='bx bxs-trash-alt text-danger'></i>
                                                            </button>
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
            </div>


            {/* UPDATE */}
            <div className="modal fade" id="admin_RemarkEdit" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="admin_RemarkEditLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="admin_RemarkEditLabel">Update remark</h1>
                            <button type="button" id="admin_RemarkEditClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {
                                    adminReducer.patch_remark_error === true
                                        ? <div className="alert alert-danger fade show mt-1" role="alert">
                                            <strong> ⚠️ Opps,</strong>Something went wrong!!
                                        </div>
                                        : ""
                                }
                                <div className="mb-3 mt-2 col-12">
                                    <p>Member<span className='text-danger'>*</span></p>
                                    <select
                                        className="form-control input_field"
                                        defaultValue={remark?.SATID}
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
                                        defaultValue={remark?.note}
                                        {...register("note", {
                                            required: true,
                                        })}
                                    />
                                    <small className="text-danger">{errors.note?.type === 'required' && "Note is required!"}</small>
                                    <small className="text-danger">{errors.note?.type === 'pattern' && "Sorry! only letters(A-Z) are allowed."}</small>
                                </div>

                                {
                                    adminReducer.patch_remark_progress === true
                                        ? <button disabled className="btn btn_signin mb-3 mt-3 col-12">{btnspinner()}</button>
                                        : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12">Update</button>
                                }

                            </form>
                        </div>
                    </div>
                </div>
            </div>


            {/* UPDATE */}
            <div className="modal fade" id="admin_RemarkDelete" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="admin_RemarkDeleteLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="admin_RemarkDeleteLabel">Delete remark</h1>
                            <button type="button" id="admin_RemarkDeleteClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                adminReducer.delete_remark_error === true
                                    ? <div className="alert alert-danger fade show mt-1" role="alert">
                                        <strong> ⚠️ Opps,</strong>Something went wrong!!
                                    </div>
                                    : ""
                            }

                            <p>Remark details</p>
                            <hr />
                            <p>UID : {remarkId?.SATID}</p>
                            <p>CreatedBy : {remarkId?.createdBy}</p>
                            <p>Note : {remarkId?.note}</p>
                            {
                                adminReducer.delete_remark_progress === true
                                    ? <button disabled className="btn btn-outline-danger mb-3 mt-3 col-12">{spinner()}</button>
                                    : <button type="submit" className="btn btn-outline-danger mb-3 mt-3 col-12" onClick={() => onSubmitDelete()}>Delete</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageRemark