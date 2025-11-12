import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { spinner } from '../../../constant/alert';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import logo
import satdhamLogo from '../../assets/satdham_logo.jpeg'

const AttendanceDate = () => {
    const adminReducer = useSelector(state => state.adminReducer)
    const [attendanceZoneData, setattendanceZoneData] = useState([])


    // Attendance details number 
    const [numberAtdetails, setnumberAtdetails] = useState(6);


    // Live search by Username
    const [query, setQuery] = useState('');
    // Function to handle changes in the search query
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Filter the array based on the search query
    const filteredData = attendanceZoneData?.map(zone => ({
        ...zone,
        users: zone.users.filter(user =>
            (user.firstname.toLowerCase() + " " + user.lastname.toLowerCase()).includes(query.toLowerCase())
        )
    }));


    // Live search by zone ID
    const [queryuserID, setQueryuserID] = useState('');

    // Function to handle changes in the search query for ZoneID
    const handleInputChange_UserID = (e) => {
        setQueryuserID(e.target.value);

    };
    // Filter the array based on the search query for ZoneID
    const filteredDataUserID = attendanceZoneData?.map(udata => ({
        ...udata,
        users: udata.users.filter(user =>
            (user.ID.split('P')[1].toUpperCase().includes(queryuserID.toUpperCase()))
        )
    }));



    // Live search by user mobile
    const [queryuserMobile, setQueryuserMobile] = useState('');

    // Function to handle changes in the search query for User mobile
    const handleInputChange_UserMobile = (e) => {
        setQueryuserMobile(e.target.value);

    };
    // Filter the array based on the search query for User mobile
    const filteredDataUserMobile = attendanceZoneData?.map(udata => ({
        ...udata,
        users: udata.users.filter(user =>
            (user.mobile.toUpperCase().includes(queryuserMobile.toUpperCase()))
        )
    }));



    // Live search by Zone
    const [queryuserZone, setQueryuserZone] = useState('');

    // Function to handle changes in the search query for Zone
    const handleInputChange_UserZone = (e) => {
        setQueryuserZone(e.target.value);

    };
    // Filter the array based on the search query for Zone
    const filteredDataUserZone = attendanceZoneData?.map(udata => ({
        ...udata,
        users: udata.users.filter(user =>
            (user.zone.split('Z')[1].toUpperCase().includes(queryuserZone.toUpperCase()))
        )
    }));




    // Live search by user mobile
    const [belowAttendance, setbelowAttendance] = useState('');

    // Function to handle changes in the search query for User mobile
    const handleInputChange_BelowAttendance = (e) => {
        setbelowAttendance(e.target.value);

    };
    // Filter the array based on the search query for User mobile
    const filteredDataBelowAttendance = attendanceZoneData?.map(udata => ({
        ...udata,
        users: udata.users.filter(user =>
            (user.attendance < belowAttendance)
        )
    }));

    // Below attendance and Zone
    const filteredDataBelowAttendance_zone = attendanceZoneData?.map(udata => ({
        ...udata,
        users: udata.users.filter(user =>
            (user.zone.split('Z')[1].toUpperCase().includes(queryuserZone.toUpperCase()) && user.attendance < belowAttendance)
        )
    }));










    const generateReport = async () => {
        let attendanceZone = []

        await adminReducer.zone.map((zval1, index) => {
            attendanceZone.push({
                zonename: zval1,
                users: []
            })
        })

        // Iterate over each zone in attendanceZone
        await attendanceZone.map(async (val1, index) => {
            // Iterate over each user
            await adminReducer.users.map((val2, index2) => {
                // Check if the user's zone matches the current zone's ID
                if (val1.zonename.ID === val2.zone) {
                    // Initialize an empty array to store attendance details for this user
                    val2.attendanceDetails = [];
                    // Iterate over each attendance detail
                    const sortedAttendanceDetails = adminReducer.attendanceDetails.sort((a, b) => new Date(b.date) - new Date(a.date));
                    sortedAttendanceDetails.forEach(val3 => {
                        // Check if the user's ID matches the SATID in the attendance detail
                        if (val2._id === val3.SATID) {
                            // If there is a match, add the attendance detail to the user's attendanceDetails array
                            val2.attendanceDetails.push(val3);
                        }
                    });
                    // Add the user to the users array of the corresponding zone
                    attendanceZone[index].users.push(val2);
                }
            });
        });
        setattendanceZoneData(attendanceZone);
    }



    // GENERATE PDF
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
        doc.text('Sat-Sabha member report by zones', 120, 400)
        doc.setFontSize(14)
        doc.addPage();


        let flattenedDataByZone = {};

        // Iterate over each element in attendanceZoneData
        await attendanceZoneData?.forEach((value, index) => {
            value.users.forEach((d, ind) => {
                let attendanceDetails = d.attendanceDetails.slice(0, numberAtdetails).map(d2 => ({
                    date: `${d2?.date.split('T')[0].split('-')[2]}-${d2?.date.split('T')[0].split('-')[1]}`,
                    status: d2?.isPresent ? 'P' : 'A'
                }));

                // Fill remaining cells with dashes if less than 6
                while (attendanceDetails.length < numberAtdetails) {
                    attendanceDetails.push({ date: '-', status: '-' });
                }

                // Check if zone exists in flattenedDataByZone
                if (!flattenedDataByZone[d.zone]) {
                    flattenedDataByZone[d.zone] = [];
                }
                // Push flattened data for each user into the corresponding zone array
                flattenedDataByZone[d.zone].push({
                    count: flattenedDataByZone[d.zone].length + 1,
                    ID: d?.ID,
                    name: `${d?.firstname} ${d?.lastname}`,
                    zone: d?.zone || "-",
                    attendance: d?.attendance,
                    attendanceDetails: attendanceDetails
                    // at0: `${attendanceDetails[0].date} : ${attendanceDetails[0].status}`,
                    // at1: `${attendanceDetails[1].date} : ${attendanceDetails[1].status}`,
                    // at2: `${attendanceDetails[2].date} : ${attendanceDetails[2].status}`,
                    // at3: `${attendanceDetails[3].date} : ${attendanceDetails[3].status}`,
                    // at4: `${attendanceDetails[4].date} : ${attendanceDetails[4].status}`,
                    // at5: `${attendanceDetails[5].date} : ${attendanceDetails[5].status}`,
                });
            });
        });

        // flattenedDataByZone now contains an object where keys are zone names and values are arrays of flattened data for each zone
        let flattenedDataByZoneArray = [];

        await Object.entries(flattenedDataByZone).forEach(([zone, data]) => {
            flattenedDataByZoneArray.push({ zone, data });
        });

        if (flattenedDataByZoneArray && flattenedDataByZoneArray.length > 0) {
            if (queryuserZone && belowAttendance) {
                flattenedDataByZoneArray.map((data, indx) => {
                    if (queryuserZone === data.zone.split('Z')[1].toUpperCase()) {
                        // IF zone wise attendance
                        doc.setFontSize(25);
                        doc.text(`Zone : ${data.zone}`, 225, 400)
                        doc.addPage();
                        doc.setFontSize(14)
                        let i = 0
                        // Ensure that the data array is not empty
                        if (data.data && data.data.length > 0) {
                            autoTable(doc, {
                                margin: { top: 30, right: 10, bottom: 10, left: 10 },
                                head: [['#', 'ID', 'Name', 'Zone', 'Attendance', { content: 'Recent 6 attendace details', colSpan: 6 }]],
                                body: data.data.flatMap(row => {
                                    if (row.attendance < belowAttendance) {
                                        i = i + 1
                                        return [
                                            [
                                                i,
                                                row.ID,
                                                row.name,
                                                row.zone,
                                                `${row.attendance}%`,
                                                ...row.attendanceDetails.map(detail => `${detail.date} : ${detail.status}`)
                                            ]
                                        ];
                                    }
                                    return []; // Return an empty array if the condition is not met
                                }),
                            });
                            doc.addPage();
                        }
                    }
                });
            } else if (queryuserZone) {
                flattenedDataByZoneArray.map((data, indx) => {
                    if (queryuserZone === data.zone.split('Z')[1].toUpperCase()) {
                        // IF zone wise attendance
                        doc.setFontSize(25);
                        doc.text(`Zone : ${data.zone}`, 225, 400)
                        doc.addPage();
                        doc.setFontSize(14)

                        // Ensure that the data array is not empty
                        if (data.data && data.data.length > 0) {
                            autoTable(doc, {
                                margin: { top: 30, right: 10, bottom: 10, left: 10 },
                                head: [['#', 'ID', 'Name', 'Zone', 'Attendance', { content: 'Recent 6 attendace details', colSpan: 6 }]],
                                body: data.data.map(row => [
                                    row.count,
                                    row.ID,
                                    row.name,
                                    row.zone,
                                    `${row.attendance}%`,
                                    ...row.attendanceDetails.map(detail => `${detail.date} : ${detail.status}`)
                                ]),
                            });
                            doc.addPage();
                        } else {
                            // console.log("Data array is empty");
                        }
                    }
                });
            } else if (belowAttendance) {
                flattenedDataByZoneArray.map((data, indx) => {
                    // IF zone wise attendance
                    doc.setFontSize(25);
                    doc.text(`Zone : ${data.zone}`, 225, 400)
                    doc.addPage();
                    doc.setFontSize(14)
                    let i = 0
                    // Ensure that the data array is not empty
                    if (data.data && data.data.length > 0) {
                        autoTable(doc, {
                            margin: { top: 30, right: 10, bottom: 10, left: 10 },
                            head: [['#', 'ID', 'Name', 'Zone', 'Attendance', { content: 'Recent 6 attendace details', colSpan: 6 }]],
                            body: data.data.flatMap(row => {
                                if (row.attendance < belowAttendance) {
                                    i = i + 1
                                    return [
                                        [
                                            i,
                                            row.ID,
                                            row.name,
                                            row.zone,
                                            `${row.attendance}%`,
                                            ...row.attendanceDetails.map(detail => `${detail.date} : ${detail.status}`)
                                        ]
                                    ];
                                }
                                return []; // Return an empty array if the condition is not met
                            }),
                        });
                        doc.addPage();
                    }
                });
            } else {
                flattenedDataByZoneArray.map((data, indx) => {
                    doc.setFontSize(25);
                    doc.text(`Zone : ${data.zone}`, 225, 400)
                    doc.addPage();
                    doc.setFontSize(14)

                    let num = Number(numberAtdetails)
                    // Ensure that the data array is not empty
                    if (data.data && data.data.length > 0) {
                        autoTable(doc, {
                            margin: { top: 30, right: 10, bottom: 10, left: 10 },
                            head: [['#', 'ID', 'Name', 'Zone', 'Attendance', { content: `Recent ${num} attendace details`, colSpan: num }]],
                            body: data.data.map(row => [
                                row.count,
                                row.ID,
                                row.name,
                                row.zone,
                                `${row.attendance}%`,
                                ...row.attendanceDetails.map(detail => `${detail.date} : ${detail.status}`)
                            ]),
                        });
                        doc.addPage();
                    } else {
                        // console.log("Data array is empty");
                    }
                });
            }

            await doc.save(`trip_1.pdf`)
        } else {

        }


        // Name of PDF

        // setpdfExportStatus(false)
    }




    let count = 0
    useEffect(() => {
        (async () => {
            generateReport()
        })();

        return () => { };

    }, [])
    return (
        <>
            {
                attendanceZoneData.length === 0
                    ? spinner()
                    : <>
                        <div>
                            <input
                                type="number"
                                className='my-4'
                                value={numberAtdetails}
                                min={0}
                                onChange={(e) => setnumberAtdetails(e.target.value)}
                                placeholder="Attendace details number"
                            />

                        </div>
                        <div>
                            <input
                                type="text"
                                className='my-4'
                                value={query}
                                onChange={handleInputChange}
                                placeholder="Search by user name"
                            />
                            <span> -- OR -- </span>
                            <input
                                type="number"
                                className='my-4'
                                min={0}
                                value={queryuserID}
                                onChange={handleInputChange_UserID}
                                placeholder="Search by UID"
                            />
                            <span> -- OR -- </span>
                            <input
                                type="number"
                                className='my-4'
                                min={0}
                                value={queryuserMobile}
                                onChange={handleInputChange_UserMobile}
                                placeholder="Search by Mobile"
                            />
                            <span> -- OR -- </span>
                            <input
                                type="number"
                                className='my-4'
                                min={0}
                                value={queryuserZone}
                                onChange={handleInputChange_UserZone}
                                placeholder="Search by Zone"
                            />
                            <span> -- || -- </span>
                            <input
                                type="number"
                                className='my-4'
                                min={0}
                                value={belowAttendance}
                                onChange={handleInputChange_BelowAttendance}
                                placeholder="Below attendance"
                            />
                            <button className='adminHomeEditBtn mb-2 me-2' onClick={() => generatePDF()}>
                                PDF <i className='bx bxs-file-pdf'></i>
                            </button>
                        </div>

                        <hr className='my-4' />
                        <div className='col-12' style={{ overflowX: 'auto', maxHeight: '400px' }}>
                            <table className="table">
                                <thead style={{ textAlign: 'left' }}>
                                    <tr>
                                        <td>#</td>
                                        <th>UID</th>
                                        <th>Name</th>
                                        <th>Mobile</th>
                                        <th>Gender</th>
                                        <th>Zone</th>
                                        <th>Attendance</th>
                                        <th>Attendance</th>
                                        <th colSpan={numberAtdetails}>Last {numberAtdetails} Availability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        adminReducer.users?.length === 0
                                            ? <tr>
                                                <td colSpan={5} className='text-center'>🙁 No location data</td>
                                            </tr>
                                            :

                                            <>
                                                {belowAttendance !== "" && queryuserZone !== "" ? (
                                                    // If there is a search query, display filtered results
                                                    filteredDataBelowAttendance_zone.map((value, index) => (
                                                        <>
                                                            {
                                                                value.users.map((d, ind) => {
                                                                    count = count + 1
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td >{count}</td>
                                                                            <td>
                                                                                <Link to={`/user/${d?.ID}`}>
                                                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                                                        {d?.ID}
                                                                                    </button>
                                                                                </Link>
                                                                            </td>
                                                                            <td><img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} /> {d?.firstname} {d?.lastname}</td>
                                                                            <td>{d?.mobile}</td>
                                                                            <td>{d?.gender}</td>
                                                                            <td>{d?.zone || "-"}</td>
                                                                            <td>{d?.attendance}%</td>
                                                                            {d.attendanceDetails.map((d2, ind2) => {
                                                                                if (ind2 < numberAtdetails) {
                                                                                    return (
                                                                                        <td key={ind2}>
                                                                                            <small>{`${d2?.date.split('T')[0].split('-')[2]}-${d2?.date.split('T')[0].split('-')[1]} :` || "-"} <span style={{ fontSize: '18px' }} className={`${d2?.isPresent === true ? '' : 'text-danger fw-blod'}`}>{`${d2?.isPresent === true ? "P" : "A"}`}</span></small>
                                                                                        </td>
                                                                                    );
                                                                                }
                                                                                return null; // Skip rendering if ind2 >= 6
                                                                            })}
                                                                            {/* Fill remaining cells with dashes if less than 6 */}
                                                                            {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                <td key={ind2 + numberAtdetails}>-</td>
                                                                            ))}
                                                                        </tr>
                                                                    )
                                                                })

                                                            }
                                                        </>
                                                    ))
                                                ) : query ? (
                                                    // If there is a search query, display filtered results
                                                    filteredData.map((value, index) => (
                                                        <>
                                                            {
                                                                value.users.map((d, ind) => {
                                                                    count = count + 1
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{count}</td>
                                                                            <td>
                                                                                <Link to={`/user/${d?.ID}`}>
                                                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                                                        {d?.ID}
                                                                                    </button>
                                                                                </Link>
                                                                            </td>
                                                                            <td><img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} /> {d?.firstname} {d?.lastname}</td>
                                                                            <td>{d?.mobile}</td>
                                                                            <td>{d?.gender}</td>
                                                                            <td>{d?.zone || "-"}</td>
                                                                            <td>{d?.attendance}%</td>
                                                                            {d.attendanceDetails.map((d2, ind2) => {
                                                                                if (ind2 < numberAtdetails) {
                                                                                    return (
                                                                                        <td key={ind2}>
                                                                                            <small>{`${d2?.date.split('T')[0].split('-')[2]}-${d2?.date.split('T')[0].split('-')[1]} :` || "-"} <span style={{ fontSize: '18px' }} className={`${d2?.isPresent === true ? '' : 'text-danger fw-blod'}`}>{`${d2?.isPresent === true ? "P" : "A"}`}</span></small>
                                                                                        </td>
                                                                                    );
                                                                                }
                                                                                return null; // Skip rendering if ind2 >= 6
                                                                            })}
                                                                            {/* Fill remaining cells with dashes if less than 6 */}
                                                                            {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                <td key={ind2 + numberAtdetails}>-</td>
                                                                            ))}
                                                                        </tr>
                                                                    )
                                                                })

                                                            }
                                                        </>
                                                    ))
                                                ) : queryuserID !== "" ? (
                                                    // If there is a search query, display filtered results
                                                    filteredDataUserID.map((value, index) => (
                                                        <>
                                                            {
                                                                value.users.map((d, ind) => {
                                                                    count = count + 1
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td >{count}</td>
                                                                            <td>
                                                                                <Link to={`/user/${d?.ID}`}>
                                                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                                                        {d?.ID}
                                                                                    </button>
                                                                                </Link>
                                                                            </td>
                                                                            <td><img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} /> {d?.firstname} {d?.lastname}</td>
                                                                            <td>{d?.mobile}</td>
                                                                            <td>{d?.gender}</td>
                                                                            <td>{d?.zone || "-"}</td>
                                                                            <td>{d?.attendance}%</td>
                                                                            {d.attendanceDetails.map((d2, ind2) => {
                                                                                if (ind2 < numberAtdetails) {
                                                                                    return (
                                                                                        <td key={ind2}>
                                                                                            <small>{`${d2?.date.split('T')[0].split('-')[2]}-${d2?.date.split('T')[0].split('-')[1]} :` || "-"} <span style={{ fontSize: '18px' }} className={`${d2?.isPresent === true ? '' : 'text-danger fw-blod'}`}>{`${d2?.isPresent === true ? "P" : "A"}`}</span></small>
                                                                                        </td>
                                                                                    );
                                                                                }
                                                                                return null; // Skip rendering if ind2 >= 6
                                                                            })}
                                                                            {/* Fill remaining cells with dashes if less than 6 */}
                                                                            {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                <td key={ind2 + numberAtdetails}>-</td>
                                                                            ))}
                                                                        </tr>
                                                                    )
                                                                })

                                                            }
                                                        </>
                                                    ))
                                                ) : queryuserMobile !== "" ? (
                                                    // If there is a search query, display filtered results
                                                    filteredDataUserMobile.map((value, index) => (
                                                        <>
                                                            {
                                                                value.users.map((d, ind) => {
                                                                    count = count + 1
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td >{count}</td>
                                                                            <td>
                                                                                <Link to={`/user/${d?.ID}`}>
                                                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                                                        {d?.ID}
                                                                                    </button>
                                                                                </Link>
                                                                            </td>
                                                                            <td><img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} /> {d?.firstname} {d?.lastname}</td>
                                                                            <td>{d?.mobile}</td>
                                                                            <td>{d?.gender}</td>
                                                                            <td>{d?.zone || "-"}</td>
                                                                            <td>{d?.attendance}%</td>
                                                                            {d.attendanceDetails.map((d2, ind2) => {
                                                                                if (ind2 < numberAtdetails) {
                                                                                    return (
                                                                                        <td key={ind2}>
                                                                                            <small>{`${d2?.date.split('T')[0].split('-')[2]}-${d2?.date.split('T')[0].split('-')[1]} :` || "-"} <span style={{ fontSize: '18px' }} className={`${d2?.isPresent === true ? '' : 'text-danger fw-blod'}`}>{`${d2?.isPresent === true ? "P" : "A"}`}</span></small>
                                                                                        </td>
                                                                                    );
                                                                                }
                                                                                return null; // Skip rendering if ind2 >= 6
                                                                            })}
                                                                            {/* Fill remaining cells with dashes if less than 6 */}
                                                                            {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                <td key={ind2 + numberAtdetails}>-</td>
                                                                            ))}
                                                                        </tr>
                                                                    )
                                                                })

                                                            }
                                                        </>
                                                    ))
                                                ) : queryuserZone !== "" ? (
                                                    // If there is a search query, display filtered results
                                                    filteredDataUserZone.map((value, index) => (
                                                        <>
                                                            {
                                                                value.users.map((d, ind) => {
                                                                    count = count + 1
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td >{count}</td>
                                                                            <td>
                                                                                <Link to={`/user/${d?.ID}`}>
                                                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                                                        {d?.ID}
                                                                                    </button>
                                                                                </Link>
                                                                            </td>
                                                                            <td><img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} /> {d?.firstname} {d?.lastname}</td>
                                                                            <td>{d?.mobile}</td>
                                                                            <td>{d?.gender}</td>
                                                                            <td>{d?.zone || "-"}</td>
                                                                            <td>{d?.attendance}%</td>
                                                                            {d.attendanceDetails.map((d2, ind2) => {
                                                                                if (ind2 < numberAtdetails) {
                                                                                    return (
                                                                                        <td key={ind2}>
                                                                                            <small>{`${d2?.date.split('T')[0].split('-')[2]}-${d2?.date.split('T')[0].split('-')[1]} :` || "-"} <span style={{ fontSize: '18px' }} className={`${d2?.isPresent === true ? '' : 'text-danger fw-blod'}`}>{`${d2?.isPresent === true ? "P" : "A"}`}</span></small>
                                                                                        </td>
                                                                                    );
                                                                                }
                                                                                return null; // Skip rendering if ind2 >= 6
                                                                            })}
                                                                            {/* Fill remaining cells with dashes if less than 6 */}
                                                                            {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                <td key={ind2 + numberAtdetails}>-</td>
                                                                            ))}
                                                                        </tr>
                                                                    )
                                                                })

                                                            }
                                                        </>
                                                    ))
                                                ) : belowAttendance !== "" ? (
                                                    // If there is a search query, display filtered results
                                                    filteredDataBelowAttendance.map((value, index) => (
                                                        <>
                                                            {
                                                                value.users.map((d, ind) => {
                                                                    count = count + 1
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td >{count}</td>
                                                                            <td>
                                                                                <Link to={`/user/${d?.ID}`}>
                                                                                    <button className='adminHomeEditBtn mb-2 me-2'>
                                                                                        {d?.ID}
                                                                                    </button>
                                                                                </Link>
                                                                            </td>
                                                                            <td><img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} /> {d?.firstname} {d?.lastname}</td>
                                                                            <td>{d?.mobile}</td>
                                                                            <td>{d?.gender}</td>
                                                                            <td>{d?.zone || "-"}</td>
                                                                            <td>{d?.attendance}%</td>
                                                                            {d.attendanceDetails.map((d2, ind2) => {
                                                                                if (ind2 < numberAtdetails) {
                                                                                    return (
                                                                                        <td key={ind2}>
                                                                                            <small>{`${d2?.date.split('T')[0].split('-')[2]}-${d2?.date.split('T')[0].split('-')[1]} :` || "-"} <span style={{ fontSize: '18px' }} className={`${d2?.isPresent === true ? '' : 'text-danger fw-blod'}`}>{`${d2?.isPresent === true ? "P" : "A"}`}</span></small>
                                                                                        </td>
                                                                                    );
                                                                                }
                                                                                return null; // Skip rendering if ind2 >= 6
                                                                            })}
                                                                            {/* Fill remaining cells with dashes if less than 6 */}
                                                                            {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                <td key={ind2 + numberAtdetails}>-</td>
                                                                            ))}
                                                                        </tr>
                                                                    )
                                                                })

                                                            }
                                                        </>
                                                    ))
                                                ) : (
                                                    // If there is no search query, display the full list
                                                    attendanceZoneData?.map((value, index) => {
                                                        return (
                                                            <>
                                                                {
                                                                    value.users.map((d, ind) => {
                                                                        count = count + 1
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td >{count}</td>
                                                                                <td>
                                                                                    <Link to={`/user/${d?.ID}`}>
                                                                                        <button className='adminHomeEditBtn mb-2 me-2'>
                                                                                            {d?.ID}
                                                                                        </button>
                                                                                    </Link>
                                                                                </td>
                                                                                <td><img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} /> {d?.firstname} {d?.lastname}</td>
                                                                                <td>{d?.mobile}</td>
                                                                                <td>{d?.gender}</td>
                                                                                <td>{d?.zone || "-"}</td>
                                                                                <td>{d?.attendance}%</td>
                                                                                {d.attendanceDetails.map((d2, ind2) => {
                                                                                    if (ind2 < numberAtdetails) {
                                                                                        return (
                                                                                            <td key={ind2}>
                                                                                                <small>{`${d2?.date.split('T')[0].split('-')[2]}-${d2?.date.split('T')[0].split('-')[1]} :` || "-"} <span style={{ fontSize: '18px' }} className={`${d2?.isPresent === true ? '' : 'text-danger fw-blod'}`}>{`${d2?.isPresent === true ? "P" : "A"}`}</span></small>
                                                                                            </td>
                                                                                        );
                                                                                    }
                                                                                    return null; // Skip rendering if ind2 >= 6
                                                                                })}
                                                                                {/* Fill remaining cells with dashes if less than 6 */}
                                                                                {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                    <td key={ind2 + numberAtdetails}>-</td>
                                                                                ))}
                                                                            </tr>
                                                                        )
                                                                    })

                                                                }
                                                            </>
                                                        )
                                                    })
                                                )}


                                            </>

                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
            }


        </>
    )
}

export default AttendanceDate