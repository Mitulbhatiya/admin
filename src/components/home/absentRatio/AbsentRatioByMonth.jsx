import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
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
const AbsentRatioByMonth = () => {

    const adminReducer = useSelector(state => state.adminReducer)

    const [zoneAbsentRatioCount, setZoneAbsentRatioCount] = useState([])
    const zoneAbsentRatio = async () => {
        // let attendanceByMonth = {};

        // // Initialize attendanceByMonth with all months set to 0 absent count
        // adminReducer.attendanceDetails.forEach(val => {
        //     const month = val.date.substring(0, 7); // Extracting the month (e.g., "2024-02")
        //     if (!attendanceByMonth[month]) {
        //         attendanceByMonth[month] = 0;
        //     }
        // });

        // // Count the absent users for each month
        // adminReducer.attendanceDetails.forEach(val => {
        //     const month = val.date.substring(0, 7); // Extracting the month (e.g., "2024-02")
        //     if (!val.isPresent) {
        //         attendanceByMonth[month]++;
        //     }
        // });

        // // Convert attendanceByMonth object to an array of objects
        // const data = Object.keys(attendanceByMonth).map(month => ({
        //     date: month,
        //     absent: attendanceByMonth[month]
        // }));

        // // Sort the data by date (month)
        // data.sort((a, b) => new Date(a.date) - new Date(b.date));

        // // Set the state with the aggregated data
        // setZoneAbsentRatioCount(data);


        let currentDate = new Date();
        let startDate = new Date(currentDate);
        startDate.setFullYear(startDate.getFullYear() - 1); // Set start date to one year ago

        let attendanceByMonth = {};

        // Initialize attendanceByMonth with all months set to 0 absent count
        while (startDate <= currentDate) {
            let month = (startDate.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
            let year = startDate.getFullYear().toString();
            attendanceByMonth[`${year}-${month}`] = 0;
            startDate.setMonth(startDate.getMonth() + 1); // Move to next month
        }

        // Count the absent users for each month
        adminReducer.attendanceDetails.forEach(val => {
            const month = val.date.substring(0, 7); // Extracting the month (e.g., "2024-02")
            if (!val.isPresent && attendanceByMonth[month] !== undefined) {
                attendanceByMonth[month]++;
            }
        });

        // Convert attendanceByMonth object to an array of objects
        const data = Object.keys(attendanceByMonth).map(month => ({
            date: month,
            absent: attendanceByMonth[month]
        }));

        // Sort the data by date (month)
        data.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Set the state with the aggregated data
        setZoneAbsentRatioCount(data);
    }
    // console.log(zoneAbsentRatioCount);


    useEffect(() => {
        zoneAbsentRatio()
    }, [])



    return (
        <>
            <div
                style={{
                    marginTop: "30px",
                    // backgroundColor: "#FFF1F1",
                    padding: "0px",
                }}
            >
                <AreaChart
                    width={600}
                    height={400}
                    data={zoneAbsentRatioCount}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="absent"
                        stroke="#FF5A5A"
                        fill="#FFD7D7"
                        strokeWidth={3}
                        strokeLinecap={"round"}
                    />
                </AreaChart>

            </div>
        </>
    )
}

export default AbsentRatioByMonth