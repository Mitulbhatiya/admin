import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    Rectangle,
} from "recharts";

const UserRatio = () => {

    const adminReducer = useSelector(state => state.adminReducer)

    // Live search by zone ID
    const [startDate, setstartDate] = useState('');
    // Live search by zone ID
    const [endDate, setendDate] = useState('');


    const [zonuserDataRatio, setZonuserDataRatio] = useState([])
    const zoneUserDataFunc = async () => {
        let allUserRatioByZone = []

        await adminReducer.zone.map((zval1, index) => {
            allUserRatioByZone.push({
                zonename: zval1.ID.split('Z')[1],
                User: 0,
                Absent: 0,
            })
        })

        if (startDate && endDate) {
            // Iterate over each zone in allUserRatioByZone
            await allUserRatioByZone.map(async (val1, index) => {
                // Iterate over each user
                let User = 0
                let Absent = 0
                await adminReducer.users.map((val2, index2) => {
                    // Check if the user's zone matches the current zone's ID
                    if (val1.zonename === val2.zone.split('Z')[1] && (val2.createdAt > startDate && val2.createdAt < endDate) && val2.isActive === true) {
                        User = User + 1
                    }
                });
                await adminReducer.attendanceDetails.map((val2, index2) => {
                    // Check if the user's zone matches the current zone's ID
                    if (val1.zonename === val2.zone.split('Z')[1] && (val2.date > startDate && val2.date < endDate)) {
                        if (val2.isPresent === false) Absent = Absent + 1

                    }
                });
                allUserRatioByZone[index].User = User;
                allUserRatioByZone[index].Absent = Absent;
            });

        } else {
            // Iterate over each zone in allUserRatioByZone
            await allUserRatioByZone.map(async (val1, index) => {
                // Iterate over each user
                let User = 0
                let Absent = 0
                await adminReducer.users.map((val2, index2) => {
                    // Check if the user's zone matches the current zone's ID
                    if (val1.zonename === val2.zone.split('Z')[1] && val2.isActive === true) {
                        User = User + 1
                    }
                });
                await adminReducer.attendanceDetails.map((val2, index2) => {
                    // Check if the user's zone matches the current zone's ID
                    if (val1.zonename === val2.zone.split('Z')[1]) {
                        if (val2.isPresent === false) Absent = Absent + 1
                    }
                });
                allUserRatioByZone[index].User = User;
                allUserRatioByZone[index].Absent = Absent;
            });
        }
        await allUserRatioByZone.sort((a, b) => b.User - a.User);
        setZonuserDataRatio(allUserRatioByZone);
    }




    // Click Status
    const [clickOnChartBar, setClickOnChartBar] = useState(false)
    // SubzoneData
    const [subZoneData, setSubZoneData] = useState([])

    // Live search by zone ID
    const [startDateSubZone, setstartDateSubZone] = useState('');
    // Live search by zone ID
    const [endDateSubZone, setendDateSubZone] = useState('');


    const handleBarClick = async (data, index) => {
        let allUserRatioBySubZone = []

        await adminReducer.subzone.map((zval1, index) => {
            if (zval1.zoneID === `SATZ${data?.payload?.zonename}`) {
                allUserRatioBySubZone.push({
                    subzone: zval1.ID,
                    zonename: zval1.zoneID,
                    User: 0,
                })
            }
        })


        if (startDate && endDate) {
            await allUserRatioBySubZone.map(async (val1, index) => {
                // Iterate over each user
                let User = 0
                await adminReducer.users.map((val2, index2) => {
                    // Check if the user's zone matches the current zone's ID
                    if (val1.zonename === val2.zone && val1.subzone === val2.subzone && (val2.createdAt > startDate && val2.createdAt < endDate)) {
                        User = User + 1
                    }
                });
                allUserRatioBySubZone[index].User = User;
            });
        } else {
            await allUserRatioBySubZone.map(async (val1, index) => {
                // Iterate over each user
                let User = 0
                await adminReducer.users.map((val2, index2) => {
                    // Check if the user's zone matches the current zone's ID
                    if (val1.zonename === val2.zone && val1.subzone === val2.subzone) {
                        User = User + 1
                    }
                });
                allUserRatioBySubZone[index].User = User;
            });
        }
        // await allUserRatioBySubZone.sort((a, b) => b.User - a.User);
        await setSubZoneData(allUserRatioBySubZone)
        setClickOnChartBar(true)
    };




    const resetData = async () => {
        await Promise.all([
            setstartDate(""),
            setendDate(""),
            setClickOnChartBar(false)
        ]);
    }

    useEffect(() => {
        zoneUserDataFunc()
    }, [startDate, endDate])

    return (
        <>

            <div className='d-flex my-3'>
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
                <div>
                    <button className='mb-4 ms-3 mt-4 btn btn-outline-secondary' onClick={() => resetData()}>Reset</button>
                    {
                        clickOnChartBar === true
                            ? <button className='mb-4 ms-3 mt-4 btn btn-outline-secondary' onClick={() => setClickOnChartBar(false)}>Back</button>
                            : ""
                    }

                </div>
            </div>

            <div
                style={{
                    marginTop: "30px",
                    // backgroundColor: "#F5F6FF",
                    padding: "0px",
                }}
            >
                {
                    clickOnChartBar === true
                        ? <BarChart
                            width={900}
                            height={300}
                            data={subZoneData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <XAxis dataKey="subzone" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="User"
                                fill="#8884d8"
                            />
                        </BarChart>
                        : <BarChart
                            width={900}
                            height={300}
                            data={zonuserDataRatio}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="zonename" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="User"
                                fill="#8884d8"
                                onClick={(data, index) => handleBarClick(data, index)} // Attach click event
                            />
                            {/* <Bar dataKey="Absent" fill="#FF5A5A" /> */}
                        </BarChart>
                }

            </div>
        </>
    )
}

export default UserRatio