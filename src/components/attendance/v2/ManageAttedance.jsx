import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { alert, btnspinner, spinner } from '../../../constant/alert'
import { REQ_FOR_DELETE_ATTENDANCE_PROGRESS, REQ_FOR_PATCH_ATTENDANCE_PROGRESS } from '../../../redux/action'


import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// DataTable
import DataTable from 'react-data-table-component'

const ManageAttendace = () => {

    // Redux
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    // Convert to IST
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



    //------------------ Set update data -----------------------------
    const [updateData, setUpdateData] = useState({})
    const [deleteData, setDeleteData] = useState({})
    const [dateUpdateStatus, setdateUpdateStatus] = useState(false)
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();

    // Success/err message
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [status, setStatus] = useState('')
    const handleButtonClick = () => {
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
    }

    if (adminReducer.patch_attendance_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
        reset()
        document.getElementById('closeModelupdateAttendance').click()
    }


    const onSubmit = (dataa) => {
        const data = {
            _id: updateData._id,
            description: dataa.description,
            zone: dataa.zone,
            date: dateUpdateStatus === true ? dataa.date : updateData.date,
            createdBy: "Admin"
        }
        setStatus(true)
        // console.log(data);
        dispatch({ type: REQ_FOR_PATCH_ATTENDANCE_PROGRESS, payload: { data } })
    }
    const setUpdateDataFunc = async (d) => {
        setUpdateData(d)
        setValue('description', d.description)
        setValue('zone', d.zone)
    }


    // ------------------ Delete ------------------------------
    const setDeleteDataFunc = async (d) => {
        setDeleteData(d)
    }

    const [isAlertVisible1, setIsAlertVisible1] = useState(false);
    const [status1, setStatus1] = useState('')
    const handleButtonClick1 = () => {
        setIsAlertVisible1(true);
        setTimeout(() => {
            setIsAlertVisible1(false);
        }, 3000);
    }

    if (adminReducer.delete_attendance_success === true && status1 === true) {
        setStatus1(false)
        handleButtonClick1()
        document.getElementById('closeModeldeleteAttendance').click()
    }

    const onDelete = async () => {
        setStatus1(true)
        const data = {
            _id: deleteData._id,
        }
        setStatus(true)
        // console.log(data);
        dispatch({ type: REQ_FOR_DELETE_ATTENDANCE_PROGRESS, payload: { data } })
    }

    // Sorting by date || Latest date > Old date
    adminReducer.attendance?.sort((a, b) => (a.date > b.date ? -1 : 1))




    // ========================== DATA TABLE ===============================

    // ++++++++++ Date calculation fucntion ++++++++++
    const DateCalucationDataTable = (value) => {
        const d = value.date.split('T')
        const t = d[1].split('.')[0]

        const [hours, minutes, seconds] = t.split(':').map(Number);

        // Create a new Date object and set the time
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);

        // Convert to 12-hour format with AM/PM
        const formattedTime = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${d[0].split('-')[2]}-${d[0].split('-')[1]}-${d[0].split('-')[0]} - ${formattedTime}` || "N/A"
    }

    // ++++++++++ isPresent | Remaining | Percenttage Calculation function +++++++++
    const calculateAttendanceMetrics = (attendanceId, attendanceData) => {
        const attendanceDetails = attendanceData.find((d) => d.attendance === attendanceId);
        const total = attendanceDetails ? attendanceDetails.total : 0;
        const isPresent = attendanceDetails ? attendanceDetails.isPresent : 0;
        const remaining = total - isPresent;
        const percentage = total !== 0 ? ((isPresent / total) * 100).toFixed(2) : 0;

        return { total, isPresent, remaining, percentage };
    };

    // Datatable assign column
    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1, // Calculate index starting from 1
            width: '3rem', // Optional: Adjust width for the index column
        },
        {
            name: 'ZoneID',
            cell: (row, index) => row?.zone.split('Z')[1],
            width: '5rem'
        },
        {
            name: 'Zone name',
            selector: row => adminReducer.zone.find(zone => zone.ID === row.zone)?.name,
            width: '30rem',
        },
        {
            name: 'Date',
            selector: row => DateCalucationDataTable(row),
            width: '13rem',
        },
        {
            name: 'Description',
            selector: row => row?.description,
            width: '15rem'
        },
        {
            name: 'Present',
            selector: (row) => {
                const { isPresent } = calculateAttendanceMetrics(row?._id, adminReducer.attendanceDetailsData);
                return isPresent;
            },
            width: '7rem'
        },
        {
            name: 'Remaining',
            selector: (row) => {
                const { remaining } = calculateAttendanceMetrics(row?._id, adminReducer.attendanceDetailsData);
                return remaining;
            },
            width: '7rem'
        },
        {
            name: 'Ratio',
            selector: (row) => {
                const { percentage } = calculateAttendanceMetrics(row?._id, adminReducer.attendanceDetailsData);
                return <span className={` font_w ${percentage >= 75 ? "text-success" : percentage < 75 && percentage >= 50 ? "yellow_color" : "text-danger"}`}>{percentage}%</span>;
            },
            width: '7rem'
        },
        {
            name: 'Att. Taken',
            selector: row => <span className={`${row?.attendanceTaken === false ? 'status_pending' : 'status_completed'}`}>{row?.attendanceTaken === false ? "Pending" : "Completed"}</span>,
            width: '9rem'
        },
        {
            name: 'CreatedBy',
            selector: row => row?.createdBy,
            width: '9rem'
        },
        {
            name: ' ',
            selector: row => <>
                {
                    row.attendanceTaken === false
                        ? <>
                            <button className='adminHomeEditBtn mb-2 me-2' data-bs-toggle="modal" data-bs-target="#updateAttendance" onClick={() => setUpdateDataFunc(row)}>
                                <i className='bx bx-edit-alt'></i>
                                {/* <i className='bx bx-right-arrow-alt'></i> */}
                            </button>
                            <button className='adminHomeDeleteBtn mb-2 me-2' data-bs-toggle="modal" data-bs-target="#deleteAttendance" onClick={() => setDeleteDataFunc(row)}>
                                <i className='bx bxs-trash-alt text-danger'></i>
                                {/* <i className='bx bx-right-arrow-alt'></i> */}
                            </button>
                        </>
                        : ""
                }
                <Link to={`/attendance/${row?._id}`}>
                    <button className='adminHomeEditBtn mb-2 me-2'>
                        {/* <i className='bx bx-edit-alt'></i> */}
                        <i className='bx bx-right-arrow-alt'></i>
                    </button>
                </Link>
            </>,
            width: '13rem'
        },

    ];

    // DataTable Design
    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
                fontWeight: 600,
                fontSize: '15px',
                border: 'hidden',
                textAlign: 'center',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px', // override the cell padding for data cells
                paddingRight: '8px',
            },
        },
    };

    // Expand Row
    const ExpandedComponent = ({ data }) => {
        return (
            <span>
                <div className="alert alert-success" role="alert">
                    <p>Zone ID : &nbsp;{data?.zone.split('Z')[1]} -- {data?.zone}</p>
                    <p>Zone Name : {adminReducer.zone.find(zone => zone.ID === data.zone)?.name}</p>
                    <p>Description : {data?.description}</p>
                </div>
            </span>
        )
    }

    // ==================== DATA TABLE END ===========================



    // =================== CALENDER ===============
    const [events, setEvents] = useState([]);

    const isSameDay = (date1, date2) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month' && events.find(eventDate => isSameDay(eventDate, date))) {
            return <div className="dot"></div>; // Red dot for event dates
        }
    };


    //  ========================= FILTER =========================

    // ------- State for description -------
    // Live search by zone ID
    const [description, setdescription] = useState('');
    // Function to handle changes in the search query for ZoneID
    const handleInputChange_description = (e) => {
        setdescription(e.target.value);
    };


    // -------------- Date -------------------
    // Live search by Date
    const [query, setQuery] = useState('');


    // --------------- Zone -----------------
    // Live search by zone ID
    const [queryZoneID, setQueryZoneID] = useState('');

    // Function to handle changes in the search query for ZoneID
    const handleInputChange_ZoneID = (e) => {
        setQueryZoneID(e.target.value);
    };


    // ---------------- Date Range -------------------------
    // Live search by zone ID
    const [startDate, setStartDate] = useState('');
    // Live search by zone ID
    const [endDate, setEndDate] = useState('');


    // ================ handle chnage function for queryDate | Start date | End date ==================

    const handleInputChange = (e, type) => {
        const date = new Date(e);
        // Get the year, month, and day components
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const day = date.getDate().toString().padStart(2, '0');
        // Concatenate the components in the desired format
        const formattedDate = `${year}-${month}-${day}`
        // Dynamically update start or end date based on the type parameter
        if (type === 'start') {
            setStartDate(formattedDate);
        } else if (type === 'end') {
            setEndDate(formattedDate);
        } else if (type === 'query') {
            setQuery(formattedDate);
        }
    };


    // FINAL DATA SET - With filter - without filter
    const filteredData = adminReducer.attendance.filter((item) => {
        const filteredDataDescription = item.description.toUpperCase().includes(description.toUpperCase())
        const filteredDataDate = item.date.toLowerCase().includes(query.toLowerCase())
        const filteredDataZone = queryZoneID?.toUpperCase() ? item.zone.split('Z')[1]?.toUpperCase() === queryZoneID?.toUpperCase() : true
        const filterDataByDateRange = startDate && endDate
            ? item.date.toLowerCase() >= startDate.toLowerCase() && item.date.toLowerCase() <= endDate.toLowerCase()
            : true
        return filteredDataDescription && filteredDataDate && filteredDataZone && filterDataByDateRange;
    });




    // ============================ Attendance Ratio calculation ============================

    const [totalPercentage, setTotalPercentage] = useState(0)

    useEffect(() => {
        let totalPercentageSum = 0;

        adminReducer.attendanceDetailsData.forEach((value) => {
            const attendanceDetails = value;
            const total = attendanceDetails ? attendanceDetails.total : 0;
            const isPresent = attendanceDetails ? attendanceDetails.isPresent : 0;
            const percentage = total !== 0 ? ((isPresent / total) * 100) : 0;

            totalPercentageSum += percentage;
        });

        setTotalPercentage(totalPercentageSum.toFixed(2) / adminReducer.attendanceDetailsData.length);
    }, [adminReducer.attendanceDetailsData]); // Recalculate if attendanceDetailsData changes


    // ===================================== END =============================================



    useEffect(() => {
        const fetchData = async () => {
            // Assuming adminReducer.attendance is an array of objects with a date property
            if (adminReducer && adminReducer.attendance) {
                const allIds = await Promise.all(adminReducer.attendance.map(async (option) => {
                    const date = new Date(option.date);
                    return date;
                }));
                setEvents(allIds);
            }
        };
        fetchData();
        return () => { };
    }, []);


    return (
        <>

            <div className='row mb-4'>
                <div className="d-inline-flex gap-1 mt-3" style={{ cursor: 'pointer' }}>
                    <div className='card p-3'>
                        <div data-bs-toggle="collapse" data-bs-target="#adminHomeStatistics" aria-expanded="false" aria-controls="adminHomeStatistics">
                            <div className="adminhome_statistics_font">Filter by date and ZoneID 📑</div>
                            <small style={{ fontSize: '12px' }} >Tap to open/close</small>
                        </div>
                    </div>
                    <div className='card p-3'>
                        <div data-bs-toggle="collapse" data-bs-target="#adminHomeStatistics" aria-expanded="false" aria-controls="adminHomeStatistics">
                            <div className="adminhome_statistics_font mb-1">Avg. Attendance</div>
                            <small style={{ fontSize: '18px', fontWeight: '600' }} >{totalPercentage.toFixed(2)}%</small>
                        </div>
                    </div>
                </div>
                <div className="collapse ms-lg-3 mt-3" id="adminHomeStatistics">
                    <div className='col-12'>
                        <hr />
                        <p className='text-center'>By Selection Date | Zone | Description</p>
                        <hr />
                    </div>
                    <p className='mb-5'>
                        <span className='text-danger'>*</span>
                        You can use only Date, only Description & date with zoneID
                    </p>
                    <div className='row my-4'>
                        <div className='col-12 col-md-6 col-lg-3 '>
                            <Calendar
                                tileContent={tileContent}
                                onChange={e => handleInputChange(e, 'query')}
                                formatShortWeekday={(locale, date) => {
                                    const day = date.toLocaleDateString(locale, { weekday: 'short' });
                                    return day.charAt(0); // Return only the first letter of the day name
                                }}
                            />
                        </div>
                        <div className='col-12 col-md-2 col-lg-1 mt-3'>
                            <span> -- OR -- </span>
                        </div>
                        <div className='col-12 col-md-3 col-lg-4'>
                            <select
                                className="form-control input_field"
                                defaultValue={queryZoneID}
                                onChange={handleInputChange_ZoneID}
                            >
                                <option value="">Select zone</option>
                                {
                                    adminReducer.zone.map((value, index) => {
                                        return (
                                            <option value={value.ID.split('Z')[1]} key={index}>{value.ID.split('Z')[1]} - {value?.name}</option>
                                        )
                                    })
                                }
                            </select>
                            <br />
                            <input
                                type="text"
                                className='my-4'
                                min={0}
                                value={description}
                                onChange={handleInputChange_description}
                                placeholder="Search by description"
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <hr />
                            <p className='text-center'>By Date Range</p>
                            <hr />
                        </div>
                        <div className='col-12'>
                            <div className='d-flex my-3'>
                                <div className='me-3'>
                                    <small>Start date</small>
                                    <div>
                                        <input
                                            type="date"
                                            className='mb-4 mt-2'
                                            min={0}
                                            value={startDate}
                                            onChange={(e) => handleInputChange(e.target.value, 'start')}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <small>End date</small>
                                    <div>
                                        <input
                                            type="date"
                                            className='mb-4 mt-2'
                                            min={0}
                                            value={endDate}
                                            onChange={(e) => handleInputChange(e.target.value, 'end')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <button className="btn btn-outline-secondary" onClick={() => {
                                    setQuery('')
                                    setStartDate('')
                                    setEndDate('')
                                }}>Reset all date</button>
                            </div>
                        </div>
                    </div>





                </div>
            </div>


            <div className='col-12' style={{ overflowX: 'auto', maxHeight: '500px' }}>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    customStyles={customStyles}
                    expandableRows
                    paginationRowsPerPageOptions={[10, 15, 20, 30, 50]}
                    expandableRowsComponent={ExpandedComponent}
                />
            </div>




            {/* Update Attendance */}
            <div className="modal fade" id="updateAttendance" tabIndex="-1" aria-labelledby="updateAttendanceLabel" aria-hidden="true">
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="updateAttendanceLabel">Update attendance</h1>
                            <button type="button" id='closeModelupdateAttendance' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {
                                    isAlertVisible
                                        ? alert('success', 'Attendance Updated successfully 😊')
                                        : ""
                                }
                                {
                                    adminReducer.patch_attendance_error === true
                                        ? <div className="alert alert-danger  fade show mt-3" role="alert">
                                            <strong> ⚠️ Opps,</strong>Something went wrong!
                                        </div>
                                        : ""
                                }
                                <div className='row'>
                                    <div className="mb-3 mt-3 col-12 ">
                                        <p>Description<span className='text-danger'>*</span></p>
                                        <input
                                            type="text"
                                            className="form-control input_field"
                                            placeholder="*******"
                                            {...register("description", {
                                                required: true,
                                                pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                            })}
                                        />
                                        <small className="text-danger">{errors.description?.type === 'required' && "Description is required!"}</small>
                                        <small className="text-danger">{errors.description?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                                    </div>
                                    <div className="mb-3 mt-3 col-12 ">
                                        <p>Zone<span className='text-danger'>*</span></p>
                                        <select
                                            className="form-control input_field"
                                            {...register("zone", {
                                                required: true,
                                            })}
                                        >
                                            <option value="">Tap to select</option>
                                            {
                                                adminReducer.zone.map((value, index) => {
                                                    return (
                                                        <option value={value.ID} key={index}>{value.ID} - {value.name} - {value.pincode}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <small className="text-danger">{errors.zone?.type === 'required' && "Zone is required!"}</small>

                                    </div>

                                    <div className="mb-3 mt-3 col-12 ">

                                        <small>Do you want to update date?<span className='text-danger'>*</span></small>
                                        <div>
                                            <input
                                                type='radio'
                                                name='isDateUpdate'
                                                checked={dateUpdateStatus === true}
                                                onClick={() => {
                                                    setdateUpdateStatus(true)
                                                }}
                                            /> &nbsp;<span>Yes</span>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <input
                                                type='radio'
                                                defaultChecked
                                                name='isDateUpdate'
                                                checked={dateUpdateStatus === false}
                                                onClick={() => setdateUpdateStatus(false)}
                                            /> &nbsp;<span>No</span>
                                        </div>
                                        {
                                            dateUpdateStatus === true
                                                ? <>
                                                    <p className='mt-4'>Date<span className='text-danger'>*</span></p>
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control input_field"
                                                        placeholder="*******"
                                                        {...register("date", {
                                                            required: true,
                                                        })}
                                                    />
                                                    <small className="text-danger">{errors.date?.type === 'required' && "Date is required!"}</small>
                                                </>
                                                : ""
                                        }

                                    </div>
                                </div>


                                {
                                    adminReducer.patch_attendance_progress === true
                                        ? <button disabled className="btn btn_signin mb-3 mt-3 col-12">{btnspinner()}</button>
                                        : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12">Update</button>
                                }

                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Attendance */}
            <div className="modal fade" id="deleteAttendance" tabIndex="-1" aria-labelledby="deleteAttendanceLabel" aria-hidden="true">
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteAttendanceLabel">Delete attendance</h1>
                            <button type="button" id='closeModeldeleteAttendance' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                isAlertVisible1
                                    ? alert('success', 'Attendance deleted successfully 😊')
                                    : ""
                            }
                            {
                                adminReducer.delete_attendance_error === true
                                    ? <div className="alert alert-danger fade show mt-3" role="alert">
                                        <strong> ⚠️ Opps,</strong>Something went wrong!
                                    </div>
                                    : ""
                            }
                            <div className="alert alert-danger" role="alert">
                                Are you sure you want to delete data?
                            </div>
                            {
                                adminReducer.delete_attendance_progress === true
                                    ? <button disabled className="btn  btn-outline-danger mb-3 mt-3 col-12">{spinner()}</button>
                                    : <button type="submit" className="btn  btn-outline-danger mb-3 mt-3 col-12" onClick={() => onDelete()}>Delete</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageAttendace