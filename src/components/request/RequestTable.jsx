import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { alert, btnspinner, spinner } from '../../constant/alert'
import { Link } from 'react-router-dom'
import { REQ_FOR_PATCH_REQUEST_PROGRESS } from '../../redux/action'


const RequestTable = (props) => {
    const { data } = props

    const adminReducer = useSelector(state => state.adminReducer)
    const dispatch = useDispatch()

    // Success/err message
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [status, setStatus] = useState(false)
    const handleButtonClick = () => {
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
            document.getElementById('closeModelRejectedReq').click()
        }, 2000);
    }



    const [deleteDatObject, setDeleteDataObject] = useState({})
    const deleteData = () => {
        setStatus(true)
        const data = {
            RID: deleteDatObject.RID,
            type: 'rejected'
        }
        dispatch({ type: REQ_FOR_PATCH_REQUEST_PROGRESS, payload: { data } })
    }

    const acceptData = () => {
        setStatus(true)
        const data = {
            RID: deleteDatObject.RID,
            type: deleteDatObject.requestType
        }
        dispatch({ type: REQ_FOR_PATCH_REQUEST_PROGRESS, payload: { data } })
    }

    if (adminReducer.patch_request_success === true && status === true) {
        handleButtonClick()
        setStatus(false)
    }
    let count = 0



    adminReducer.requests?.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
    return (
        <>
            <div className='col-12 ' style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px' }}>
                <table className="table">
                    <thead style={{ textAlign: 'left' }}>
                        <tr>
                            <td>#</td>
                            <th>Req. ID</th>
                            <th>Req. type</th>
                            <th>Status</th>
                            <th>UID</th>
                            <th>Profile</th>
                            <th>Lastname</th>
                            <th>Firstname</th>
                            <th>Middlename</th>
                            <th>Zone</th>
                            <th>Subzone</th>
                            <th>Vistar</th>
                            <th>Mobile</th>
                            <th>District</th>
                            <th>Taluka</th>
                            <th>Village</th>
                            <th>Gender</th>
                            <th>Birthdate</th>
                            <th>Address</th>
                            <th>Note</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            adminReducer.requests?.length === 0
                                ? <tr>
                                    <td colSpan={21} className='text-center'>🙁 No Request data</td>
                                </tr>
                                : adminReducer.requests?.map((value, index) => {
                                    if (data.reqType == value?.requestStatus) {
                                        count = count + 1
                                        return (
                                            <tr key={index}>
                                                <td >{count}</td>
                                                <td >{value?.RID}</td>
                                                <td >{value?.requestType}</td>
                                                <td >{value?.requestStatus}</td>
                                                <td >{value?.UID
                                                    ? <Link to={`/user/${value?.UID}`}>
                                                        <button className='adminHomeEditBtn mb-2 me-2'>
                                                            {value?.UID}
                                                        </button>
                                                    </Link>
                                                    : "-"}</td>
                                                {/* style={{ borderRadius: '50%' }}  */}
                                                <td>
                                                    {
                                                        value?.requestStatus === "Rejected"
                                                            ? "NULL"
                                                            : value?.profileurl
                                                                ? <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${value.profileurl}`} height={'70px'} width={'70px'} />
                                                                : "--"
                                                    }
                                                </td>
                                                <td>{value?.lastname}</td>
                                                <td>{value?.firstname}</td>
                                                <td>{value?.middlename}</td>
                                                <td >{value?.zone.split('Z')[1]}</td>
                                                <td >{value?.subzone}</td>
                                                <td >{value?.vistar}</td>
                                                <td >{value?.mobile}</td>
                                                <td >{value?.district}</td>
                                                <td >{value?.taluka}</td>
                                                <td >{value?.village}</td>
                                                <td >{value?.gender}</td>
                                                <td>{value?.birthdate?.split('T')[0]?.split('-')[2]}-{value?.birthdate?.split('T')[0]?.split('-')[1]}-{value?.birthdate?.split('T')[0]?.split('-')[0]}</td>
                                                <td>{value?.address || "-"}</td>
                                                <td>{value?.note || "-"}</td>
                                                <td>
                                                    {
                                                        value.requestStatus === 'Pending'
                                                            ? <>
                                                                <button className='adminHomeEditBtn mb-2 me-2' data-bs-toggle="modal" data-bs-target="#acceptReq" onClick={() => setDeleteDataObject(value)}>
                                                                    <i className='bx bx-check'></i>
                                                                </button>
                                                                <button className='adminHomeDeleteBtn' data-bs-toggle="modal" data-bs-target="#deleteRequest" onClick={() => setDeleteDataObject(value)}>
                                                                    <i className='bx bxs-trash-alt text-danger'></i>
                                                                </button>
                                                            </>
                                                            : ""
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    }

                                })
                        }
                    </tbody>
                </table>
            </div>


            <div className="modal fade" id="deleteRequest" tabIndex="-1" aria-labelledby="deleteRequestLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteRequestLabel">Reject request</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id='closeModelRejectedReq'></button>
                        </div>
                        <div className="modal-body">
                            {
                                isAlertVisible
                                    ? alert('success', 'Request updated successfully 😊')
                                    : ""
                            }
                            {
                                adminReducer.patch_request_error === true
                                    ? <div className="alert alert-danger fade show mt-3 mb-4" role="alert">
                                        <strong> ⚠️ Opps,</strong>Something went wrong!
                                    </div>
                                    : ""
                            }

                            <div className="alert alert-danger" role="alert">
                                REQUEST No. : {deleteDatObject?.RID || "----"}
                                <br />
                                <br />
                                Delete with caution, <span class="alert-link">User will be deleted permanently</span>. Delete data will not be recoverable.
                            </div>
                        </div>
                        <div className='p-3 d-flex justify-content-end'>

                            {
                                adminReducer.patch_request_progress === true
                                    ? <button className='btn btn-outline-danger' disabled>{spinner()}</button>
                                    : <button className='btn btn-outline-danger' onClick={() => deleteData()}>Reject</button>
                            }

                        </div>
                    </div>
                </div>
            </div>


            {/* Accept */}

            <div className="modal fade" id="acceptReq" tabIndex="-1" aria-labelledby="acceptReqLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="acceptReqLabel">Accept request</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id='closeModelRejectedReq'></button>
                        </div>
                        <div className="modal-body">
                            {
                                isAlertVisible
                                    ? alert('success', 'Request updated successfully 😊')
                                    : ""
                            }
                            {
                                adminReducer.patch_request_error === true
                                    ? <div className="alert alert-danger fade show mt-3 mb-4" role="alert">
                                        <strong> ⚠️ Opps,</strong>Something went wrong!
                                    </div>
                                    : ""
                            }

                            <div className="alert alert-primary" role="alert">
                                REQUEST No. : {deleteDatObject?.RID || "----"}
                                <br />
                                <br />
                                <span class="alert-link">User will be stored permanently</span>.
                            </div>
                        </div>
                        <div className='p-3 d-flex justify-content-end'>

                            {
                                adminReducer.patch_request_progress === true
                                    ? <button className='btn btn-outline-primary' disabled>{spinner()}</button>
                                    : <button className='btn btn-outline-primary' onClick={() => acceptData()}>Accept</button>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RequestTable