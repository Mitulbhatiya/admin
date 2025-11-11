import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { alert, btnspinner, spinner } from '../../constant/alert'
import { Link, useParams } from 'react-router-dom';
import { REQ_FOR_GET_EACH_USER_PROGRESS, REQ_FOR_PATCH_ACTIVE_STATUS_PROGRESS, REQ_FOR_PATCH_REQUEST_PROGRESS } from '../../redux/action';
import DetailsUpdate from './DetailsUpdate';
import userImg from '../assets/user.png'

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


// import logo
import satdhamLogo from '../assets/satdham_logo.jpeg'
import { base_url, resetPasswordUrl } from '../../constant/const';
import Cookies from 'js-cookie';
import axios from 'axios';

const UserDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    const [edituserDetails, setEdituserDetails] = useState(false)


    const getTimeFunction = (dd) => {
        const utcTimestamp = dd; // Note the 'Z' at the end, indicating UTC
        const utcDate = new Date(utcTimestamp);
        const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // 5.5 hours in milliseconds
        // Date
        var istDateString = istDate.toISOString();
        istDateString = istDateString.split("T")[0].split("-")[2] + "-" + istDateString.split("T")[0].split("-")[1] + "-" + istDateString.split("T")[0].split("-")[0]
        // This gives you the IST timestamp
        const date = new Date(utcTimestamp);
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());
        // Time
        const istTime = date.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        return {
            istTime,
            istDateString
        }
    }

    let attendanceTableCount = 0

    // =-============================== REQUEST UPDATE ==============================

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

    let reqCount = 0

    // =-============================== REQUEST UPDATE END ==============================

    // ========================== Search ===============================

    // Live search by Date
    const [query, setQuery] = useState('');
    // Function to handle changes in the search query
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Filter the array based on the search query
    const filteredData = adminReducer.attendanceDetails.filter(item =>
        ((item.date.toLowerCase()).includes(query.toLowerCase()) && item.SATID === adminReducer?.user?.userData?._id)
    );


    // ============================= Search End =================

    // ================================= REPORT =============================

    const generatePDF = async () => {
        // setpdfExportStatus(true)
        let doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: [595, 842]
        })

        const imageHeight = 150
        doc.setFontSize(11);
        doc.addImage(satdhamLogo, "PNG", 172.5, 100, 250, 233, imageHeight)
        doc.setFontSize(20);
        doc.text(`Sat-Sabha member report of UID : ${adminReducer?.user?.userData?.ID.split('P')[1]}`, 120, 400)
        doc.setFontSize(14)
        doc.addPage();
        doc.text(`ID : ${adminReducer?.user?.userData?.ID.split('P')[1]}`, 50, 50)
        doc.text(`Zone : ${adminReducer?.user?.userData?.zone.split('Z')[1]}`, 50, 70)
        doc.text(`Subzone : ${adminReducer?.user?.userData?.subzone}`, 50, 90)
        doc.text(`Name : ${adminReducer?.user?.userData?.lastname} ${adminReducer?.user?.userData?.firstname} ${adminReducer?.user?.userData?.middlename}`, 50, 110)
        doc.text(`Mobile : ${adminReducer?.user?.userData?.mobile}`, 50, 130)
        doc.text(`Role : ${adminReducer?.user?.userData?.role === "zonesubadmin" ? "Sub-admin" : adminReducer?.user?.userData?.role}`, 50, 150)
        doc.text(`Attendance : ${adminReducer?.user?.userData?.attendance}%`, 50, 170)
        let i = 0
        autoTable(doc, {
            margin: { top: 190, right: 50, bottom: 10, left: 50 },
            head: [['#', 'Zone', 'Date', 'Availability']],
            body: adminReducer.attendanceDetails.flatMap(row => {
                if (row.SATID === adminReducer?.user?.userData?._id) {
                    i = i + 1
                    return [
                        [
                            i,
                            row.zone.split('Z')[1],
                            `${getTimeFunction(row?.date).istDateString} - ${getTimeFunction(row?.date).istTime}`,
                            `${row.isPresent === false ? 'A' : 'P'}`,
                        ]
                    ];
                }
                return [];
            }),
        });

        await doc.save(`${adminReducer?.user?.userData?.ID}.pdf`)

    }

    // ======================================================================

    // =================== Update user active status ====================

    // Success/err message
    const [isAlertVisible1, setIsAlertVisible1] = useState(false);
    const [status1, setStatus1] = useState(false)
    const handleButtonClick1 = () => {
        setIsAlertVisible1(true);
        setTimeout(() => {
            setIsAlertVisible1(false);
            document.getElementById('userActiveStatusModalClose').click()
        }, 1500);
    }

    const updateActiveStatus = async () => {
        setStatus1(true)
        const data = {
            _id: adminReducer?.user?.userData?._id,
            isActive: adminReducer?.user?.userData?.isActive === true ? false : true
        }
        dispatch({ type: REQ_FOR_PATCH_ACTIVE_STATUS_PROGRESS, payload: { data } })
    }

    if (adminReducer.patch_active_status_success === true && status1 === true) {
        handleButtonClick1()
        setStatus1(false)
    }

    // ==================================================================

    // ===================== Reset Password ========================

    // loader
    const [loader, setLoader] = useState(false)
    // err
    const [err, setErr] = useState('')
    const header = {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Authorization": "Bearer " + Cookies.get('tkn'),
        "isauth": Cookies.get('isAuth') || "",
        "isr": Cookies.get('isr') || ""
    }

    const resetPassword = async () => {
        setLoader(true)
        const data = {
            ID: id
        }
        axios.post(base_url + resetPasswordUrl, data, header)
            .then((res) => {
                // console.log(res);
                if (res.status === 200) {
                    // setStatus(true)
                    setLoader(false)
                    window.location.reload()
                }
            })
            .catch((err) => {
                // console.log(err);
                if (err?.response?.status === 301) {
                    setLoader(false)
                    setErr(err.response.data.message || "Opps! Somthing went wrong.")
                } else {
                    setLoader(false)
                    setErr("Opps! Somthing went wrong.")

                }
            })
    }

    // ==================================================================



    useEffect(() => {
        (async () => {
            const data = {
                id: id
            }
            dispatch({ type: REQ_FOR_GET_EACH_USER_PROGRESS, payload: { data } })
        })();

        return () => { };
    }, [id]);

    return (
        <div className='container-fluid px-lg-5 px-2 navbar_fixed_container admin_home'>
            {
                adminReducer.get_locationData_success === true
                    && adminReducer.get_userData_success === true
                    && adminReducer.get_zone_success === true
                    && adminReducer.get_user_success === true
                    && adminReducer.get_each_user_success === true
                    && adminReducer.get_details_attendance_success === true
                    ? <>
                        <div className='row mt-5'>
                            <div className="d-flex justify-content-between">
                                <Link to={'/users'} style={{ textDecoration: 'none', color: 'black' }}>
                                    <h4 className="adminhome_statistics_font mt-2">{"< Users details"}</h4>
                                </Link>
                                <div className='d-flex'>
                                    {
                                        loader === false
                                            ? <button className='adminHomeEditBtn mb-2 me-2' onClick={() => resetPassword()}>
                                                Reset password
                                            </button>
                                            : <button className='adminHomeEditBtn mb-2 me-2' disabled>
                                                Reset password...
                                            </button>
                                    }

                                    <button className='adminHomeEditBtn mb-2 me-2' onClick={() => generatePDF()}>
                                        PDF <i className='bx bxs-file-pdf'></i>
                                    </button>
                                    {
                                        edituserDetails === false
                                            ? <div>
                                                <i className='bx bx-toggle-left bx-lg' style={{ color: "#cccccc", cursor: 'pointer' }} onClick={() => setEdituserDetails(true)}></i>
                                            </div>
                                            : <div>
                                                <i className='bx bx-toggle-right bx-lg' style={{ color: "#47BE68", cursor: 'pointer' }} onClick={() => setEdituserDetails(false)}></i>
                                            </div>
                                    }

                                </div>

                            </div>
                        </div>

                        {
                            edituserDetails === false
                                ? <>
                                    <div className='row mt-3 profile'>

                                        {
                                            err !== ''
                                                ? alert('danger', `${err}`)
                                                : null
                                        }

                                        <div className='col-12 col-sm-12 col-md-3 col-lg-3 col-xl-2'>
                                            <div>
                                                {
                                                    adminReducer?.user?.userData.profilePhotoStatus === false
                                                        ? <img
                                                            className='img-fluid'
                                                            src={userImg}
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                borderRadius: '50%'
                                                            }}
                                                        />
                                                        : <img
                                                            className='img-fluid'
                                                            src={`https://dzhov20ss4n5i.cloudfront.net/${adminReducer?.user?.userData?.profileurl}`}
                                                            style={{
                                                                width: '200px',
                                                                height: '200px',
                                                                borderRadius: '50%'
                                                            }}
                                                        />
                                                }
                                                <div className='my-3'>
                                                    <small>User active status </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.isActive === true ? 'Active' : "De-active"}
                                                        <button className='adminHomeEditBtn my-2 mx-2' data-bs-toggle="modal" data-bs-target="#userActiveStatusModal">
                                                            Change
                                                        </button>
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-12 col-sm-12 col-md-9 col-lg-9 col-xl-10'>
                                            <div className='row'>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>UID 🙎</small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.ID}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Zone </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.zone.split('Z')[1] || "--"}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>SubZone </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.subzone || "--"}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Vistar </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.vistar || "--"}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Lastname </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.lastname}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Firstname </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.firstname}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mt-3'>
                                                    <small>Middlename </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.middlename}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mt-3'>
                                                    <small>Gender </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.gender}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mt-3'>
                                                    <small>Birthdate </small>
                                                    <h4 className="user_profile_details_text">
                                                        {getTimeFunction(adminReducer?.user?.userData?.birthdate).istDateString}
                                                    </h4>
                                                </div>
                                            </div>
                                            <hr className='my-3' />
                                            <div className='row'>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>District </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.district === "NULL" ? "-" : adminReducer?.user?.userData?.district || "--"}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Taluka </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.taluka === "NULL" ? "-" : adminReducer?.user?.userData?.taluka || "--"}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Village </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.village === "NULL" ? "-" : adminReducer?.user?.userData?.village || "--"}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Mobile </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.mobile}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Role </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.role === "zonesubadmin" ? "Sub-admin" : adminReducer?.user?.userData?.role}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Attendance access </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.attendancePermission === false ? "False" : "True"}
                                                    </h4>
                                                </div>
                                            </div>
                                            <hr className='my-3' />
                                            <div className='row'>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Joining date </small>
                                                    <h4 className="user_profile_details_text">
                                                        {getTimeFunction(adminReducer?.user?.userData?.createdAt).istDateString} <br />  {getTimeFunction(adminReducer?.user?.userData?.createdAt).istTime}
                                                    </h4>
                                                </div>
                                                <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                                    <small>Attendance 🙋‍♂️ </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.attendance}%
                                                    </h4>
                                                </div>
                                                <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-8'>
                                                    <small>Address </small>
                                                    <h4 className="user_profile_details_text">
                                                        {adminReducer?.user?.userData?.address === "NULL" ? "-" : adminReducer?.user?.userData?.address || "--"}
                                                    </h4>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </>
                                : <DetailsUpdate />
                        }






                        <div className='row mt-5 mb-4'>
                            <div className="d-flex justify-content-between">
                                <h4 className="adminhome_statistics_font">{"Requests"}</h4>

                                {/* <div>
                                    <i class='bx bxs-plus-circle bx-sm' style={{ color: "#47BE68", cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#AddUsers"></i>
                                </div> */}
                            </div>
                        </div>
                        <div className='col-12 ' style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '400px' }}>
                            <table className="table">
                                <thead style={{ textAlign: 'left' }}>
                                    <tr>
                                        <td>#</td>
                                        <th>RID</th>
                                        <th>Req. type</th>
                                        <th>Status</th>
                                        <th>UID</th>
                                        <th>Profile</th>
                                        <th>Lastname</th>
                                        <th>Firstname</th>
                                        <th>Middlename</th>
                                        <th>Zone</th>
                                        <th>Subone</th>
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
                                        adminReducer.requests?.map((value, index) => {
                                            if (value.UID === adminReducer?.user?.userData.ID) {
                                                reqCount = reqCount + 1
                                                return (
                                                    <tr key={index}>
                                                        <td >{reqCount}</td>
                                                        <td >{value?.RID}</td>
                                                        <td >{value?.requestType}</td>
                                                        <td >{value?.requestStatus}</td>
                                                        <td >{value?.UID || "-"}</td>
                                                        {/* style={{ borderRadius: '50%' }}  */}
                                                        <td>
                                                            {
                                                                value?.requestStatus === "Rejected"
                                                                    ? "NULL"
                                                                    : value?.profileurl
                                                                        ? <img src={`https://dzhov20ss4n5i.cloudfront.net/${value.profileurl}`} height={'70px'} width={'70px'} />
                                                                        : "--"
                                                            }
                                                        </td>
                                                        <td>{value?.lastname}</td>
                                                        <td>{value?.firstname}</td>
                                                        <td>{value?.middlename}</td>
                                                        <td>{value?.zone.split('Z')[1] || "-"}</td>
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
                                    {
                                        reqCount === 0
                                            ? <tr>
                                                <td colSpan={21} className='text-center'>🙁 No Request data</td>
                                            </tr>
                                            : ""
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
                                            Delete with caution, <span className="alert-link">User will be deleted permanently</span>. Delete data will not be recoverable.
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
                                            <span className="alert-link">User will be stored permanently</span>.
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


                        <div className='row mt-5'>
                            <div className="d-flex justify-content-between">
                                <h4 className="adminhome_statistics_font">{"Attendance"}</h4>

                                {/* <div>
                                    <i class='bx bxs-plus-circle bx-sm' style={{ color: "#47BE68", cursor: 'pointer' }} data-bs-toggle="modal" data-bs-target="#AddUsers"></i>
                                </div> */}
                            </div>
                        </div>
                        <div className='row mt-3 mb-5 profile userDetailsTable'>

                            <div className='col-12' style={{ overflowX: 'auto', maxHeight: '500px' }}>

                                <div>
                                    <input
                                        type="date"
                                        className='my-4'
                                        value={query}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <table className="table">
                                    <thead style={{ textAlign: 'left', backgroundColor: 'transparent' }}>
                                        <tr>
                                            <td>#</td>
                                            <th>Zone</th>
                                            <th>User</th>
                                            <th>Date</th>
                                            <th>Availability</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            query ? (
                                                // If there is a search query, display filtered results
                                                filteredData.map((value, index) => {
                                                    attendanceTableCount = attendanceTableCount + 1
                                                    return (
                                                        <tr key={index}>
                                                            <td >{attendanceTableCount}</td>
                                                            <td>{value?.zone.split('Z')[1] || "-"}</td>
                                                            <td >{adminReducer?.user?.userData?.ID}</td>

                                                            <td> {getTimeFunction(value?.date).istDateString} - {getTimeFunction(value?.date).istTime}</td>
                                                            <td> <span className={`${value.isPresent === false ? 'status_absent' : 'status_completed'}`}>{value.isPresent === false ? "Absent" : "Present"}</span></td>
                                                            <td>
                                                                <Link to={`/attendance/${value?.attendance}`} onClick={() => localStorage.setItem('UID', id)}>
                                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                                        {/* <i className='bx bx-edit-alt'></i> */}
                                                                        Visit <i className='bx bx-right-arrow-alt'></i>
                                                                    </button>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : adminReducer.attendanceDetails?.map((value, index) => {
                                                if (value.SATID === adminReducer?.user?.userData?._id) {
                                                    attendanceTableCount = attendanceTableCount + 1
                                                    return (
                                                        <tr key={index}>
                                                            <td >{attendanceTableCount}</td>
                                                            <td>{value?.zone.split('Z')[1] || "-"}</td>
                                                            <td >{adminReducer?.user?.userData?.ID}</td>

                                                            <td> {getTimeFunction(value?.date).istDateString} - {getTimeFunction(value?.date).istTime}</td>
                                                            <td> <span className={`${value.isPresent === false ? 'status_absent' : 'status_completed'}`}>{value.isPresent === false ? "Absent" : "Present"}</span></td>
                                                            <td>
                                                                <Link to={`/attendance/${value?.attendance}`} onClick={() => localStorage.setItem('UID', id)}>
                                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                                        {/* <i className='bx bx-edit-alt'></i> */}
                                                                        Visit <i className='bx bx-right-arrow-alt'></i>
                                                                    </button>
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                        {
                                            attendanceTableCount === 0
                                                ? <tr>
                                                    <td colSpan={6} className='text-center'>🙁 No data for this user</td>
                                                </tr>
                                                : ""
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </>
                    : <div className='row mt-5'>
                        {spinner()}
                    </div>
            }


            {/* User active status update modal */}
            <div className="modal fade" id="userActiveStatusModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="userActiveStatusModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="userActiveStatusModalLabel">User active status</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="userActiveStatusModalClose"></button>
                        </div>
                        <div className="modal-body">
                            {
                                isAlertVisible1
                                    ? alert('success', 'User status updated successfully 😊')
                                    : ""
                            }
                            {
                                adminReducer.patch_active_status_error === true
                                    ? <div className="alert alert-danger fade show mt-3 mb-4" role="alert">
                                        <strong> ⚠️ Opps,</strong>Something went wrong!
                                    </div>
                                    : ""
                            }

                            {
                                adminReducer?.user?.userData?.isActive === true
                                    ? <>
                                        <div className="alert alert-danger mt-3" role="alert">
                                            <h4 className="alert-heading">De-Activate!</h4>
                                            <ul>
                                                <li>User's will be de-activate! You can re-active using same process. His/her data will be safe!</li>
                                                <li>User's attendacne will be set 0%, and you can't take attendacne for this user.</li>
                                                <li>User's attendacne data will be delete permanently!</li>
                                            </ul>
                                        </div>
                                    </>
                                    : <>
                                        <div className="alert alert-success mt-3" role="alert">
                                            <h4 className="alert-heading">Great!</h4>
                                            <ul>
                                                <li>Tap to activate button, user will be activate!</li>
                                            </ul>
                                        </div>
                                    </>
                            }
                        </div>
                        <div className="modal-footer">
                            {
                                adminReducer?.user?.userData?.isActive === true
                                    ? adminReducer.patch_active_status_progress === true
                                        ? <button type="button" className="btn btn-outline-danger">{spinner()}</button>
                                        : <button type="button" className="btn btn-outline-danger" onClick={() => updateActiveStatus()}>De-activate</button>
                                    : adminReducer.patch_active_status_progress === true
                                        ? <button type="button" className="btn btn-outline-success">{spinner()}</button>
                                        : <button type="button" className="btn btn-outline-success" onClick={() => updateActiveStatus()}>Activate</button>
                            }
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default UserDetails