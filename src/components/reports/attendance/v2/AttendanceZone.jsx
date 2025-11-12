import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import satdhamLogo from '../../../assets/satdham_logo.jpeg';
import { Link } from 'react-router-dom';
import userImg from '../../../assets/user.png'

const AttendanceZone = () => {
    const adminReducer = useSelector((state) => state.adminReducer);
    const [attendanceData, setAttendanceData] = useState([]);
    const [dataByZoneHeader, setDataByZoneHeader] = useState([]);
    const [numberAtdetails, setNumberAtdetails] = useState(6);
    const [filters, setFilters] = useState({
        query: '',
        userID: '',
        userMobile: '',
        zone: '',
        subZone: '',
        belowAttendance: '',
        aboveAttendance: '',
        startDate: '',
        endDate: '',
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const formatTime = (hours, minutes) => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${period}`;
    };

    const prepareAttendanceData = () => {
        const headers = adminReducer.attendance.map((value) => {
            const [datePart, timePart] = value.date.split('T');
            const [hours, minutes] = timePart.split(':');
            const formattedDate = `${datePart.split('-')[2]}-${datePart.split('-')[1]}-${datePart.split('-')[0]}`;
            // const formattedTime = `${hours}:${minutes}`;
            const formattedTime = formatTime(parseInt(hours, 10), minutes);
            return {
                date: formattedDate,
                time: formattedTime,
                originalDate: value.date,
            };
        });
        const uniqueHeaders = headers.filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.originalDate === item.originalDate)
        );

        setDataByZoneHeader(uniqueHeaders);

        const data = adminReducer.users.map((user) => ({
            ...user,
            zoneName: user.zone.split('Z')[1] || '',
            attendanceDetails: adminReducer.attendanceDetails
                .filter((detail) => detail.SATID === user._id)
                .sort((a, b) => new Date(b.date) - new Date(a.date)),
        }))

        setAttendanceData(data);
    };

    useEffect(() => {
        prepareAttendanceData();
    }, []);

    const filteredData = attendanceData
        .filter((user) =>
            `${user.firstname} ${user.lastname}`.toLowerCase().includes(filters.query.toLowerCase())
        )
        .filter((user) => (filters.userID ? user.ID.includes(filters.userID.toUpperCase()) : true))
        .filter((user) => (filters.userMobile ? user.mobile.includes(filters.userMobile) : true))
        .filter((user) => (filters.zone ? user.zoneName === filters.zone : true))
        .filter((user) => (filters.subZone ? user.subzone?.toUpperCase() === filters.subZone.toUpperCase() : true))
        .filter((user) => (filters.belowAttendance ? user.attendance <= Number(filters.belowAttendance) : true))
        .filter((user) => (filters.aboveAttendance ? user.attendance >= Number(filters.aboveAttendance) : true))
        .sort((a, b) => {
            // Extract numeric part after 'SATP' and convert to integer for proper sorting
            const numA = parseInt(a.ID.replace('SATP', ''), 10);
            const numB = parseInt(b.ID.replace('SATP', ''), 10);
            return numA - numB;  // Sort in ascending order
        });


    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
            },
        },

    };

    const columns = [
        {
            name: '#',
            selector: (row, index) => index + 1,
            width: '4rem'
        },
        {
            name: 'UID',
            selector: (row) => <Link to={`/user/${row?.ID}`}>
                <button className='adminHomeEditBtn mb-2 me-2'>
                    {row?.ID}
                </button>
            </Link>,
            width: '9rem'
        },
        {
            name: 'Name',
            selector: (row) => <>
                {
                    row.profilePhotoStatus === false
                        ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                        : <img src={`https://storage.googleapis.com/satdham-assets.firebasestorage.app/${row?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                }
                &nbsp;<span className={`${row.isActive !== true ? 'text-danger' : ""}`}>{row?.firstname} {row?.lastname}</span>
            </>,
            width: '20rem'
        },
        {
            name: 'Mobile',
            selector: (row) => row.mobile,
            width: '10rem'
        },
        {
            name: 'Gender',
            selector: (row) => row.gender,
            width: '6rem'
        },
        {
            name: 'Zone',
            selector: (row) => row?.zoneName || '-',
            width: '5rem'
        },
        {
            name: 'Subzone',
            selector: (row) => row?.subzone || '-',
            width: '7rem'

        },
        {
            name: 'Attendance',
            selector: (row) => <span style={{ fontWeight: '600' }}>
                <span className={`${row?.attendance >= 75 ? "text-success" : row?.attendance < 75 && row?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>
                    {row?.attendance}%
                </span>
            </span>,
            width: '10rem'
        },
        ...dataByZoneHeader
            .filter((_, index) => index < numberAtdetails)
            .map((header, headerIndex) => ({
                name: (
                    <div>
                        <div><b>{header.date.split('-')[0]}-{header.date.split('-')[1]}</b></div>
                        <div><b>{header.time}</b></div>
                    </div>
                ),
                cell: (row) => {
                    const matchedDetail = row.attendanceDetails.find(
                        (detail) =>
                            detail.date === header.originalDate &&
                            (!filters.startDate || filters.startDate <= detail.date) &&
                            (!filters.endDate || filters.endDate >= detail.date)
                    );

                    return (
                        <span
                            style={{ fontSize: '18px' }}
                            className={`${matchedDetail?.isPresent ? '' : 'text-danger fw-bold'}`}
                        >
                            {matchedDetail ? (matchedDetail.isPresent ? 'P' : 'A') : '-'}
                        </span>
                    );
                },
            })),
    ];

    const generatePDF = () => {

        let doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: [842, 595]
        })

        const imageHeight = 150
        doc.setFontSize(11);
        doc.addImage(satdhamLogo, "PNG", 300, 100, 250, 233, imageHeight)
        doc.setFontSize(20);
        doc.text('Sat-Sabha member report by admin', 265, 400)
        doc.setFontSize(14)
        doc.addPage();


        autoTable(doc, {
            head: [
                [
                    '#',
                    'UID',
                    'Name',
                    'Mobile',
                    'Gender',
                    'Zone',
                    'Subzone',
                    'Attendance',
                    ...dataByZoneHeader
                        .filter((_, index) => index < numberAtdetails)
                        .map((h) => `${h.date.split('-')[0]}-${h.date.split('-')[1]} ${h.time}`),
                ],
            ],
            body: filteredData.map((user, index) => [
                index + 1,
                user.ID,
                `${user.firstname} ${user.lastname}`,
                user.mobile,
                user.gender,
                user.zoneName,
                user.subzone || '-',
                `${user.attendance}%`,
                ...dataByZoneHeader
                    .filter((_, index) => index < numberAtdetails)
                    .map((header) => {
                        const matchedDetail = user.attendanceDetails.find(
                            (detail) =>
                                detail.date === header.originalDate &&
                                (!filters.startDate || filters.startDate <= detail.date) &&
                                (!filters.endDate || filters.endDate >= detail.date)
                        );
                        return matchedDetail ? (matchedDetail.isPresent ? 'P' : 'A') : '-';
                    }),
            ]),
        });

        doc.save('AttendanceReport.pdf');
    };

    return (
        <div>
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
                            className="mt-2 mb-4"
                            value={numberAtdetails}
                            min={0}
                            onChange={(e) => setNumberAtdetails(e.target.value)}
                            placeholder="Ex: 6"
                        />
                    </div>
                </div>
            </div>

            <div>
                <input
                    type="text"
                    name="query"
                    className="mb-3"
                    value={filters.query}
                    onChange={handleFilterChange}
                    placeholder="Search by Name"
                />
                <span> -- OR -- </span>
                <input
                    type="text"
                    name="userID"
                    className="mb-3"
                    value={filters.userID}
                    onChange={handleFilterChange}
                    placeholder="Search by User ID"
                />
                <span> -- OR -- </span>
                <input
                    type="text"
                    name="userMobile"
                    className="mb-3"
                    value={filters.userMobile}
                    onChange={handleFilterChange}
                    placeholder="Search by Mobile"
                />
                <hr />
                <br />
                <input
                    type="text"
                    name="zone"
                    className="mb-3"
                    value={filters.zone}
                    onChange={handleFilterChange}
                    placeholder="Search by Zone"
                />
                <span> -- OR -- </span>
                <input
                    type="text"
                    name="subZone"
                    className="mb-3"
                    value={filters.subZone}
                    onChange={handleFilterChange}
                    placeholder="Search by Subzone"
                />
                <hr />
                <br />
                <input
                    type="number"
                    name="aboveAttendance"
                    className="mb-3"
                    value={filters.aboveAttendance}
                    onChange={handleFilterChange}
                    placeholder="Above Attendance"
                />
                <span> -- OR -- </span>
                <input
                    type="number"
                    name="belowAttendance"
                    className="mb-3"
                    value={filters.belowAttendance}
                    onChange={handleFilterChange}
                    placeholder="Below Attendance"
                />
                <br />
                <hr />
                <br />
                <input
                    type="date"
                    name="startDate"
                    className="mb-3"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                />
                <span> -- OR -- </span>
                <input
                    type="date"
                    name="endDate"
                    className="mb-3"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                />
            </div>

            <br />
            <hr />
            <hr />
            <br />

            <DataTable
                // title="Attendance Records"
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
                customStyles={customStyles}
                paginationRowsPerPageOptions={[10, 15, 20, 30, 50, 70, 100, 120, 150]}
            />
        </div>
    );
};

export default AttendanceZone;
