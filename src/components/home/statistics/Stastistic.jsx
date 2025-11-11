import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const Stastistic = () => {

    const adminReducer = useSelector(state => state.adminReducer)

    const [selectedZone, setSelectedZone] = useState('All')
    const [selectedSubZone, setSelectedSubZone] = useState("")

    let totalUser = 0
    let totalMale = 0
    let totalFemale = 0
    let totalSabha = 0
    adminReducer.users.map((value) => {
        if (selectedZone === "All") {
            if (value.isActive === true) totalUser = totalUser + 1
            if (value.gender === "Male") totalMale = totalMale + 1
            if (value.gender === "Female") totalFemale = totalFemale + 1
        } else {
            if (selectedSubZone) {
                if (value.zone === selectedZone && value.subzone === selectedSubZone) {
                    if (value.isActive === true) totalUser = totalUser + 1
                    if (value.gender === "Male") totalMale = totalMale + 1
                    if (value.gender === "Female") totalFemale = totalFemale + 1
                }
            } else {
                if (value.zone === selectedZone) {
                    if (value.isActive === true) totalUser = totalUser + 1
                    if (value.gender === "Male") totalMale = totalMale + 1
                    if (value.gender === "Female") totalFemale = totalFemale + 1

                }
            }
        }
    })
    // const uniqueByDateObject = adminReducer.attendance.reduce((acc, curr) => {
    //     if (!acc[curr.date]) {
    //         acc[curr.date] = curr;
    //     }
    //     return acc;
    // }, {});
    // const uniqueDates = Object.values(uniqueByDateObject);
    // console.log(uniqueDates);
    const uniqueDates = [...new Set(adminReducer.attendance.map(item => item.date.split('T')[0]))];

    // Create an object to store unique dates
    const uniqueDatess = new Set();

    // Filter the attendance array based on selected zone and unique dates
    adminReducer.attendance.forEach((value1) => {
        if (selectedZone !== "All" && value1.zone === selectedZone) {
            const date = value1.date.split('T')[0]; // Extract date part
            uniqueDatess.add(date); // Store object with unique date as key
            totalSabha = totalSabha + 1;
        }
    });

    // Convert the values of the uniqueDatess object back to an array
    const uniqueAttendance = [...uniqueDatess];

    // Now uniqueAttendance contains only unique objects based on date split by 'T' and index 0
    // console.log(uniqueAttendance);
    // console.log(totalSabha);

    return (
        <>
            <div className='row mt-4'>
                <div className="mb-3 mt-3 col-12 col-md-4 col-lg-2">
                    <p>Zone</p>
                    <select
                        className="form-control input_field"
                        defaultValue={selectedZone}
                        onChange={e => {
                            setSelectedZone(e.target.value)
                            setSelectedSubZone("")
                        }}
                    >
                        <option value="All">All</option>
                        {
                            adminReducer.zone.map((value, index) => {
                                return (
                                    <option value={value.ID} key={index}>{value.ID.split('Z')[1]} - {value?.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                {
                    selectedZone !== "All"
                        ? <div className="mb-3 mt-3 col-12 col-md-4 col-lg-2">
                            <p>Subzone</p>
                            <select
                                className="form-control input_field"
                                onChange={e => setSelectedSubZone(e.target.value)}
                            >
                                <option value="">Tap to select</option>
                                <option value="0">0</option>
                                {
                                    adminReducer.subzone.map((value, index) => {
                                        if (value.zoneID === selectedZone) {
                                            return (
                                                <option value={value.ID} key={index}>{value.ID}</option>
                                            )
                                        }
                                    })
                                }
                            </select>
                        </div>
                        : ""
                }
            </div>
            <div className='row mt-4'>
                <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-3'>
                    <div className='card_statistics card' style={{ backgroundColor: '#FFEFE2', border: 'none' }}>
                        <p style={{ fontSize: '22px', fontWeight: '500' }}>{totalUser}</p>
                        <p>Total member 🙋‍♂️</p>
                    </div>
                </div>
                <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-3'>
                    <div className='card_statistics card' style={{ backgroundColor: '#EFFCEF', border: 'none' }}>
                        <p style={{ fontSize: '22px', fontWeight: '500' }}>{totalMale}</p>
                        <p>Male 🧑‍💻</p>
                    </div>
                </div>
                <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-3'>
                    <div className='card_statistics card' style={{ backgroundColor: '#E6F5F9', border: 'none' }}>
                        <p style={{ fontSize: '22px', fontWeight: '500' }}>{totalFemale}</p>
                        <p>Female 🙍‍♀️</p>
                    </div>
                </div>
                <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-3'>
                    <div className='card_statistics card' style={{ backgroundColor: '#F4F6FA', border: 'none' }}>
                        <p style={{ fontSize: '22px', fontWeight: '500' }}>{selectedZone !== "All" ? uniqueAttendance?.length : uniqueDates?.length}</p>
                        <p>Total sabha</p>
                    </div>
                </div>
                <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-3'>
                    <div className='card_statistics card' style={{ backgroundColor: '#F4F6FA', border: 'none' }}>
                        <p style={{ fontSize: '22px', fontWeight: '500' }}>{adminReducer?.zone.length}</p>
                        <p>Total zone</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Stastistic