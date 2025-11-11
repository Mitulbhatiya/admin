import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import userImg from '../assets/user.png'


import DataTable from 'react-data-table-component'



const customSort = (rows, selector, direction) => {
    // console.log(rows, selector, direction);

    return rows.sort((a, b) => {
        // Use selector function to get the field value from each row
        const aField = selector(a);
        const bField = selector(b);
        let comparison = 0;

        if (aField > bField) {
            comparison = 1;
        } else if (aField < bField) {
            comparison = -1;
        }

        return direction === 'desc' ? comparison * -1 : comparison;
    });
};


const ManageUsers = () => {
    const adminReducer = useSelector(state => state.adminReducer)

    // Live search by Username
    const [query, setQuery] = useState('');
    // Function to handle changes in the search query
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Filter the array based on the search query
    const filteredData = adminReducer.users.filter(item =>
        (item.firstname.toLowerCase() + " " + item.lastname.toLowerCase()).includes(query.toLowerCase())
    );


    // Live search by user ID
    const [queryuserID, setQueryuserID] = useState('');

    // Function to handle changes in the search query for ZoneID
    const handleInputChange_UserID = (e) => {
        setQueryuserID(e.target.value);

    };
    // Filter the array based on the search query for ZoneID
    const filteredDataUserID = adminReducer.users.filter(item =>
        item.ID.split('P')[1].toUpperCase() === queryuserID.toUpperCase()
    );



    // Live search by user mobile
    const [queryuserMobile, setQueryuserMobile] = useState('');

    // Function to handle changes in the search query for User mobile
    const handleInputChange_UserMobile = (e) => {
        setQueryuserMobile(e.target.value);

    };
    // Filter the array based on the search query for User mobile
    const filteredDataUserMobile = adminReducer.users.filter(item =>
        item.mobile.toUpperCase().includes(queryuserMobile.toUpperCase())
    );


    // Live search by Zone
    const [queryuserZone, setQueryuserZone] = useState('');

    // Function to handle changes in the search query for Zone
    const handleInputChange_UserZone = (e) => {
        setQueryuserZone(e.target.value);

    };
    // Filter the array based on the search query for Zone
    const filteredDataUserZone = adminReducer.users?.filter(user =>
        user.zone && user.zone.split('Z')[1] == queryuserZone
    );



    // Live search by Zone
    const [queryuserSubZone, setQueryuserSubZone] = useState('');

    // Function to handle changes in the search query for Zone
    const handleInputChange_UserSubZone = (e) => {
        setQueryuserSubZone(e.target.value);

    };
    // Filter the array based on the search query for Zone
    const filteredDataUserSubZone = filteredDataUserZone?.filter(user =>
        // (user.zone.split('Z')[1].toUpperCase().includes(queryuserZone.toUpperCase()))
        ((user.zone.split('Z')[1]?.toUpperCase() === queryuserZone?.toUpperCase()) && user.subzone?.toUpperCase() === queryuserSubZone?.toUpperCase())
    );



    adminReducer.users?.sort((a, b) => {
        const zoneA = parseInt(a.ID.split('P')[1]);
        const zoneB = parseInt(b.ID.split('P')[1]);
        return zoneA - zoneB;
    })







    const columns = [
        // {
        //     name: '#',
        //     cell: (row, index) => index + 1,
        //     width: '5rem'
        // },
        {
            name: 'UID',
            selector: row => Number(row.ID.split('P')[1]),
            width: '5rem',
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row?.firstname + "" + row?.lastname, // Return the numeric value for sorting
            width: '20rem',
            sortable: true,
            cell: row => (
                <div className={`${row.isActive === false ? 'text-danger' : ''}`}>
                    {
                        row.profilePhotoStatus === false
                            ? <img src={userImg} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                            : <img src={`https://dzhov20ss4n5i.cloudfront.net/${row?.profileurl}`} height={'40px'} width={'40px'} style={{ borderRadius: '50%' }} />
                    }
                    &nbsp;<span className={`${row.isActive !== true ? 'text-danger' : ""}`}>{row?.firstname} {row?.lastname}</span>
                </div>
            )
        },
        {
            name: 'Mobile',
            selector: row => <a href={`tel:${row.mobile}`} style={{ textDecoration: 'none', color: '#000000' }}> <i className='bx bxs-phone-call'></i> {row.mobile}</a>,
            width: '10rem'
        },
        {
            name: 'Gender',
            selector: row => row.gender,
            width: '7rem',
            sortable: true,

        },
        {
            name: 'Zone',
            selector: row => Number(row.zone.split('Z')[1]),
            width: '5rem',
            sortable: true,
        },
        {
            name: 'Subzone',
            selector: row => Number(row.subzone),
            width: '8rem',
            sortable: true,
        },
        {
            name: 'Attendance',
            selector: row => row.attendance, // Return the numeric value for sorting
            width: '10rem',
            sortable: true,
            cell: row => (
                <td style={{ fontWeight: '600' }}>
                    <span className={`${row?.attendance >= 75 ? "text-success" : row?.attendance < 75 && row?.attendance >= 50 ? "yellow_color" : "text-danger"}`}>
                        {row?.attendance}%
                    </span>
                </td>
            )
        },
        {
            name: 'Role',
            selector: row => <td style={{ textTransform: 'capitalize' }}>{row?.role === "zonesubadmin" ? "Sub-admin" : row?.role}</td>,
            width: '10rem',
            sortable: true,
        },
        {
            name: '',
            selector: row => <td>
                <Link to={`/user/${row?.ID}`}>
                    <button className='adminHomeEditBtn mb-2 me-2'>
                        {/* <i className='bx bx-edit-alt'></i> */}
                        <i className='bx bx-right-arrow-alt'></i>
                    </button>
                </Link>
            </td>,
            width: '10rem',
            sortable: true,
        },
    ];

    const conditionalRowStyles = [
        {
            when: row => row.isActive === false,
            style: {
                color: "red",
                fontWeight: '500'
            }
        }
    ];

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

    return (
        <>


            <div>

                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active tabNavi" id="nav-searchusername-tab" data-bs-toggle="tab" data-bs-target="#nav-searchusername" type="button" role="tab" aria-controls="nav-searchusername" aria-selected="true">User-name</button>
                        <button className="nav-link tabNavi" id="nav-searchMobile-tab" data-bs-toggle="tab" data-bs-target="#nav-searchMobile" type="button" role="tab" aria-controls="nav-searchMobile" aria-selected="false">Mobile number</button>
                        <button className="nav-link tabNavi" id="nav-searchUID-tab" data-bs-toggle="tab" data-bs-target="#nav-searchUID" type="button" role="tab" aria-controls="nav-searchUID" aria-selected="false">User ID</button>
                        <button className="nav-link tabNavi" id="nav-zone-subzone-tab" data-bs-toggle="tab" data-bs-target="#nav-zone-subzone" type="button" role="tab" aria-controls="nav-zone-subzone" aria-selected="false">Zone & Subzone</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-searchusername" role="tabpanel" aria-labelledby="nav-searchusername-tab" tabindex="0">
                        <input
                            type="text"
                            className='my-4 input_field'
                            value={query}
                            onChange={handleInputChange}
                            placeholder="Search by user name"
                        />
                    </div>
                    <div className="tab-pane fade" id="nav-searchMobile" role="tabpanel" aria-labelledby="nav-searchMobile-tab" tabindex="0">
                        <input
                            type="number"
                            className='my-4 input_field'
                            min={0}
                            value={queryuserMobile}
                            onChange={handleInputChange_UserMobile}
                            placeholder="Search by Mobile"
                        />
                    </div>
                    <div className="tab-pane fade" id="nav-searchUID" role="tabpanel" aria-labelledby="nav-searchUID-tab" tabindex="0">
                        <input
                            type="number"
                            className='my-4 input_field'
                            min={0}
                            value={queryuserID}
                            onChange={handleInputChange_UserID}
                            placeholder="Search by UID"
                        />
                    </div>
                    <div className="tab-pane fade" id="nav-zone-subzone" role="tabpanel" aria-labelledby="nav-zone-subzone-tab" tabindex="0">
                        {/* <input
                            type="number"
                            className='my-4'
                            min={0}
                            value={queryuserZone}
                            onChange={handleInputChange_UserZone}
                            placeholder="Search by Zone"
                        /> */}
                        <div className='row'>
                            <div className="mb-3 mt-3 col-12 col-md-4 col-lg-2">
                                <p>Zone</p>
                                <select
                                    className="form-control input_field"
                                    defaultValue={queryuserZone}
                                    onChange={handleInputChange_UserZone}
                                >
                                    <option value="">Select zone</option>
                                    {
                                        adminReducer.zone.map((value, index) => {
                                            return (
                                                <option value={value.ID.split('Z')[1]} key={index}>{value.ID.split('Z')[1]} - {value?.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="mb-3 mt-3 col-12 col-md-4 col-lg-2">
                                {
                                    queryuserZone !== ""
                                        ? <>
                                            <p className='mt-2'>Sub zone</p>
                                            <input
                                                type="number"
                                                className='my-1 input_field'
                                                min={0}
                                                value={queryuserSubZone}
                                                onChange={handleInputChange_UserSubZone}
                                                placeholder="Search by Subzone"
                                            />
                                        </>
                                        : ""
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <br />


            <DataTable
                columns={columns}
                data={
                    query !== ""
                        ? filteredData
                        : queryuserID !== ""
                            ? filteredDataUserID
                            : queryuserMobile !== ""
                                ? filteredDataUserMobile
                                : queryuserZone !== "" && queryuserSubZone !== ""
                                    ? filteredDataUserSubZone
                                    : queryuserZone !== ""
                                        ? filteredDataUserZone
                                        : adminReducer.users
                }
                pagination
                paginationPerPage={30}
                paginationRowsPerPageOptions={[30, 50, 100, 500, 1000]}
                // defaultSortField="sortAccess"
                // selectableRows
                // onSelectedRowsChange={handleChanges}
                customStyles={customStyles}
                // sortFunction={(rows, selector, direction) => {
                //     const fieldType = selector;
                //     console.log(fieldType)
                // }}
                sortFunction={customSort}
                searchable
                conditionalRowStyles={conditionalRowStyles}
            // defaultSortAsc={false}
            // expandableRows expandableRowsComponent={ExpandedComponent}
            />
        </>
    )
}

export default ManageUsers