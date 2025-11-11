import React, { useState } from "react";
import { useSelector } from "react-redux";

const Statistics = () => {
    const adminReducer = useSelector((state) => state.adminReducer);

    // State for filters
    const [selectedCountry, setSelectedCountry] = useState("All");
    const [selectedState, setSelectedState] = useState("All");
    const [selectedCity, setSelectedCity] = useState("All");
    const [selectedZone, setSelectedZone] = useState("All");
    const [selectedSubZone, setSelectedSubZone] = useState("All");

    // Get unique values for dropdowns
    const countries = [...new Set(adminReducer.zone.map((z) => z.location.country))];
    const states = selectedCountry === "All"
        ? []
        : [...new Set(adminReducer.zone
            .filter((z) => z.location.country === selectedCountry)
            .map((z) => z.location.state))];
    const cities = selectedState === "All"
        ? []
        : [...new Set(adminReducer.zone
            .filter((z) => z.location.state === selectedState)
            .map((z) => z.location.city))];
    const zones = selectedCity === "All"
        ? []
        : adminReducer.zone.filter((z) => z.location.city === selectedCity);


    // Filtered users
    const filteredUsers = adminReducer.users.filter((user) => {
        if (user.isActive) {
            const matchesCountry =
                selectedCountry === "All" ||
                adminReducer.zone.find((z) => z.ID === user.zone)?.location.country === selectedCountry;
            const matchesState =
                selectedState === "All" ||
                adminReducer.zone.find((z) => z.ID === user.zone)?.location.state === selectedState;
            const matchesCity =
                selectedCity === "All" ||
                adminReducer.zone.find((z) => z.ID === user.zone)?.location.city === selectedCity;
            const matchesZone =
                selectedZone === "All" || user.zone === selectedZone;
            const matchesSubZone =
                selectedSubZone === "All" || user.subzone === selectedSubZone;

            return matchesCountry && matchesState && matchesCity && matchesZone && matchesSubZone;
        }
    });

    // Counts
    const totalUser = filteredUsers.length;
    const totalMale = filteredUsers.filter((user) => user.gender === "Male").length;
    const totalFemale = filteredUsers.filter((user) => user.gender === "Female").length;

    // Attendance count
    const uniqueDates = new Set(adminReducer.attendance.map(item => item.createdAt.split("T")[0]));
    // const uniqueAttendanceDates = [
    //     ...new Set(filteredUsers.flatMap((user) => user.attendance))
    // ];


    return (
        <div>
            {/* Filters */}
            <div className="row mb-4">
                <div className="mb-3 col-md-3">
                    <p>Filter by Country</p>
                    <select
                        className="form-control"
                        value={selectedCountry}
                        onChange={(e) => {
                            setSelectedCountry(e.target.value);
                            setSelectedState("All");
                            setSelectedCity("All");
                            setSelectedZone("All");
                            setSelectedSubZone("All");
                        }}
                    >
                        <option value="All">All</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3 col-md-3">
                    <p>Filter by State</p>
                    <select
                        className="form-control"
                        value={selectedState}
                        onChange={(e) => {
                            setSelectedState(e.target.value);
                            setSelectedCity("All");
                            setSelectedZone("All");
                            setSelectedSubZone("All");
                        }}
                        disabled={selectedCountry === "All"}
                    >
                        <option value="All">All</option>
                        {states.map((state, index) => (
                            <option key={index} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3 col-md-3">
                    <p>Filter by City</p>
                    <select
                        className="form-control"
                        value={selectedCity}
                        onChange={(e) => {
                            setSelectedCity(e.target.value);
                            setSelectedZone("All");
                            setSelectedSubZone("All");
                        }}
                        disabled={selectedState === "All"}
                    >
                        <option value="All">All</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3 col-md-3">
                    <p>Filter by Zone</p>
                    <select
                        className="form-control"
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        disabled={selectedCity === "All"}
                    >
                        <option value="All">All</option>
                        {zones.map((zone, index) => (
                            <option key={index} value={zone.ID}>
                                {zone.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedZone !== "All" && (
                    <div className="mb-3 col-md-3">
                        <p>Filter by Subzone</p>
                        <select
                            className="form-control"
                            value={selectedSubZone}
                            onChange={(e) => setSelectedSubZone(e.target.value)}
                        >
                            <option value="All">All</option>
                            {adminReducer.subzone
                                .filter((sz) => sz.zoneID === selectedZone)
                                .map((subzone, index) => (
                                    <option key={index} value={subzone.ID}>
                                        {subzone.ID}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Statistics */}

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
                        <p style={{ fontSize: '22px', fontWeight: '500' }}>{uniqueDates.size}</p>
                        <p>Total sabha</p>
                    </div>
                </div>
                {/* <div className='col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-3'>
                    <div className='card_statistics card' style={{ backgroundColor: '#F4F6FA', border: 'none' }}>
                        <p style={{ fontSize: '22px', fontWeight: '500' }}>{adminReducer?.zone.length}</p>
                        <p>Total zone</p>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Statistics;
