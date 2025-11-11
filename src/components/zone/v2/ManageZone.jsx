import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

// PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// import logo
import satdhamLogo from '../../assets/satdham_logo.jpeg'

// DataTable
import DataTable from 'react-data-table-component'

const ManageZone = () => {

    // Redux part :: Assign & create Object
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)


    // =============== State ============================

    // State for zone data and zone admins
    const [zoneDataCount, setZoneDataCount] = useState([])
    // State for avarage Ratio
    const [averagePresentRatio, setAveragePresentRatio] = useState({});
    // State for select zone
    const [selectZone, setselectZone] = useState("")
    // State for location
    const [selectCounty, setselectCounty] = useState("")
    const [selectState, setselectState] = useState("")
    const [selectCity, setselectCity] = useState("")
    const [selectStatus, setselectStatus] = useState("")


    // Arr for country
    let CountryArr = []

    adminReducer.location?.map((value, index) => {
        if (!CountryArr.includes(value.country)) {
            CountryArr.push(value.country)
        }
    })

    // GENERATE PDF
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



    // Datatable assign column
    const columns = [
        {
            name: 'ZID',
            cell: (row, index) => row?.ID.split('Z')[1],
            width: '4rem'
        },
        {
            name: 'Name',
            selector: row => row?.name,
            width: '18rem',
        },
        {
            name: 'Admins',
            selector: row => zoneDataCount.filter(d => d.zonename.ID === row?.ID)[0]?.admin,
            width: '8rem',
        },
        {
            name: 'Sub-admins',
            selector: row => zoneDataCount.filter(d => d.zonename.ID === row?.ID)[0]?.subadmin,
            width: '8rem'
        },
        {
            name: 'Users',
            selector: row => zoneDataCount.filter(d => d.zonename.ID === row?.ID)[0]?.users,
            width: '8rem'
        },
        {
            name: 'Ratio',
            selector: row => <small>
                <div className={` font_w ${averagePresentRatio[row?.ID] >= 75 ? "text-success" : averagePresentRatio[row?.ID] < 75 && averagePresentRatio[row?.ID] >= 50 ? "yellow_color" : "text-danger"}`}>{averagePresentRatio[row?.ID]}%</div>
            </small>,
            width: '7rem'
        },
        {
            name: 'Country',
            selector: row => row?.location.country,
            width: '9rem'
        },
        {
            name: 'State',
            selector: row => row?.location.state,
            width: '9rem'
        },
        {
            name: 'City',
            selector: row => row?.location.city,
            width: '9rem'
        },
        {
            name: ' ',
            selector: row => <>
                <button className='adminHomeEditBtn mb-2 me-2' onClick={() => generatePDF(row)}>
                    PDF <i className='bx bxs-file-pdf'></i>
                </button>
            </>,
            width: '8rem',
            sortable: true,

        },
        {
            name: ' ',
            selector: row => <>
                <Link to={`/zone/${row?.ID}`}>
                    <button className='adminHomeEditBtn mb-2 me-2'>
                        <i className='bx bx-right-arrow-alt'></i>
                    </button>
                </Link>
            </>,
            width: '10rem',
            sortable: true,

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



    // GET data and calculate zone admins
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



    // For calculate avarage ratio
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



    // Filter data based on selected options
    const filteredData = adminReducer.zone.filter((zone) => {
        const matchesCountry = selectCounty ? zone.location.country === selectCounty : true;
        const matchesState = selectState ? zone.location.state === selectState : true;
        const matchesCity = selectCity ? zone.location.city === selectCity : true;
        const matchesZone = selectZone.toLowerCase() ? zone.name.toLowerCase() === selectZone.toLowerCase() : true;

        return matchesCountry && matchesState && matchesCity && matchesZone;
    });


    return (
        <>

            <div className='row mb-4'>
                <div className="mb-3 mt-3 col-12 col-md-4 col-lg-2">
                    <p>Filter by Zone</p>
                    <select
                        className="form-control input_field"
                        value={selectZone}
                        onChange={(e) => setselectZone(e.target.value)}
                    >
                        <option value="">Tap to select</option>
                        {
                            adminReducer.zone.map((value, index) => {
                                return (
                                    <option value={value?.name} key={index}>{value.ID.split('Z')[1]} - {value?.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="mb-3 mt-3 col-12 col-md-3">
                    <p>Filter by Country</p>
                    <select
                        className="form-control input_field"
                        value={selectCounty}
                        onChange={(e) => setselectCounty(e.target.value)}
                    >
                        <option value="">Tap to select</option>
                        {
                            CountryArr.map((value, index) => {
                                return (
                                    <option value={value} key={index}>{value}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="mb-3 mt-3 col-12 col-md-3">
                    <p>Filter by State</p>
                    <select
                        className="form-control input_field"
                        value={selectState}
                        onChange={(e) => setselectState(e.target.value)}
                    >
                        <option value="">Tap to select</option>
                        {
                            (() => {
                                const uniqueState = new Set(); // Use a set to track unique state

                                return adminReducer.location?.map((value, index) => {
                                    if (selectCounty === value.country && !uniqueState.has(value.state)) {
                                        // Add the state to the set to ensure uniqueness
                                        uniqueState.add(value.state);

                                        return (
                                            <option value={value.state} key={index}>{value.state}</option>
                                        );
                                    }

                                    return null; // Return null for duplicates to exclude them from the result
                                });
                            })()
                        }
                    </select>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                customStyles={customStyles}
            />
        </>
    )
}

export default ManageZone