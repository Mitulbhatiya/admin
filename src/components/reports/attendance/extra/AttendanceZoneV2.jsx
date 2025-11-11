
// ROW code of v2 attandance zone
// ROW Logic code
// Used for only backup purpose


import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import satdhamLogo from '../../../assets/satdham_logo.jpeg';

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

    const prepareAttendanceData = () => {
        const headers = adminReducer.attendance.map((value) => {
            const [datePart, timePart] = value.date.split('T');
            const [hours, minutes] = timePart.split(':');
            const formattedDate = `${datePart.split('-')[2]}-${datePart.split('-')[1]}-${datePart.split('-')[0]}`;
            const formattedTime = `${hours}:${minutes}`;
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
        }));

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
        .filter((user) => (filters.belowAttendance ? user.attendance < Number(filters.belowAttendance) : true))
        .filter((user) => (filters.aboveAttendance ? user.attendance > Number(filters.aboveAttendance) : true));

    const columns = [
        { name: '#', selector: (row, index) => index + 1, sortable: true },
        { name: 'UID', selector: (row) => row.ID, sortable: true },
        { name: 'Name', selector: (row) => `${row.firstname} ${row.lastname}`, sortable: true },
        { name: 'Mobile', selector: (row) => row.mobile, sortable: true },
        { name: 'Gender', selector: (row) => row.gender, sortable: true },
        { name: 'Zone', selector: (row) => row.zoneName, sortable: true },
        { name: 'Subzone', selector: (row) => row.subzone || '-', sortable: true },
        { name: 'Attendance', selector: (row) => `${row.attendance}%`, sortable: true },
        ...dataByZoneHeader
            .filter((_, index) => index < numberAtdetails)
            .map((header, headerIndex) => ({
                name: (
                    <div>
                        <div>{header.date}</div>
                        <div>{header.time}</div>
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
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.addImage(satdhamLogo, 'PNG', 10, 10, 50, 50);
        doc.text('Attendance Report', 70, 30);

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
                        .map((h) => `${h.date} ${h.time}`),
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
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    name="query"
                    value={filters.query}
                    onChange={handleFilterChange}
                    placeholder="Search by Name"
                />
                <input
                    type="text"
                    name="userID"
                    value={filters.userID}
                    onChange={handleFilterChange}
                    placeholder="Search by User ID"
                />
                <input
                    type="text"
                    name="userMobile"
                    value={filters.userMobile}
                    onChange={handleFilterChange}
                    placeholder="Search by Mobile"
                />
                <input
                    type="text"
                    name="zone"
                    value={filters.zone}
                    onChange={handleFilterChange}
                    placeholder="Search by Zone"
                />
                <input
                    type="text"
                    name="subZone"
                    value={filters.subZone}
                    onChange={handleFilterChange}
                    placeholder="Search by Subzone"
                />
                <input
                    type="number"
                    name="belowAttendance"
                    value={filters.belowAttendance}
                    onChange={handleFilterChange}
                    placeholder="Below Attendance"
                />
                <input
                    type="number"
                    name="aboveAttendance"
                    value={filters.aboveAttendance}
                    onChange={handleFilterChange}
                    placeholder="Above Attendance"
                />
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                />
                <div className="me-3 mt-3">
                    <small>Attendance visibility number</small>
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
                <button onClick={generatePDF}>Generate PDF</button>
            </div>

            <DataTable
                title="Attendance Records"
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
            />
        </div>
    );
};

export default AttendanceZone;
