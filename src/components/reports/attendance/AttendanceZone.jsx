import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { spinner } from '../../../constant/alert';
import userImg from '../../assets/user.png'

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// import logo
import satdhamLogo from '../../assets/satdham_logo.jpeg'


const AttendanceZone = () => {
    const adminReducer = useSelector(state => state.adminReducer)
    const [attendanceZoneData, setattendanceZoneData] = useState([])


    adminReducer.attendance?.sort((a, b) => (a.date > b.date ? -1 : 1))

    const [dataByZone, setDataByZone] = useState([])
    const [dataByZoneHeader, setDataByZoneHeader] = useState([])

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

    // Attendance details number 
    const [numberAtdetails, setnumberAtdetails] = useState(6);


    // Live search by Username
    const [query, setQuery] = useState('');
    // Function to handle changes in the search query
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };
    // Filter the array based on the search query
    const filteredData = dataByZone?.filter(item =>
        (item.firstname.toLowerCase() + " " + item.lastname.toLowerCase()).includes(query.toLowerCase())
    );


    // Live search by USER ID
    const [queryuserID, setQueryuserID] = useState('');

    // Function to handle changes in the search query for ZoneID
    const handleInputChange_UserID = (e) => {
        setQueryuserID(e.target.value);

    };
    // Filter the array based on the search query for ZoneID
    const filteredDataUserID = dataByZone?.filter(user =>
        (user.ID.split('P')[1].toUpperCase().includes(queryuserID.toUpperCase()))
    );



    // Live search by user mobile
    const [queryuserMobile, setQueryuserMobile] = useState('');

    // Function to handle changes in the search query for User mobile
    const handleInputChange_UserMobile = (e) => {
        setQueryuserMobile(e.target.value);

    };
    // Filter the array based on the search query for User mobile
    const filteredDataUserMobile = dataByZone?.filter(user =>
        (user.mobile.toUpperCase().includes(queryuserMobile.toUpperCase()))
    );



    // Live search by Zone
    const [queryuserZone, setQueryuserZone] = useState('');

    // Function to handle changes in the search query for Zone
    const handleInputChange_UserZone = (e) => {
        setQueryuserZone(e.target.value);

    };
    // Filter the array based on the search query for Zone
    const filteredDataUserZone = dataByZone?.filter(user =>
        // (user.zone.split('Z')[1].toUpperCase().includes(queryuserZone.toUpperCase()))
        (user.zone.split('Z')[1]?.toUpperCase() === queryuserZone?.toUpperCase())
    );

    // Live search by Zone
    const [queryuserSubZone, setQueryuserSubZone] = useState('');

    // Function to handle changes in the search query for Zone
    const handleInputChange_UserSubZone = (e) => {
        setQueryuserSubZone(e.target.value);

    };
    // Filter the array based on the search query for Zone
    const filteredDataUserSubZone = dataByZone?.filter(user =>
        // (user.zone.split('Z')[1].toUpperCase().includes(queryuserZone.toUpperCase()))
        ((user.zone.split('Z')[1]?.toUpperCase() === queryuserZone?.toUpperCase()) && user.subzone?.toUpperCase() === queryuserSubZone?.toUpperCase())
    );




    // Live search by user Below attendance
    const [belowAttendance, setbelowAttendance] = useState('');

    // Function to handle changes in the search query for User Below attendance
    const handleInputChange_BelowAttendance = (e) => {
        setbelowAttendance(e.target.value);

    };
    // Filter the array based on the search query for User Below attendance
    const filteredDataBelowAttendance = dataByZone?.filter(user =>
        (user.attendance <= belowAttendance)
    );




    // Below attendance and Zone
    const filteredDataBelowAttendance_zone = dataByZone?.filter(user =>
        (user.zone.split('Z')[1]?.toUpperCase().includes(queryuserZone.toUpperCase()) && user.attendance <= belowAttendance)
    );


    // Below attendance and Zone and SubZone
    const filteredDataBelowAttendance_zone_subzone = dataByZone?.filter(user =>
        (user.zone.split('Z')[1]?.toUpperCase().includes(queryuserZone.toUpperCase()) && user.attendance <= belowAttendance && user.subzone?.toUpperCase() === queryuserSubZone?.toUpperCase())
    );

    // Live search by zone ID
    const [startDate, setstartDate] = useState('');
    // Live search by zone ID
    const [endDate, setendDate] = useState('');



    // const generateReport = async () => {
    //     let attendanceZone = []

    //     await adminReducer.zone.map((zval1, index) => {
    //         attendanceZone.push({
    //             zonename: zval1,
    //             users: []
    //         })
    //     })

    //     // Iterate over each zone in attendanceZone
    //     await attendanceZone.map(async (val1, index) => {
    //         // Iterate over each user
    //         await adminReducer.users.map((val2, index2) => {
    //             // Check if the user's zone matches the current zone's ID
    //             if (val1.zonename.ID === val2.zone) {
    //                 // Initialize an empty array to store attendance details for this user
    //                 val2.attendanceDetails = [];
    //                 // Iterate over each attendance detail
    //                 const sortedAttendanceDetails = adminReducer.attendanceDetails.sort((a, b) => new Date(b.date) - new Date(a.date));
    //                 sortedAttendanceDetails.forEach(val3 => {
    //                     // Check if the user's ID matches the SATID in the attendance detail
    //                     if (val2._id === val3.SATID) {
    //                         // If there is a match, add the attendance detail to the user's attendanceDetails array
    //                         val2.attendanceDetails.push(val3);
    //                     }
    //                 });
    //                 // Add the user to the users array of the corresponding zone
    //                 attendanceZone[index].users.push(val2);
    //             }
    //         });
    //     });
    //     setattendanceZoneData(attendanceZone);
    // }






    const generateReport1 = async (zone) => {

        let header = []


        await adminReducer.attendance.map((value, index) => {
            // if (value.zone === zone) {
            const d = value.date.split('T')
            const t = d[1].split('.')[0]

            const [hours, minutes, seconds] = t.split(':').map(Number);

            // Create a new Date object and set the time
            const date1 = new Date();
            date1.setHours(hours);
            date1.setMinutes(minutes);
            date1.setSeconds(seconds);

            // Convert to 12-hour format with AM/PM
            const formattedTime = date1.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

            const date = `${d[0].split('-')[2]}-${d[0].split('-')[1]}-${d[0].split('-')[0]}`
            const time = formattedTime
            const obj = {
                zone: value.zone,
                date: date,
                time: time,
                originalDate: value.date
            }
            header.push(obj)
            // }
        })

        const users = []
        await adminReducer.users.map((val2, index2) => {
            // Check if the user's zone matches the current zone's ID
            // if (val2.zone === zone) {
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
            users.push(val2);
            // }
        });
        setDataByZone(users);
        // setDataByZoneHeader(header)
        const uniqueDates = [];
        const uniqueHeader = await header.filter(obj => {
            const dateStr = obj.originalDate; // Convert date to a string without time
            if (!uniqueDates.includes(dateStr)) {
                uniqueDates.push(dateStr);
                // console.log(dateStr);
                return true; // Include the object if the date is not a duplicate
            }
            return false; // Exclude the object if the date is a duplicate
        });
        setDataByZoneHeader(uniqueHeader)
    }





    // GENERATE PDF
    const generatePDF = async () => {
        // setpdfExportStatus(true)
        let doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: [842, 595]
        })

        const imageHeight = 150
        doc.setFontSize(11);
        doc.addImage(satdhamLogo, "PNG", 300, 100, 250, 233, imageHeight)
        doc.setFontSize(20);
        doc.text('Sat-Sabha member report by zones', 265, 400)
        doc.setFontSize(14)
        doc.addPage();


        let countForHeader_date = 0

        // Set header
        const header = []
        await dataByZoneHeader?.map((value, index) => {

            if (startDate !== "" && endDate !== "") {
                countForHeader_date = countForHeader_date + 1
                if (startDate <= value.originalDate && endDate >= value.originalDate) {
                    const dd = value.date.split('-')
                    const tt = value.time.split(':')
                    const tt1 = value.time.split(' ')
                    header.push(`${dd[0]}-${dd[1]} ${tt[0]}:${tt[1]}`)
                }
            } else {
                if (index < numberAtdetails) {
                    const dd = value.date.split('-')
                    const tt = value.time.split(':')
                    const tt1 = value.time.split(' ')
                    header.push(`${dd[0]}-${dd[1]} ${tt[0]}:${tt[1]}`)
                }
            }

        })

        let flattenedDataByZone = {};

        if (startDate !== "" && endDate !== "") {
            await dataByZone?.forEach((value, index) => {
                // console.log(value);
                const atdetails = []
                dataByZoneHeader?.map((header, headerIndex) => {
                    if (startDate <= header.originalDate && endDate >= header.originalDate) {
                        const matchedDetail = value.attendanceDetails?.find(detail => {
                            const detailDate = detail.date;
                            return detailDate === header.originalDate && startDate <= detailDate && endDate >= detailDate;
                        });
                        if (matchedDetail) {
                            atdetails.push(`${matchedDetail.isPresent ? "P" : "A"}`)
                        } else {
                            atdetails.push(`-`)
                        }
                    }
                })

                // Check if zone exists in flattenedDataByZone
                if (!flattenedDataByZone[value.zone]) {
                    flattenedDataByZone[value.zone] = [];
                }

                // Push flattened data for each user into the corresponding zone array
                flattenedDataByZone[value.zone].push({
                    count: flattenedDataByZone[value.zone].length + 1,
                    ID: value?.ID,
                    name: `${value?.firstname} ${value?.lastname}`,
                    zone: value?.zone || "-",
                    attendance: value?.attendance,
                    attendanceDetails: atdetails
                });
            });

        } else {
            await dataByZone?.forEach((value, index) => {
                // console.log(value);
                const atdetails = []
                dataByZoneHeader?.map((header, headerIndex) => {
                    const matchedDetail = value.attendanceDetails.find(detail => {
                        const detailDate = detail.date
                        return detailDate === header.originalDate;
                    });
                    if (headerIndex < numberAtdetails) {
                        if (matchedDetail) {
                            atdetails.push(`${matchedDetail.isPresent ? "P" : "A"}`)
                        } else {
                            atdetails.push(`-`)
                        }
                    }
                })

                // Check if zone exists in flattenedDataByZone
                if (!flattenedDataByZone[value.zone]) {
                    flattenedDataByZone[value.zone] = [];
                }

                // Push flattened data for each user into the corresponding zone array
                flattenedDataByZone[value.zone].push({
                    count: flattenedDataByZone[value.zone].length + 1,
                    ID: value?.ID,
                    name: `${value?.firstname} ${value?.lastname}`,
                    zone: value?.zone || "-",
                    subzone: value?.subzone || "-",
                    attendance: value?.attendance,
                    attendanceDetails: atdetails
                });
            });
        }



        // console.log(flattenedDataByZone);

        // flattenedDataByZone now contains an object where keys are zone names and values are arrays of flattened data for each zone
        let flattenedDataByZoneArray = [];

        await Object.entries(flattenedDataByZone).forEach(([zone, data]) => {
            flattenedDataByZoneArray.push({ zone, data });
        });

        flattenedDataByZoneArray?.sort((a, b) => {
            const zoneA = parseInt(a.zone.split('Z')[1]);
            const zoneB = parseInt(b.zone.split('Z')[1]);
            return zoneA - zoneB;
        })


        if (flattenedDataByZoneArray && flattenedDataByZoneArray.length > 0) {

            const headers = ['#', 'ID', 'Name', 'Zone', 'Subzone', 'Attendance'];
            header.forEach(headerItem => {
                headers.push(headerItem);
            });
            if (queryuserZone && belowAttendance && queryuserSubZone) {
                flattenedDataByZoneArray.map((data, indx) => {
                    if (queryuserZone === data.zone.split('Z')[1]) {
                        // IF zone wise attendance
                        doc.setFontSize(25);
                        doc.text(`Zone : ${data.zone}`, 340, 250)
                        doc.setFontSize(14)
                        if (startDate && endDate && belowAttendance) {
                            doc.text(`Start date : ${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`, 340, 500)
                            doc.text(`End date : ${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`, 340, 540)
                            doc.text(`Below attendance : ${belowAttendance}%`, 340, 580)
                        } else if (belowAttendance) {
                            doc.text(`Below attendance : ${belowAttendance}%`, 340, 500)
                        }
                        if (queryuserSubZone !== "") {
                            doc.text(`Sub-zone : ${queryuserSubZone}`, 340, 480)
                        }

                        doc.addPage();
                        doc.setFontSize(14)
                        let i = 0
                        // Ensure that the data array is not empty
                        if (data.data && data.data.length > 0) {
                            autoTable(doc, {
                                margin: { top: 30, right: 10, bottom: 10, left: 10 },
                                head: [headers],
                                body: data.data.flatMap(row => {
                                    if ((row.attendance <= belowAttendance) && (row.subzone == queryuserSubZone)) {
                                        i = i + 1
                                        return [
                                            [
                                                row.count,
                                                row.ID.split('P')[1],
                                                row.name,
                                                row.zone.split('Z')[1],
                                                row.subzone,
                                                `${row.attendance}%`,
                                                ...row.attendanceDetails.map(detail => `${detail}`)
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
            } else if (queryuserZone && belowAttendance) {
                flattenedDataByZoneArray.map((data, indx) => {
                    if (queryuserZone === data.zone.split('Z')[1]) {
                        // IF zone wise attendance
                        doc.setFontSize(25);
                        doc.text(`Zone : ${data.zone}`, 340, 250)
                        doc.setFontSize(14)
                        if (startDate && endDate && belowAttendance) {
                            doc.text(`Start date : ${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`, 340, 500)
                            doc.text(`End date : ${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`, 340, 540)
                            doc.text(`Below attendance : ${belowAttendance}%`, 340, 580)
                        } else if (belowAttendance) {
                            doc.text(`Below attendance : ${belowAttendance}%`, 340, 500)
                        }


                        doc.addPage();
                        doc.setFontSize(14)
                        let i = 0
                        // Ensure that the data array is not empty
                        if (data.data && data.data.length > 0) {
                            autoTable(doc, {
                                margin: { top: 30, right: 10, bottom: 10, left: 10 },
                                head: [headers],
                                body: data.data.flatMap(row => {
                                    if (row.attendance <= belowAttendance) {
                                        i = i + 1
                                        return [
                                            [
                                                row.count,
                                                row.ID.split('P')[1],
                                                row.name,
                                                row.zone.split('Z')[1],
                                                row.subzone,
                                                `${row.attendance}%`,
                                                ...row.attendanceDetails.map(detail => `${detail}`)
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
            }
            else if (queryuserZone && queryuserSubZone) {
                flattenedDataByZoneArray.map((data, indx) => {
                    if (queryuserZone === data.zone.split('Z')[1]) {
                        // IF zone wise attendance
                        doc.setFontSize(25);
                        doc.text(`Zone : ${data.zone}`, 340, 300)
                        doc.setFontSize(14)
                        if (startDate && endDate && belowAttendance) {
                            doc.text(`Start date : ${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`, 340, 500)
                            doc.text(`End date : ${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`, 340, 540)
                            doc.text(`Below attendance : ${belowAttendance}%`, 340, 580)
                        } else if (belowAttendance) {
                            doc.text(`Below attendance : ${belowAttendance}%`, 340, 500)
                        }
                        if (queryuserSubZone !== "") {
                            doc.text(`Sub-zone : ${queryuserSubZone}`, 340, 480)
                        }
                        doc.addPage();
                        doc.setFontSize(14)
                        let i = 0
                        // Ensure that the data array is not empty
                        if (data.data && data.data.length > 0) {
                            autoTable(doc, {
                                margin: { top: 30, right: 10, bottom: 10, left: 10 },
                                head: [headers],
                                body: data.data.flatMap(row => {
                                    if (row.subzone === queryuserSubZone) {
                                        i = i + 1
                                        return [
                                            [
                                                row.count,
                                                row.ID.split('P')[1],
                                                row.name,
                                                row.zone.split('Z')[1],
                                                row.subzone,
                                                `${row.attendance}%`,
                                                ...row.attendanceDetails.map(detail => `${detail}`)
                                            ]
                                        ];
                                    }
                                    return []; // Return an empty array if the condition is not met
                                }),
                            });
                            doc.addPage();
                        } else {
                            // console.log("Data array is empty");
                        }
                    }
                });
            }
            else if (queryuserZone) {
                flattenedDataByZoneArray.map((data, indx) => {
                    if (queryuserZone === data.zone.split('Z')[1]) {
                        // IF zone wise attendance
                        doc.setFontSize(25);
                        doc.text(`Zone : ${data.zone}`, 340, 300)
                        doc.setFontSize(14)
                        if (startDate && endDate && belowAttendance) {
                            doc.text(`Start date : ${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`, 340, 500)
                            doc.text(`End date : ${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`, 340, 540)
                            doc.text(`Below attendance : ${belowAttendance}%`, 340, 580)
                        } else if (belowAttendance) {
                            doc.text(`Below attendance : ${belowAttendance}%`, 340, 500)
                        }
                        doc.addPage();
                        doc.setFontSize(14)

                        // Ensure that the data array is not empty
                        if (data.data && data.data.length > 0) {
                            autoTable(doc, {
                                margin: { top: 30, right: 10, bottom: 10, left: 10 },
                                head: [headers],
                                body: data.data.map(row => [
                                    row.count,
                                    row.ID.split('P')[1],
                                    row.name,
                                    row.zone.split('Z')[1],
                                    row.subzone,
                                    `${row.attendance}%`,
                                    ...row.attendanceDetails.map(detail => `${detail}`)
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
                    doc.text(`Zone : ${data.zone}`, 340, 400)
                    doc.setFontSize(14)
                    if (startDate && endDate && belowAttendance) {
                        doc.text(`Start date : ${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`, 340, 500)
                        doc.text(`End date : ${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`, 340, 540)
                        doc.text(`Below attendance : ${belowAttendance}%`, 340, 580)
                    } else if (belowAttendance) {
                        doc.text(`Below attendance : ${belowAttendance}%`, 340, 500)
                    }
                    doc.addPage();
                    doc.setFontSize(14)

                    let i = 0
                    // Ensure that the data array is not empty
                    if (data.data && data.data.length > 0) {
                        autoTable(doc, {
                            margin: { top: 30, right: 10, bottom: 10, left: 10 },
                            head: [headers],
                            body: data.data.flatMap(row => {
                                if (row.attendance <= belowAttendance) {
                                    i = i + 1
                                    return [
                                        [
                                            row.count,
                                            row.ID.split('P')[1],
                                            row.name,
                                            row.zone.split('Z')[1],
                                            row.subzone,
                                            `${row.attendance}%`,
                                            ...row.attendanceDetails.map(detail => `${detail}`)
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
                    doc.text(`Zone : ${data.zone}`, 340, 400)
                    doc.setFontSize(14)
                    if (startDate && endDate && belowAttendance) {
                        doc.text(`Start date : ${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`, 340, 500)
                        doc.text(`End date : ${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`, 340, 540)
                        doc.text(`Below attendance : ${belowAttendance}%`, 340, 580)
                    } else if (belowAttendance) {
                        doc.text(`Below attendance : ${belowAttendance}%`, 340, 500)
                    }
                    doc.addPage();
                    doc.setFontSize(14)
                    let num = Number(numberAtdetails)
                    // Ensure that the data array is not empty
                    if (data.data && data.data.length > 0) {
                        autoTable(doc, {
                            margin: { top: 30, right: 10, bottom: 10, left: 10 },
                            head: [headers],
                            body: data.data.map(row => [
                                row.count,
                                row.ID.split('P')[1],
                                row.name,
                                row.zone.split('Z')[1],
                                row.subzone,
                                `${row.attendance}%`,
                                ...row.attendanceDetails.map(detail => `${detail}`)
                            ]),
                        });
                        doc.addPage();
                    } else {
                        // console.log("Data array is empty");
                    }
                });

            }

            await doc.save(`SAT-SABHA_report.pdf`)

        }

    }



    adminReducer.attendanceDetails?.sort((a, b) => (a.date > b.date ? -1 : 1))

    let atCount = 0

    let count = 0
    useEffect(() => {
        (async () => {
            // await generateReport()
            await generateReport1("SATZ4")
        })();

        return () => { };

    }, [])
    return (
        <>
            {
                dataByZone.length === 0
                    ? spinner()
                    : <>
                        <div className=''>
                            <div>
                                <button className='adminHomeEditBtn me-2 my-2' onClick={() => generatePDF()}>
                                    Export PDF <i className='bx bxs-file-pdf'></i>
                                </button>
                            </div>
                            <div className='me-3 mt-3'>
                                <small>Attendace visibility number</small>
                                <div>
                                    <input
                                        type="number"
                                        className='mt-2 mb-4'
                                        value={numberAtdetails}
                                        min={0}
                                        onChange={(e) => setnumberAtdetails(e.target.value)}
                                        placeholder="Ex:- 6"
                                    />

                                    {/* <input
                                        type="number"
                                        className='mt-2 mb-4'
                                        value={atCount}
                                        min={0}
                                        // onChange={handleChangeZone}
                                        placeholder="Ex:- 6"
                                    /> */}
                                </div>
                            </div>
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
                            <hr />
                            <br />
                            <input
                                type="number"
                                className='my-4'
                                min={0}
                                value={queryuserZone}
                                onChange={handleInputChange_UserZone}
                                placeholder="Search by Zone"
                            />
                            <span>  </span>
                            {
                                queryuserZone !== ""
                                    ? <input
                                        type="number"
                                        className='my-4'
                                        min={0}
                                        value={queryuserSubZone}
                                        onChange={handleInputChange_UserSubZone}
                                        placeholder="Search by Subzone"
                                    />
                                    : ""
                            }
                            <span> -- || -- </span>
                            <input
                                type="number"
                                className='my-4'
                                min={0}
                                value={belowAttendance}
                                onChange={handleInputChange_BelowAttendance}
                                placeholder="Below attendance"
                            />

                            <div className='my-3'>
                                <div className='me-3'>
                                    <small>Start date</small>
                                    <div>
                                        <input
                                            type="date"
                                            className='mb-4 mt-2'
                                            min={0}
                                            value={startDate}
                                            onChange={(e) => setstartDate(e.target.value)}
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
                                            onChange={(e) => setendDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
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
                                        <th>Subzone</th>
                                        <th>Attendance</th>


                                        {dataByZoneHeader?.map((value, index) => {
                                            if (startDate !== "" && endDate !== "") {
                                                atCount = atCount + 1

                                                {/* console.log(startDate < value.originalDate) */ }
                                                {/* if (index < numberAtdetails) { */ }
                                                const dd = value.date.split('-')
                                                const tt = value.time.split(':')
                                                const tt1 = value.time.split(' ')
                                                if (startDate <= value.originalDate && endDate >= value.originalDate) {
                                                    return (
                                                        <th key={index}>
                                                            <div>
                                                                {`${dd[0]}-${dd[1]}`}
                                                            </div>
                                                            <div>
                                                                {`${tt[0]}:${tt[1]} ${tt1[1]}`}
                                                            </div>
                                                        </th>
                                                    )
                                                }
                                                {/* } */ }
                                            } else {
                                                if (index < numberAtdetails) {
                                                    const dd = value.date.split('-')
                                                    const tt = value.time.split(':')
                                                    const tt1 = value.time.split(' ')
                                                    return (
                                                        <th key={index}>
                                                            <div>
                                                                {`${dd[0]}-${dd[1]}`}
                                                            </div>
                                                            <div>
                                                                {`${tt[0]}:${tt[1]} `}
                                                                {/* ${tt1[1]} */}
                                                            </div>
                                                        </th>
                                                    )
                                                }
                                            }
                                        })}
                                        {
                                            dataByZoneHeader.length === 0
                                                ? <th >
                                                    No attendance data
                                                </th>
                                                : ""
                                        }

                                        {/* Fill remaining cells with dashes */}
                                        {/* {[...Array(Math.max(numberAtdetails - dataByZoneHeader.length, 0))].map((_, ind) => (
                                            <td key={ind + numberAtdetails}>-</td>
                                        ))} */}
                                        {/* <th colSpan={numberAtdetails}>Last {numberAtdetails} Availability</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        adminReducer.users?.length === 0
                                            ? <tr>
                                                <td colSpan={13} className='text-center'>🙁 No reports data</td>
                                            </tr>
                                            :

                                            <>
                                                {
                                                    startDate !== "" && endDate !== "" && queryuserZone !== "" && belowAttendance !== "" && queryuserSubZone !== ""
                                                        ? filteredDataBelowAttendance_zone_subzone?.map((d, index) => {
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
                                                                    <td>
                                                                        {
                                                                            d.profilePhotoStatus === false
                                                                                ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                        }
                                                                        &nbsp;{d?.firstname} {d?.lastname}
                                                                    </td>
                                                                    <td>{d?.mobile}</td>
                                                                    <td>{d?.gender}</td>
                                                                    <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                    <td>{d?.subzone || "-"}</td>
                                                                    <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>
                                                                    {dataByZoneHeader.map((header, headerIndex) => {
                                                                        if (startDate <= header.originalDate && endDate >= header.originalDate) {
                                                                            {/* if (headerIndex > 0 && headerIndex < atCount - 1) { // Check if it's not the first column */ }
                                                                            const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                const detailDate = detail.date;
                                                                                return detailDate === header.originalDate && startDate <= detailDate && endDate >= detailDate;
                                                                            });
                                                                            if (matchedDetail) {
                                                                                return (
                                                                                    <td key={headerIndex}>
                                                                                        <small>
                                                                                            <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                {matchedDetail.isPresent ? "P" : "A"}
                                                                                            </span>
                                                                                        </small>
                                                                                    </td>
                                                                                );
                                                                            } else {
                                                                                return <td key={headerIndex}>-</td>; // Render empty td if matchedDetail is not found
                                                                            }
                                                                        }
                                                                        {/* } */ }
                                                                        {/* return null; */ }
                                                                    })}
                                                                </tr>
                                                            )
                                                        })
                                                        : startDate !== "" && endDate !== "" && queryuserZone !== "" && belowAttendance !== ""
                                                            ? filteredDataBelowAttendance_zone?.map((d, index) => {
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
                                                                        <td>
                                                                            {
                                                                                d.profilePhotoStatus === false
                                                                                    ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                    : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                            }
                                                                            &nbsp;{d?.firstname} {d?.lastname}
                                                                        </td>
                                                                        <td>{d?.mobile}</td>
                                                                        <td>{d?.gender}</td>
                                                                        <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                        <td>{d?.subzone || "-"}</td>
                                                                        <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>
                                                                        {dataByZoneHeader.map((header, headerIndex) => {
                                                                            if (startDate <= header.originalDate && endDate >= header.originalDate) {
                                                                                {/* if (headerIndex > 0 && headerIndex < atCount - 1) { // Check if it's not the first column */ }
                                                                                const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                    const detailDate = detail.date;
                                                                                    return detailDate === header.originalDate && startDate <= detailDate && endDate >= detailDate;
                                                                                });
                                                                                if (matchedDetail) {
                                                                                    return (
                                                                                        <td key={headerIndex}>
                                                                                            <small>
                                                                                                <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                    {matchedDetail.isPresent ? "P" : "A"}
                                                                                                </span>
                                                                                            </small>
                                                                                        </td>
                                                                                    );
                                                                                } else {
                                                                                    return <td key={headerIndex}>-</td>; // Render empty td if matchedDetail is not found
                                                                                }
                                                                            }
                                                                            {/* } */ }
                                                                            {/* return null; */ }
                                                                        })}
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            startDate !== "" && endDate !== "" && queryuserZone !== "" && queryuserSubZone !== ""
                                                                ? filteredDataUserSubZone?.map((d, index) => {
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
                                                                            <td>
                                                                                {
                                                                                    d.profilePhotoStatus === false
                                                                                        ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                        : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                }
                                                                                &nbsp;{d?.firstname} {d?.lastname}
                                                                            </td>
                                                                            <td>{d?.mobile}</td>
                                                                            <td>{d?.gender}</td>
                                                                            <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                            <td>{d?.subzone || "-"}</td>
                                                                            <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>
                                                                            {dataByZoneHeader.map((header, headerIndex) => {
                                                                                if (startDate <= header.originalDate && endDate >= header.originalDate) {
                                                                                    {/* if (headerIndex > 0 && headerIndex < atCount - 1) { // Check if it's not the first column */ }
                                                                                    const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                        const detailDate = detail.date;
                                                                                        return detailDate === header.originalDate && startDate <= detailDate && endDate >= detailDate;
                                                                                    });
                                                                                    if (matchedDetail) {
                                                                                        return (
                                                                                            <td key={headerIndex}>
                                                                                                <small>
                                                                                                    <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                        {matchedDetail.isPresent ? "P" : "A"}
                                                                                                    </span>
                                                                                                </small>
                                                                                            </td>
                                                                                        );
                                                                                    } else {
                                                                                        return <td key={headerIndex}>-</td>; // Render empty td if matchedDetail is not found
                                                                                    }
                                                                                }
                                                                                {/* } */ }
                                                                                {/* return null; */ }
                                                                            })}
                                                                        </tr>
                                                                    )
                                                                })
                                                                : startDate !== "" && endDate !== "" && queryuserZone !== ""
                                                                    ? filteredDataUserZone?.map((d, index) => {
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
                                                                                <td>
                                                                                    {
                                                                                        d.profilePhotoStatus === false
                                                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                            : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                    }
                                                                                    &nbsp;{d?.firstname} {d?.lastname}
                                                                                </td>
                                                                                <td>{d?.mobile}</td>
                                                                                <td>{d?.gender}</td>
                                                                                <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                                <td>{d?.subzone || "-"}</td>
                                                                                <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>
                                                                                {dataByZoneHeader.map((header, headerIndex) => {
                                                                                    if (startDate <= header.originalDate && endDate >= header.originalDate) {
                                                                                        {/* if (headerIndex > 0 && headerIndex < atCount - 1) { // Check if it's not the first column */ }
                                                                                        const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                            const detailDate = detail.date;
                                                                                            return detailDate === header.originalDate && startDate <= detailDate && endDate >= detailDate;
                                                                                        });
                                                                                        if (matchedDetail) {
                                                                                            return (
                                                                                                <td key={headerIndex}>
                                                                                                    <small>
                                                                                                        <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                            {matchedDetail.isPresent ? "P" : "A"}
                                                                                                        </span>
                                                                                                    </small>
                                                                                                </td>
                                                                                            );
                                                                                        } else {
                                                                                            return <td key={headerIndex}>-</td>; // Render empty td if matchedDetail is not found
                                                                                        }
                                                                                    }
                                                                                    {/* } */ }
                                                                                    {/* return null; */ }
                                                                                })}
                                                                            </tr>
                                                                        )
                                                                    })
                                                                    : startDate !== "" && endDate !== ""
                                                                        ? dataByZone?.map((d, index) => {
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
                                                                                    <td>
                                                                                        {
                                                                                            d.profilePhotoStatus === false
                                                                                                ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                        }
                                                                                        &nbsp;{d?.firstname} {d?.lastname}
                                                                                    </td>
                                                                                    <td>{d?.mobile}</td>
                                                                                    <td>{d?.gender}</td>
                                                                                    <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                                    <td>{d?.subzone || "-"}</td>
                                                                                    <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>

                                                                                    {dataByZoneHeader.map((header, headerIndex) => {
                                                                                        if (startDate <= header.originalDate && endDate >= header.originalDate) {
                                                                                            {/* if (headerIndex > 0 && headerIndex < atCount - 1) { // Check if it's not the first column */ }
                                                                                            const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                                const detailDate = detail.date;
                                                                                                return detailDate === header.originalDate && startDate <= detailDate && endDate >= detailDate;
                                                                                            });
                                                                                            if (matchedDetail) {
                                                                                                return (
                                                                                                    <td key={headerIndex}>
                                                                                                        <small>
                                                                                                            <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                                {matchedDetail.isPresent ? "P" : "A"}
                                                                                                            </span>
                                                                                                        </small>
                                                                                                    </td>
                                                                                                );
                                                                                            } else {
                                                                                                return <td key={headerIndex}>-</td>; // Render empty td if matchedDetail is not found
                                                                                            }
                                                                                        }
                                                                                        {/* } */ }
                                                                                        {/* return null; */ }
                                                                                    })}
                                                                                </tr>
                                                                            )
                                                                        })
                                                                        :
                                                                        belowAttendance !== "" && queryuserZone !== "" && queryuserSubZone !== "" ? (
                                                                            // If there is a search query, display filtered results
                                                                            filteredDataBelowAttendance_zone_subzone.map((d, index) => {
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
                                                                                        <td>
                                                                                            {
                                                                                                d.profilePhotoStatus === false
                                                                                                    ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                    : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                            }
                                                                                            &nbsp;{d?.firstname} {d?.lastname}
                                                                                        </td>
                                                                                        <td>{d?.mobile}</td>
                                                                                        <td>{d?.gender}</td>
                                                                                        <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                                        <td>{d?.subzone || "-"}</td>
                                                                                        <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>


                                                                                        {
                                                                                            dataByZoneHeader.length == 0
                                                                                                ? <td>-</td>
                                                                                                : dataByZoneHeader?.map((header, headerIndex) => {
                                                                                                    const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                                        const detailDate = detail.date
                                                                                                        return detailDate === header.originalDate;
                                                                                                    });
                                                                                                    if (headerIndex < numberAtdetails) {
                                                                                                        return (
                                                                                                            <td key={headerIndex}>
                                                                                                                {matchedDetail ? (
                                                                                                                    <small>
                                                                                                                        <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                                            {matchedDetail.isPresent ? "P" : "A"}
                                                                                                                        </span>
                                                                                                                    </small>
                                                                                                                ) : (
                                                                                                                    "-"
                                                                                                                )}
                                                                                                            </td>
                                                                                                        );
                                                                                                    }
                                                                                                    return null
                                                                                                })}
                                                                                        {/* Fill remaining cells with dashes */}
                                                                                        {/* {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                    <td key={ind2 - numberAtdetails}>-</td>
                                                                                ))} */}
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        )
                                                                            : belowAttendance !== "" && queryuserZone !== "" ? (
                                                                                // If there is a search query, display filtered results
                                                                                filteredDataBelowAttendance_zone.map((d, index) => {
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
                                                                                            <td>
                                                                                                {
                                                                                                    d.profilePhotoStatus === false
                                                                                                        ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                        : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                }
                                                                                                &nbsp;{d?.firstname} {d?.lastname}
                                                                                            </td>
                                                                                            <td>{d?.mobile}</td>
                                                                                            <td>{d?.gender}</td>
                                                                                            <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                                            <td>{d?.subzone || "-"}</td>
                                                                                            <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>


                                                                                            {
                                                                                                dataByZoneHeader.length == 0
                                                                                                    ? <td>-</td>
                                                                                                    : dataByZoneHeader?.map((header, headerIndex) => {
                                                                                                        const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                                            const detailDate = detail.date
                                                                                                            return detailDate === header.originalDate;
                                                                                                        });
                                                                                                        if (headerIndex < numberAtdetails) {
                                                                                                            return (
                                                                                                                <td key={headerIndex}>
                                                                                                                    {matchedDetail ? (
                                                                                                                        <small>
                                                                                                                            <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                                                {matchedDetail.isPresent ? "P" : "A"}
                                                                                                                            </span>
                                                                                                                        </small>
                                                                                                                    ) : (
                                                                                                                        "-"
                                                                                                                    )}
                                                                                                                </td>
                                                                                                            );
                                                                                                        }
                                                                                                        return null
                                                                                                    })}
                                                                                            {/* Fill remaining cells with dashes */}
                                                                                            {/* {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                    <td key={ind2 - numberAtdetails}>-</td>
                                                                                ))} */}
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                            ) :
                                                                                queryuserZone !== "" && queryuserSubZone !== "" ? (
                                                                                    // If there is a search query, display filtered results
                                                                                    filteredDataUserSubZone.map((d, index) => {
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
                                                                                                <td>
                                                                                                    {
                                                                                                        d.profilePhotoStatus === false
                                                                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                            : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                    }
                                                                                                    &nbsp;{d?.firstname} {d?.lastname}
                                                                                                </td>
                                                                                                <td>{d?.mobile}</td>
                                                                                                <td>{d?.gender}</td>
                                                                                                <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                                                <td>{d?.subzone || "-"}</td>
                                                                                                <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>


                                                                                                {
                                                                                                    dataByZoneHeader.length == 0
                                                                                                        ? <td>-</td>
                                                                                                        : dataByZoneHeader?.map((header, headerIndex) => {
                                                                                                            const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                                                const detailDate = detail.date
                                                                                                                return detailDate === header.originalDate;
                                                                                                            });
                                                                                                            if (headerIndex < numberAtdetails) {
                                                                                                                return (
                                                                                                                    <td key={headerIndex}>
                                                                                                                        {matchedDetail ? (
                                                                                                                            <small>
                                                                                                                                <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                                                    {matchedDetail.isPresent ? "P" : "A"}
                                                                                                                                </span>
                                                                                                                            </small>
                                                                                                                        ) : (
                                                                                                                            "-"
                                                                                                                        )}
                                                                                                                    </td>
                                                                                                                );
                                                                                                            }
                                                                                                            return null
                                                                                                        })}
                                                                                                {/* Fill remaining cells with dashes */}
                                                                                                {/* {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                    <td key={ind2 - numberAtdetails}>-</td>
                                                                                ))} */}
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                ) : query ? (
                                                                                    // If there is a search query, display filtered results
                                                                                    filteredData.map((d, index) => {
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
                                                                                                <td>
                                                                                                    {
                                                                                                        d.profilePhotoStatus === false
                                                                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                            : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                    }
                                                                                                    &nbsp;{d?.firstname} {d?.lastname}
                                                                                                </td>
                                                                                                <td>{d?.mobile}</td>
                                                                                                <td>{d?.gender}</td>
                                                                                                <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                                                <td>{d?.subzone || "-"}</td>
                                                                                                <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>


                                                                                                {
                                                                                                    dataByZoneHeader.length == 0
                                                                                                        ? <td>-</td>
                                                                                                        : dataByZoneHeader?.map((header, headerIndex) => {
                                                                                                            const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                                                const detailDate = detail.date
                                                                                                                return detailDate === header.originalDate;
                                                                                                            });
                                                                                                            if (headerIndex < numberAtdetails) {
                                                                                                                return (
                                                                                                                    <td key={headerIndex}>
                                                                                                                        {matchedDetail ? (
                                                                                                                            <small>
                                                                                                                                <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                                                    {matchedDetail.isPresent ? "P" : "A"}
                                                                                                                                </span>
                                                                                                                            </small>
                                                                                                                        ) : (
                                                                                                                            "-"
                                                                                                                        )}
                                                                                                                    </td>
                                                                                                                );
                                                                                                            }
                                                                                                            return null
                                                                                                        })}
                                                                                                {/* Fill remaining cells with dashes */}
                                                                                                {/* {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                    <td key={ind2 - numberAtdetails}>-</td>
                                                                                ))} */}
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                ) : queryuserID !== "" ? (
                                                                                    // If there is a search query, display filtered results
                                                                                    filteredDataUserID.map((d, index) => {
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
                                                                                                <td>
                                                                                                    {
                                                                                                        d.profilePhotoStatus === false
                                                                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                            : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                    }
                                                                                                    &nbsp;{d?.firstname} {d?.lastname}
                                                                                                </td>
                                                                                                <td>{d?.mobile}</td>
                                                                                                <td>{d?.gender}</td>
                                                                                                <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                                                <td>{d?.subzone || "-"}</td>
                                                                                                <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>


                                                                                                {
                                                                                                    dataByZoneHeader.length == 0
                                                                                                        ? <td>-</td>
                                                                                                        : dataByZoneHeader?.map((header, headerIndex) => {
                                                                                                            const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                                                const detailDate = detail.date
                                                                                                                return detailDate === header.originalDate;
                                                                                                            });
                                                                                                            if (headerIndex < numberAtdetails) {
                                                                                                                return (
                                                                                                                    <td key={headerIndex}>
                                                                                                                        {matchedDetail ? (
                                                                                                                            <small>
                                                                                                                                <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                                                    {matchedDetail.isPresent ? "P" : "A"}
                                                                                                                                </span>
                                                                                                                            </small>
                                                                                                                        ) : (
                                                                                                                            "-"
                                                                                                                        )}
                                                                                                                    </td>
                                                                                                                );
                                                                                                            }
                                                                                                            return null
                                                                                                        })}
                                                                                                {/* Fill remaining cells with dashes */}
                                                                                                {/* {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                    <td key={ind2 - numberAtdetails}>-</td>
                                                                                ))} */}
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                ) : queryuserMobile !== "" ? (
                                                                                    // If there is a search query, display filtered results
                                                                                    filteredDataUserMobile.map((d, index) => {
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
                                                                                                <td>
                                                                                                    {
                                                                                                        d.profilePhotoStatus === false
                                                                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                            : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                    }
                                                                                                    &nbsp;{d?.firstname} {d?.lastname}
                                                                                                </td>
                                                                                                <td>{d?.mobile}</td>
                                                                                                <td>{d?.gender}</td>
                                                                                                <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                                                <td>{d?.subzone || "-"}</td>
                                                                                                <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>


                                                                                                {
                                                                                                    dataByZoneHeader.length == 0
                                                                                                        ? <td>-</td>
                                                                                                        : dataByZoneHeader?.map((header, headerIndex) => {
                                                                                                            const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                                                const detailDate = detail.date
                                                                                                                return detailDate === header.originalDate;
                                                                                                            });
                                                                                                            if (headerIndex < numberAtdetails) {
                                                                                                                return (
                                                                                                                    <td key={headerIndex}>
                                                                                                                        {matchedDetail ? (
                                                                                                                            <small>
                                                                                                                                <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                                                    {matchedDetail.isPresent ? "P" : "A"}
                                                                                                                                </span>
                                                                                                                            </small>
                                                                                                                        ) : (
                                                                                                                            "-"
                                                                                                                        )}
                                                                                                                    </td>
                                                                                                                );
                                                                                                            }
                                                                                                            return null
                                                                                                        })}
                                                                                                {/* Fill remaining cells with dashes */}
                                                                                                {/* {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                    <td key={ind2 - numberAtdetails}>-</td>
                                                                                ))} */}
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                ) : queryuserZone !== "" ? (
                                                                                    // If there is a search query, display filtered results
                                                                                    filteredDataUserZone.map((d, index) => {
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
                                                                                                <td>
                                                                                                    {
                                                                                                        d.profilePhotoStatus === false
                                                                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                            : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                    }
                                                                                                    &nbsp;{d?.firstname} {d?.lastname}
                                                                                                </td>
                                                                                                <td>{d?.mobile}</td>
                                                                                                <td>{d?.gender}</td>
                                                                                                <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                                                <td>{d?.subzone || "-"}</td>
                                                                                                <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>


                                                                                                {
                                                                                                    dataByZoneHeader.length == 0
                                                                                                        ? <td>-</td>
                                                                                                        : dataByZoneHeader?.map((header, headerIndex) => {
                                                                                                            const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                                                const detailDate = detail.date
                                                                                                                return detailDate === header.originalDate;
                                                                                                            });
                                                                                                            if (headerIndex < numberAtdetails) {
                                                                                                                return (
                                                                                                                    <td key={headerIndex}>
                                                                                                                        {matchedDetail ? (
                                                                                                                            <small>
                                                                                                                                <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                                                    {matchedDetail.isPresent ? "P" : "A"}
                                                                                                                                </span>
                                                                                                                            </small>
                                                                                                                        ) : (
                                                                                                                            "-"
                                                                                                                        )}
                                                                                                                    </td>
                                                                                                                );
                                                                                                            }
                                                                                                            return null
                                                                                                        })}
                                                                                                {/* Fill remaining cells with dashes */}
                                                                                                {/* {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                    <td key={ind2 - numberAtdetails}>-</td>
                                                                                ))} */}
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                ) : belowAttendance !== "" ? (
                                                                                    // If there is a search query, display filtered results
                                                                                    filteredDataBelowAttendance.map((d, index) => {
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
                                                                                                <td>
                                                                                                    {
                                                                                                        d.profilePhotoStatus === false
                                                                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                            : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                    }
                                                                                                    &nbsp;{d?.firstname} {d?.lastname}
                                                                                                </td>
                                                                                                <td>{d?.mobile}</td>
                                                                                                <td>{d?.gender}</td>
                                                                                                <td>{d?.zone?.split('Z')[1] || "-"}</td>
                                                                                                <td>{d?.subzone || "-"}</td>
                                                                                                <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>


                                                                                                {
                                                                                                    dataByZoneHeader.length == 0
                                                                                                        ? <td>-</td>
                                                                                                        : dataByZoneHeader?.map((header, headerIndex) => {
                                                                                                            const matchedDetail = d.attendanceDetails?.find(detail => {
                                                                                                                const detailDate = detail.date
                                                                                                                return detailDate === header.originalDate;
                                                                                                            });
                                                                                                            if (headerIndex < numberAtdetails) {
                                                                                                                return (
                                                                                                                    <td key={headerIndex}>
                                                                                                                        {matchedDetail ? (
                                                                                                                            <small>
                                                                                                                                <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                                                    {matchedDetail.isPresent ? "P" : "A"}
                                                                                                                                </span>
                                                                                                                            </small>
                                                                                                                        ) : (
                                                                                                                            "-"
                                                                                                                        )}
                                                                                                                    </td>
                                                                                                                );
                                                                                                            }
                                                                                                            return null
                                                                                                        })}
                                                                                                {/* Fill remaining cells with dashes */}
                                                                                                {/* {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                    <td key={ind2 - numberAtdetails}>-</td>
                                                                                ))} */}
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                ) : (
                                                                                    // If there is no search query, display the full list

                                                                                    dataByZone?.map((d, index) => {
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
                                                                                                <td>
                                                                                                    {
                                                                                                        d.profilePhotoStatus === false
                                                                                                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                            : <img src={`https://dzhov20ss4n5i.cloudfront.net/${d?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                                                                                                    }
                                                                                                    &nbsp;{d?.firstname} {d?.lastname}
                                                                                                </td>
                                                                                                <td>{d?.mobile}</td>
                                                                                                <td>{d?.gender}</td>
                                                                                                <td>{d?.zone.split('Z')[1] || "-"}</td>
                                                                                                <td>{d?.subzone || "-"}</td>
                                                                                                <td style={{ fontWeight: '600' }}><span className={`${d?.attendance >= 75 ? "text-success" : d?.attendance < 75 && d?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>{d?.attendance}%</span></td>


                                                                                                {
                                                                                                    dataByZoneHeader.length == 0
                                                                                                        ? <td>-</td>
                                                                                                        : dataByZoneHeader?.map((header, headerIndex) => {
                                                                                                            const matchedDetail = d.attendanceDetails.find(detail => {
                                                                                                                const detailDate = detail.date
                                                                                                                return detailDate === header.originalDate;
                                                                                                            });
                                                                                                            if (headerIndex < numberAtdetails) {
                                                                                                                return (
                                                                                                                    <td key={headerIndex}>
                                                                                                                        {matchedDetail ? (
                                                                                                                            <small>
                                                                                                                                <span style={{ fontSize: '18px' }} className={`${matchedDetail.isPresent ? '' : 'text-danger fw-blod'}`}>
                                                                                                                                    {matchedDetail.isPresent ? "P" : "A"}
                                                                                                                                </span>
                                                                                                                            </small>
                                                                                                                        ) : (
                                                                                                                            "-"
                                                                                                                        )}
                                                                                                                    </td>
                                                                                                                );
                                                                                                            }
                                                                                                            return null
                                                                                                        })}
                                                                                                {/* Fill remaining cells with dashes */}
                                                                                                {/* {[...Array(Math.max(numberAtdetails - d.attendanceDetails.length, 0))].map((_, ind2) => (
                                                                                    <td key={ind2 - numberAtdetails}>-</td>
                                                                                ))} */}
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
            }


        </>
    )
}

export default AttendanceZone




// ========================================= Old code of PDF ==========================================



// let flattenedDataByZone = {};

// // Iterate over each element in attendanceZoneData
// if (startDate !== "" && endDate !== "") {
//     await attendanceZoneData?.forEach((value, index) => {
//         value.users.forEach((d, ind) => {
//             let attendanceDetails = d.attendanceDetails.slice(0, numberAtdetails).map(d2 => {
//                 if (d2 && d2.date && startDate && endDate) {
//                     const dateParts = d2.date.split('T')[0].split('-');
//                     if (d2.date >= startDate && d2.date <= endDate) {
//                         return {
//                             date: `${dateParts[2]}-${dateParts[1]}`,
//                             status: d2.isPresent ? 'P' : 'A'
//                         };
//                     }
//                 }
//             }).filter(Boolean); // Filter out undefined values

//             // Fill remaining cells with dashes if less than 6
//             while (attendanceDetails.length < numberAtdetails) {
//                 attendanceDetails.push({ date: '-', status: '-' });
//             }

//             // Check if zone exists in flattenedDataByZone
//             if (!flattenedDataByZone[d.zone]) {
//                 flattenedDataByZone[d.zone] = [];
//             }
//             // Push flattened data for each user into the corresponding zone array
//             flattenedDataByZone[d.zone].push({
//                 count: flattenedDataByZone[d.zone].length + 1,
//                 ID: d?.ID,
//                 name: `${d?.firstname} ${d?.lastname}`,
//                 zone: d?.zone || "-",
//                 attendance: d?.attendance,
//                 attendanceDetails: attendanceDetails
//             });
//         });
//     });
// } else {
//     await attendanceZoneData?.forEach((value, index) => {
//         value.users.forEach((d, ind) => {
//             let attendanceDetails = d.attendanceDetails.slice(0, numberAtdetails).map(d2 => ({
//                 date: `${d2?.date.split('T')[0].split('-')[2]}-${d2?.date.split('T')[0].split('-')[1]}`,
//                 status: d2?.isPresent ? 'P' : 'A'
//             }));

//             // Fill remaining cells with dashes if less than 6
//             while (attendanceDetails.length < numberAtdetails) {
//                 attendanceDetails.push({ date: '-', status: '-' });
//             }

//             // Check if zone exists in flattenedDataByZone
//             if (!flattenedDataByZone[d.zone]) {
//                 flattenedDataByZone[d.zone] = [];
//             }
//             // Push flattened data for each user into the corresponding zone array
//             flattenedDataByZone[d.zone].push({
//                 count: flattenedDataByZone[d.zone].length + 1,
//                 ID: d?.ID,
//                 name: `${d?.firstname} ${d?.lastname}`,
//                 zone: d?.zone || "-",
//                 attendance: d?.attendance,
//                 attendanceDetails: attendanceDetails
//                 // at0: `${attendanceDetails[0].date} : ${attendanceDetails[0].status}`,
//                 // at1: `${attendanceDetails[1].date} : ${attendanceDetails[1].status}`,
//                 // at2: `${attendanceDetails[2].date} : ${attendanceDetails[2].status}`,
//                 // at3: `${attendanceDetails[3].date} : ${attendanceDetails[3].status}`,
//                 // at4: `${attendanceDetails[4].date} : ${attendanceDetails[4].status}`,
//                 // at5: `${attendanceDetails[5].date} : ${attendanceDetails[5].status}`,
//             });
//         });
//     });
// }








// // flattenedDataByZone now contains an object where keys are zone names and values are arrays of flattened data for each zone
// let flattenedDataByZoneArray = [];

// await Object.entries(flattenedDataByZone).forEach(([zone, data]) => {
//     flattenedDataByZoneArray.push({ zone, data });
// });

// if (flattenedDataByZoneArray && flattenedDataByZoneArray.length > 0) {
//     if (queryuserZone && belowAttendance) {
//         flattenedDataByZoneArray.map((data, indx) => {
//             if (queryuserZone === data.zone.split('Z')[1].toUpperCase()) {
//                 // IF zone wise attendance
//                 doc.setFontSize(25);
//                 doc.text(`Zone : ${data.zone}`, 225, 400)
//                 doc.setFontSize(14)
//                 if (startDate && endDate && belowAttendance) {
//                     doc.text(`Start date : ${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`, 230, 500)
//                     doc.text(`End date : ${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`, 230, 540)
//                     doc.text(`Below attendance : ${belowAttendance}%`, 230, 580)
//                 } else if (belowAttendance) {
//                     doc.text(`Below attendance : ${belowAttendance}%`, 230, 500)
//                 }

//                 doc.addPage();
//                 doc.setFontSize(14)
//                 let i = 0
//                 // Ensure that the data array is not empty
//                 if (data.data && data.data.length > 0) {
//                     autoTable(doc, {
//                         margin: { top: 30, right: 10, bottom: 10, left: 10 },
//                         head: [['#', 'ID', 'Name', 'Zone', 'Attendance', { content: 'Recent 6 attendace details', colSpan: 6 }]],
//                         body: data.data.flatMap(row => {
//                             if (row.attendance < belowAttendance) {
//                                 i = i + 1
//                                 return [
//                                     [
//                                         i,
//                                         row.ID,
//                                         row.name,
//                                         row.zone.split('Z')[1],
//                                         `${row.attendance}%`,
//                                         ...row.attendanceDetails.map(detail => `${detail.date} : ${detail.status}`)
//                                     ]
//                                 ];
//                             }
//                             return []; // Return an empty array if the condition is not met
//                         }),
//                     });
//                     doc.addPage();
//                 }
//             }
//         });
//     } else if (queryuserZone) {
//         flattenedDataByZoneArray.map((data, indx) => {
//             if (queryuserZone === data.zone.split('Z')[1].toUpperCase()) {
//                 // IF zone wise attendance
//                 doc.setFontSize(25);
//                 doc.text(`Zone : ${data.zone}`, 225, 400)
//                 doc.setFontSize(14)
//                 if (startDate && endDate && belowAttendance) {
//                     doc.text(`Start date : ${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`, 230, 500)
//                     doc.text(`End date : ${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`, 230, 540)
//                     doc.text(`Below attendance : ${belowAttendance}%`, 230, 580)
//                 } else if (belowAttendance) {
//                     doc.text(`Below attendance : ${belowAttendance}%`, 230, 500)
//                 }
//                 doc.addPage();
//                 doc.setFontSize(14)

//                 // Ensure that the data array is not empty
//                 if (data.data && data.data.length > 0) {
//                     autoTable(doc, {
//                         margin: { top: 30, right: 10, bottom: 10, left: 10 },
//                         head: [['#', 'ID', 'Name', 'Zone', 'Attendance', { content: 'Recent 6 attendace details', colSpan: 6 }]],
//                         body: data.data.map(row => [
//                             row.count,
//                             row.ID,
//                             row.name,
//                             row.zone.split('Z')[1],
//                             `${row.attendance}%`,
//                             ...row.attendanceDetails.map(detail => `${detail.date} : ${detail.status}`)
//                         ]),
//                     });
//                     doc.addPage();
//                 } else {
//                     // console.log("Data array is empty");
//                 }
//             }
//         });
//     } else if (belowAttendance) {
//         flattenedDataByZoneArray.map((data, indx) => {
//             // IF zone wise attendance
//             doc.setFontSize(25);
//             doc.text(`Zone : ${data.zone}`, 225, 400)
//             doc.setFontSize(14)
//             if (startDate && endDate && belowAttendance) {
//                 doc.text(`Start date : ${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`, 230, 500)
//                 doc.text(`End date : ${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`, 230, 540)
//                 doc.text(`Below attendance : ${belowAttendance}%`, 230, 580)
//             } else if (belowAttendance) {
//                 doc.text(`Below attendance : ${belowAttendance}%`, 230, 500)
//             }
//             doc.addPage();
//             doc.setFontSize(14)

//             let i = 0
//             // Ensure that the data array is not empty
//             if (data.data && data.data.length > 0) {
//                 autoTable(doc, {
//                     margin: { top: 30, right: 10, bottom: 10, left: 10 },
//                     head: [['#', 'ID', 'Name', 'Zone', 'Attendance', { content: 'Recent 6 attendace details', colSpan: 6 }]],
//                     body: data.data.flatMap(row => {
//                         if (row.attendance < belowAttendance) {
//                             i = i + 1
//                             return [
//                                 [
//                                     i,
//                                     row.ID,
//                                     row.name,
//                                     row.zone.split('Z')[1],
//                                     `${row.attendance}%`,
//                                     ...row.attendanceDetails.map(detail => `${detail.date} : ${detail.status}`)
//                                 ]
//                             ];
//                         }
//                         return []; // Return an empty array if the condition is not met
//                     }),
//                 });
//                 doc.addPage();
//             }
//         });
//     } else {
//         flattenedDataByZoneArray.map((data, indx) => {
//             doc.setFontSize(25);
//             doc.text(`Zone : ${data.zone}`, 225, 400)
//             doc.setFontSize(14)
//             if (startDate && endDate && belowAttendance) {
//                 doc.text(`Start date : ${startDate.split('-')[2]}-${startDate.split('-')[1]}-${startDate.split('-')[0]}`, 230, 500)
//                 doc.text(`End date : ${endDate.split('-')[2]}-${endDate.split('-')[1]}-${endDate.split('-')[0]}`, 230, 540)
//                 doc.text(`Below attendance : ${belowAttendance}%`, 230, 580)
//             } else if (belowAttendance) {
//                 doc.text(`Below attendance : ${belowAttendance}%`, 230, 500)
//             }
//             doc.addPage();
//             doc.setFontSize(14)
//             let num = Number(numberAtdetails)
//             // Ensure that the data array is not empty
//             if (data.data && data.data.length > 0) {
//                 autoTable(doc, {
//                     margin: { top: 30, right: 10, bottom: 10, left: 10 },
//                     head: [['#', 'ID', 'Name', 'Zone', 'Attendance', { content: `Recent ${num} attendace details`, colSpan: num }]],
//                     body: data.data.map(row => [
//                         row.count,
//                         row.ID,
//                         row.name,
//                         row.zone.split('Z')[1],
//                         `${row.attendance}%`,
//                         ...row.attendanceDetails.map(detail => `${detail.date} : ${detail.status}`)
//                     ]),
//                 });
//                 doc.addPage();
//             } else {
//                 // console.log("Data array is empty");
//             }
//         });
//     }

//     await doc.save(`SAT-SABHA_report.pdf`)
// }


// Name of PDF

// setpdfExportStatus(false)








// ====================================== OLD code of Table header ======================================


{/* {
                                            atAvArr.map((value, index) => {
                                                return (
                                                    <th>{value.date}</th>
                                                )
                                            })
                                        } */}
{/* {uniqueDates.map((date, index) => (
                                            <th key={index}>{new Date(date).toLocaleDateString()}</th>
                                        ))} */}
{/* {
                                            dataByZoneHeader?.map((value, index) => {
                                                const dd = value.date.split('-')
                                                const tt = value.time.split(':')
                                                const tt1 = value.time.split(' ')
                                                return (
                                                    <th key={index}>
                                                        <div>
                                                            {`${dd[0]}-${dd[1]}`}
                                                        </div>
                                                        <div>
                                                            {`${tt[0]}:${tt[1]} ${tt1[1]}`}
                                                        </div>
                                                    </th>
                                                )
                                            })
                                        } */}