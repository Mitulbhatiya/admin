import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { REQ_FOR_PATCH_SUBZONE_PROGRESS } from '../../../../redux/action';
import { btnspinner, spinner } from '../../../../constant/alert';
import Cookies from 'js-cookie';
import { base_url } from '../../../../constant/const';
import axios from 'axios';

const ManageSubZone = () => {

    const { id } = useParams();
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    // Data
    const [subzone, setsubzone] = useState()
    // Status
    const [updateStatus, setupdateStatus] = useState(false)

    const subzoneData = (value) => {
        setupdateStatus(true)
        setsubzone(value)
        setValue('ID', value.ID)
    }


    if (adminReducer.patch_subzone_success === true && updateStatus === true) {
        document.getElementById('admin_SubzoneEditModalClose').click()
        setupdateStatus(false)
    }
    const onSubmit = (dataa) => {
        setupdateStatus(true)
        const data = {
            _id: subzone._id,
            ID: dataa.ID,
            zoneID: subzone.zoneID,
            oldSubzone: subzone.ID
        }
        dispatch({ type: REQ_FOR_PATCH_SUBZONE_PROGRESS, payload: { data } })
    }




    // ---------------- DELETE SUBZONE -------------------

    const [deletevalue, setdeletevalue] = useState({})
    const [deletestatus, setdeletestatus] = useState(false)
    const [deletevalueErr, setdeletevalueErr] = useState("")
    const [deleteUservalue, setdeleteUservalue] = useState([])
    const DeleteSubZone = async (value1) => {
        setdeletevalue(value1)
        const users = []
        await adminReducer.users?.map((value, index) => {
            if (id === value?.zone && value?.subzone === value1.ID) {
                users.push(value)
            }
        })
        setdeleteUservalue(users)
    }

    const FinalDelete = async () => {
        setdeletestatus(true)
        setdeletevalueErr("")
        const header = {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'multipart/form-data',
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "Authorization": "Bearer " + Cookies.get('tkn'),
            "isauth": Cookies.get('isAuth') || "",
            "isr": Cookies.get('isr') || ""
        }

        axios.post(base_url + "/admin/subzone/delete", { data: deletevalue }, header)
            .then((res) => {
                setdeletevalueErr("")
                setdeletestatus(false)
                if (res.status === 200) {
                    window.location.reload()
                }
            })
            .catch((err) => {
                setdeletestatus(false)
                setdeletevalueErr("Something went wrong on delete!")
                if (err.response.status === 404) {
                    Cookies.remove('isr')
                    Cookies.remove('isAuth')
                    Cookies.remove('tkn')
                    window.location.href = "/"
                }
            })
    }

    let count = 0
    return (
        <>
            <div className='col-12' style={{ overflowX: 'auto' }}>
                <table className="table">
                    <thead style={{ textAlign: 'left' }}>
                        <tr>
                            <td>#</td>
                            <th>Name</th>
                            <th>Main Zone</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            adminReducer.subzone?.map((value, index) => {
                                if (value?.zoneID === id) {
                                    count = count + 1
                                    return (
                                        <tr key={index}>
                                            <td >{count}</td>
                                            <td>{value?.ID}</td>
                                            <td>{value?.zoneID}</td>
                                            <td>
                                                <button className='adminHomeEditBtn mb-2 me-2' data-bs-toggle="modal" data-bs-target="#admin_SubzoneEdit" onClick={() => subzoneData(value)}>
                                                    <i className='bx bx-edit-alt'></i>
                                                </button>
                                                <button className='adminHomeDeleteBtn mb-2 me-2' data-bs-toggle="modal" data-bs-target="#admin_SubzoneDelete" onClick={() => DeleteSubZone(value)}>
                                                    <i className='bx bx-trash-alt text-danger'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }
                            })
                        }
                    </tbody>
                </table>
            </div>


            {/* UPDATE */}
            <div className="modal fade" id="admin_SubzoneEdit" tabIndex="-1" aria-labelledby="admin_SubzoneEditLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="admin_SubzoneEditLabel">Update subzone</h1>
                            <button type="button" id="admin_SubzoneEditModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {
                                    adminReducer.patch_subzone_error === true
                                        ? <div className="alert alert-danger fade show mt-3" role="alert">
                                            <strong> ⚠️ Opps,</strong>Duplication ocuur! OR Something went wrong!!
                                        </div>
                                        : ""
                                }
                                <div className="mb-3 mt-3">
                                    <p>Name<span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field mt-2"
                                        placeholder="********"
                                        {...register("ID", {
                                            required: true,
                                        })}
                                    />
                                    <small className="text-danger">{errors.ID?.type === 'required' && "Subzone name is required!"}</small>
                                    <small className="text-danger">{errors.ID?.type === 'pattern' && "Sorry! only letters(A-Z) are allowed."}</small>
                                </div>

                                {
                                    deletestatus === true
                                        ? <button disabled className="btn btn_signin mb-3 mt-3 col-12">{btnspinner()}</button>
                                        : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12">Update</button>
                                }

                            </form>
                        </div>
                    </div>
                </div>
            </div>


            {/* UPDATE */}
            <div className="modal fade" id="admin_SubzoneDelete" tabIndex="-1" aria-labelledby="admin_SubzoneDeleteLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="admin_SubzoneDeleteLabel">Delete subzone</h1>
                            <button type="button" id="admin_SubzoneDeleteModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                deletevalueErr !== ""
                                    ? <div className="alert alert-danger fade show mt-3" role="alert">
                                        <strong> ⚠️ Opps,</strong>{deletevalueErr}
                                    </div>
                                    : ""
                            }
                            {
                                deleteUservalue.length > 0
                                    ? <div className="alert alert-danger fade show mt-3" role="alert">
                                        <strong> ⚠️ Opps,</strong> Users exists in current subzone, First transfer users then you will proccess it!
                                        <br />
                                        <br />
                                        {
                                            deleteUservalue.map((value, index) => {
                                                return (
                                                    <ul key={index}>
                                                        <li> {value.ID.split('P')[1]}</li>
                                                    </ul>
                                                )
                                            })
                                        }
                                    </div>
                                    : adminReducer.patch_subzone_progress === true
                                        ? <button disabled className="btn  btn-outline-danger mb-3 mt-3 col-12">{spinner()}</button>
                                        : <button type="submit" className="btn btn-outline-danger mb-3 mt-3 col-12" onClick={() => FinalDelete()}>Delete</button>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageSubZone