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
const AbsentRatio = () => {

    const adminReducer = useSelector(state => state.adminReducer)

    // Live search by zone ID
    const [startDate, setstartDate] = useState('');
    // Live search by zone ID
    const [endDate, setendDate] = useState('');


    const [zoneAbsentRatioCount, setZoneAbsentRatioCount] = useState([])
    const zoneAbsentRatio = async () => {
        let attendanceZoneAbsentRatio = []

        await adminReducer.zone.map((zval1, index) => {
            attendanceZoneAbsentRatio.push({
                zonename: zval1.ID.split('Z')[1],
                Absent: 0,
                presentUser: 0
            })
        })

        if (startDate && endDate) {
            // console.log("called", startDate, endDate);
            // Iterate over each zone in attendanceZoneAbsentRatio
            await attendanceZoneAbsentRatio.map(async (val1, index) => {
                // Iterate over each user
                let Absent = 0
                let presentUser = 0
                await adminReducer.attendanceDetails.map((val2, index2) => {
                    // Check if the user's zone matches the current zone's ID
                    if (val1.zonename === val2.zone && (val2.date > startDate && val2.date < endDate)) {
                        if (val2.isPresent === false) Absent = Absent + 1
                        if (val2.isPresent === true) presentUser = presentUser + 1
                    }
                });
                attendanceZoneAbsentRatio[index].Absent = Absent;
                attendanceZoneAbsentRatio[index].presentUser = presentUser;
            });
        } else {
            // Iterate over each zone in attendanceZoneAbsentRatio
            await attendanceZoneAbsentRatio.map(async (val1, index) => {
                // Iterate over each user
                let Absent = 0
                let presentUser = 0
                await adminReducer.attendanceDetails.map((val2, index2) => {
                    // Check if the user's zone matches the current zone's ID
                    if (val1.zonename === val2.zone) {
                        if (val2.isPresent === false) Absent = Absent + 1
                        if (val2.isPresent === true) presentUser = presentUser + 1
                    }
                });
                attendanceZoneAbsentRatio[index].Absent = Absent;
                attendanceZoneAbsentRatio[index].presentUser = presentUser;
            });
        }

        await attendanceZoneAbsentRatio.sort((a, b) => b.Absent - a.Absent);
        setZoneAbsentRatioCount(attendanceZoneAbsentRatio);
    }
    // console.log(zoneAbsentRatioCount);

    const resetData = async () => {
        await Promise.all([
            setstartDate(""),
            setendDate("")
        ]);
        // await zoneAbsentRatio();
    }
    useEffect(() => {
        zoneAbsentRatio()
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
                </div>
            </div>

            <div
                style={{
                    marginTop: "30px",
                    // backgroundColor: "#FFF1F1",
                    padding: "0px",
                }}
            >
                <BarChart
                    width={400}
                    height={300}
                    data={zoneAbsentRatioCount}
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
                    <Bar dataKey="Absent" fill="#FF5A5A" />
                </BarChart>
            </div>
        </>
    )
}

export default AbsentRatio