import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useState } from 'react'
import { base_url } from '../../../../constant/const'
import { useParams } from 'react-router-dom'
import { spinner } from '../../../../constant/alert'

const DeleteAttendance = () => {
    const { id } = useParams();
    const [status, setStatus] = useState(false)
    const [err, seterr] = useState("")
    const deleteBtnCall = async () => {
        setStatus(true)
        const header = {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'multipart/form-data',
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "Authorization": "Bearer " + Cookies.get('tkn'),
            "isauth": Cookies.get('isAuth') || "",
            "isr": Cookies.get('isr') || ""
        }
        axios.post(base_url + "/admin/delete/attendance/zone", { zone: id }, header)
            .then((res) => {
                if (res.status === 200) {
                    setStatus(false)
                    seterr("")
                    window.location.reload()
                }
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    Cookies.remove('isr')
                    Cookies.remove('isAuth')
                    Cookies.remove('tkn')
                    window.location.href = "/"
                } else {
                    setStatus(false)
                    seterr("Something went wrong! Please try again latter.")
                }

            })
    }
    return (
        <>
            <div className="alert alert-danger col-12 col-md-6" role="alert" style={{ borderLeftColor: 'red', borderLeftWidth: '5px' }}>
                <h5>⚠️ Caution</h5>
                <br />
                <p>Delete attendance </p>
                <ul>
                    <li>Delete all zone user attendance!</li>
                    <li>Set all zone user attendance to 0%</li>
                    <li>Once you delete this attendance, you will not recover attendance!</li>
                </ul>
                <button className='btn btn-outline-danger mt-5' data-bs-toggle="modal" data-bs-target="#deleteAttendance">Delete</button>
            </div>



            <div className="modal fade" id="deleteAttendance" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="deleteAttendanceLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteAttendanceLabel">Delete attendance</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="alert alert-danger" role="alert">
                                Are you sure you want to delete data?
                            </div>
                            {
                                err !== ""
                                    ? <>
                                        <br />
                                        <div className="alert alert-danger" role="alert">
                                            <b>Error :</b> {err}
                                        </div>
                                    </>
                                    : ""
                            }
                        </div>
                        <div className="modal-footer">
                            {
                                status === true
                                    ? <button type="button" className="btn btn-danger">{spinner()}</button>
                                    : <button type="button" className="btn btn-danger" onClick={() => deleteBtnCall()}>Delete</button>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteAttendance