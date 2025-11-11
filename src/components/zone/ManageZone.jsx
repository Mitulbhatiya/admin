import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


// import logo
import satdhamLogo from '../assets/satdham_logo.jpeg'

const ManageZone = () => {
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    // Live search by Zone name
    const [query, setQuery] = useState('');
    // Function to handle changes in the search query
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Filter the array based on the search query
    const filteredData = adminReducer.zone.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );


    // Live search by zone ID
    const [queryZoneID, setQueryZoneID] = useState('');

    // Function to handle changes in the search query for ZoneID
    const handleInputChange_ZoneID = (e) => {
        setQueryZoneID(e.target.value);

    };
    // Filter the array based on the search query for ZoneID
    const filteredDataZoneID = adminReducer.zone.filter(item =>
        item.ID.split('Z')[1].toUpperCase().includes(queryZoneID.toUpperCase())
    );

    const generatePDF = async (value) => {
        // setpdfExportStatus(true)


        await adminReducer.users?.sort((a, b) => (a.subzone < b.subzone ? -1 : 1))


        let doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: [595, 842]
        })

        const imageHeight = 150
        doc.setFontSize(11);
        doc.addImage(satdhamLogo, "PNG", 172.5, 100, 250, 233, imageHeight)
        doc.setFontSize(20);
        doc.text(`Sat-Sabha member report of zone : ${value?.ID}`, 110, 400)
        doc.setFontSize(14)
        doc.text(`Zone ID : ${value?.ID.split('Z')[1]}`, 50, 550)
        doc.text(`Zone name : ${value?.name}`, 50, 570)
        doc.text(`County : ${value?.location.country}`, 50, 590)
        doc.text(`State : ${value?.location.state}`, 50, 610)
        doc.text(`City : ${value?.location.city}`, 50, 630)
        doc.text(`Pincode : ${value?.pincode}`, 50, 650)
        doc.text(`Ratio : ${averagePresentRatio[value?.ID]}%`, 50, 670)
        doc.addPage();
        let i = 0
        await autoTable(doc, {
            margin: { top: 50, right: 50, bottom: 10, left: 50 },
            head: [['#', 'UID', 'Subzone', 'Name', 'Mobile', 'Gender', 'Attendance', 'Role']],
            body: adminReducer.users.flatMap(row => {
                if (row.zone === value.ID) {
                    i = i + 1
                    return [
                        [
                            i,
                            row.ID.split('P')[1],
                            row.subzone,
                            `${row.lastname} ${row.firstname} ${row.middlename}`,
                            row.mobile,
                            row.gender,
                            `${row.attendance}%`,
                            `${row?.role === "zonesubadmin" ? "Sub-admin" : row?.role === "admin" ? "Admin" : "User"}`
                        ]
                    ];
                }
                return [];
            }),
        });

        await doc.save(`${value?.ID}.pdf`)
    }

    const [averagePresentRatio, setAveragePresentRatio] = useState({});

    useEffect(() => {
        const result = adminReducer.attendanceDetailsData.reduce((acc, { zone, isPresent, total }) => {
            if (!acc[zone]) {
                acc[zone] = { totalIsPresent: 0, totalTotal: 0 };
            }
            acc[zone].totalIsPresent += isPresent;
            acc[zone].totalTotal += total;
            return acc;
        }, {});

        const avgPresentRatio = {};
        for (const zone in result) {
            const { totalIsPresent, totalTotal } = result[zone];
            const presentRatio = (totalIsPresent / totalTotal) * 100;
            avgPresentRatio[zone] = `${presentRatio.toFixed(2)}`;
        }

        setAveragePresentRatio(avgPresentRatio);
    }, [adminReducer.attendanceDetailsData]);



    const [zoneDataCount, setZoneDataCount] = useState([])
    const zoneData = async () => {
        let attendanceZone = []

        await adminReducer.zone.map((zval1, index) => {
            attendanceZone.push({
                zonename: zval1,
                users: 0,
                admin: 0,
                subadmin: 0
            })
        })

        // Iterate over each zone in attendanceZone
        await attendanceZone.map(async (val1, index) => {
            // Iterate over each user
            let user = 0
            let admin = 0
            let subadmin = 0
            await adminReducer.users.map((val2, index2) => {
                // Check if the user's zone matches the current zone's ID
                if (val1.zonename.ID === val2.zone) {
                    user = user + 1
                    if (val2.role === "admin") admin = admin + 1
                    if (val2.role === "zonesubadmin") subadmin = subadmin + 1
                }
            });
            attendanceZone[index].users = user;
            attendanceZone[index].admin = admin;
            attendanceZone[index].subadmin = subadmin;
        });
        setZoneDataCount(attendanceZone);
    }

    useEffect(() => {
        zoneData()
    }, [])
    return (
        <>

            <div>
                {/* <input
                    type="text"
                    className='my-4'
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search by zone name"
                /> */}
                <div className='row mb-3'>
                    <div className="mb-3 mt-3 col-12 col-md-4 col-lg-2">
                        <p>Filter by Zone</p>
                        <select
                            className="form-control input_field"
                            defaultValue={query}
                            onChange={handleInputChange}
                        >
                            <option value="">Select zone</option>
                            {
                                adminReducer.zone.map((value, index) => {
                                    return (
                                        <option value={value?.name} key={index}>{value.ID.split('Z')[1]} - {value?.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                {/* <span> -- OR -- </span>
                <input
                    type="number"
                    className='my-4'
                    min={0}
                    value={queryZoneID}
                    onChange={handleInputChange_ZoneID}
                    placeholder="Search by zone ID"
                /> */}
            </div>

            <div className='col-12' style={{ overflowX: 'auto' }}>
                <table className="table">
                    <thead style={{ textAlign: 'left' }}>
                        <tr>
                            {/* <td>#</td> */}
                            <th>ZID</th>
                            <th>Name</th>
                            <th>Admins</th>
                            <th>Sub-admins</th>
                            <th>Members</th>
                            <th>Ratio</th>
                            <th>Country</th>
                            <th>State</th>
                            <th>City</th>
                            <th>Pincode</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            adminReducer.zone?.length === 0
                                ? <tr>
                                    <td colSpan={11} className='text-center'>🙁 No location data</td>
                                </tr>
                                : <>
                                    {query ? (
                                        // If there is a search query, display filtered results
                                        filteredData.map((value, index) => {
                                            const p = averagePresentRatio[value.ID]
                                            return (
                                                <tr key={index}>
                                                    {/* <td >{index + 1}</td> */}
                                                    <td>{value?.ID.split('Z')[1]}</td>
                                                    <td>{value?.name}</td>
                                                    <td>{zoneDataCount.filter(d => d.zonename.ID === value?.ID)[0]?.admin}</td>
                                                    <td>{zoneDataCount.filter(d => d.zonename.ID === value?.ID)[0]?.subadmin}</td>
                                                    <td>{zoneDataCount.filter(d => d.zonename.ID === value?.ID)[0]?.users}</td>
                                                    <td className={` font_w ${p >= 75 ? "text-success" : p < 75 && p >= 50 ? "yellow_color" : "text-danger"}`}>{p}%</td>
                                                    <td>{value?.location.country}</td>
                                                    <td>{value?.location.state}</td>
                                                    <td>{value?.location.city}</td>
                                                    <td>{value?.pincode}</td>
                                                    <td>
                                                        <Link to={`/zone/${value.ID}`}>
                                                            <button className='adminHomeEditBtn mb-2 me-2'>
                                                                <i className='bx bx-right-arrow-alt'></i>
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : queryZoneID !== "" ? (
                                        // If there is a search query, display filtered results
                                        filteredDataZoneID.map((value, index) => {
                                            const p = averagePresentRatio[value.ID]
                                            return (
                                                <tr key={index}>
                                                    {/* <td >{index + 1}</td> */}
                                                    <td>{value?.ID.split('Z')[1]}</td>
                                                    <td>{value?.name}</td>
                                                    <td>{zoneDataCount.filter(d => d.zonename.ID === value?.ID)[0]?.admin}</td>
                                                    <td>{zoneDataCount.filter(d => d.zonename.ID === value?.ID)[0]?.subadmin}</td>
                                                    <td>{zoneDataCount.filter(d => d.zonename.ID === value?.ID)[0]?.users}</td>
                                                    <td className={` font_w ${p >= 75 ? "text-success" : p < 75 && p >= 50 ? "yellow_color" : "text-danger"}`}>{p}%</td>
                                                    <td>{value?.location.country}</td>
                                                    <td>{value?.location.state}</td>
                                                    <td>{value?.location.city}</td>
                                                    <td>{value?.pincode}</td>
                                                    <td>
                                                        <Link to={`/zone/${value.ID}`}>
                                                            <button className='adminHomeEditBtn mb-2 me-2'>
                                                                <i className='bx bx-right-arrow-alt'></i>
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        // If there is no search query, display the full list
                                        adminReducer.zone?.map((value, index) => {
                                            const p = averagePresentRatio[value.ID]
                                            return (
                                                <tr key={index}>
                                                    {/* <td >{index + 1}</td> */}
                                                    <td>{value?.ID.split('Z')[1]}</td>
                                                    <td>{value?.name}</td>
                                                    <td>{zoneDataCount.filter(d => d.zonename.ID === value?.ID)[0]?.admin}</td>
                                                    <td>{zoneDataCount.filter(d => d.zonename.ID === value?.ID)[0]?.subadmin}</td>
                                                    <td>{zoneDataCount.filter(d => d.zonename.ID === value?.ID)[0]?.users}</td>
                                                    <td className={` font_w ${p >= 75 ? "text-success" : p < 75 && p >= 50 ? "yellow_color" : "text-danger"}`}>{p}%</td>
                                                    <td>{value?.location.country}</td>
                                                    <td>{value?.location.state}</td>
                                                    <td>{value?.location.city}</td>
                                                    <td>{value?.pincode}</td>
                                                    <td>
                                                        <button className='adminHomeEditBtn mb-2 me-2' onClick={() => generatePDF(value)}>
                                                            PDF <i className='bx bxs-file-pdf'></i>
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <Link to={`/zone/${value.ID}`}>
                                                            <button className='adminHomeEditBtn mb-2 me-2'>
                                                                <i className='bx bx-right-arrow-alt'></i>
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    )}


                                </>
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ManageZone