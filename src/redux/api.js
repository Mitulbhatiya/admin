import {
    addLocationData,
    addRemark,
    addUser,
    addZone,
    addsubZone,
    base_url,
    changePassword,
    deleteAttendance,
    deleteLocationData,
    deleteRemark,
    generateMasterAtKet,
    getAttendance,
    getAttendanceDetails,
    getAttendanceDetailsData,
    getEachAttendance,
    getEachUser,
    getLocationData,
    getRemark,
    getRequest,
    getUser,
    getZone,
    getsubZone,
    newAttendance,
    newAttendanceAccess,
    submitMasterAttendance,
    updateActiveStatus,
    updateAttendance,
    updateEachAttendance,
    updateEachUser,
    updateLocationData,
    updateRemark,
    updateRequest,
    updateRole,
    updateZone,
    updatesubZone,
    userChangeZone,
    userData
} from '../constant/const'
import { get_api_structure, patch_api_structure, post_api_structure } from './structure/structure.api'


// Get Userdata
export async function get_adminUserdata(data) {
    return await get_api_structure(base_url + userData)
}

// PATCH
export async function patch_adminChangePassword(data) {
    return await patch_api_structure(base_url + changePassword, data.data)
}


// ===================********************* LOCATION DATA ********************* ====================

// POST 
export async function post_adminLocationData(data) {
    return await post_api_structure(base_url + addLocationData, data.data)
}
// GET 
export async function get_adminLocationData(data) {
    return await get_api_structure(base_url + getLocationData)
}
// PATCH
export async function patch_adminUpdateLocationData(data) {
    return await patch_api_structure(base_url + updateLocationData, data.data)
}
// DELETE 
export async function delete_adminLocationData(data) {
    return await post_api_structure(base_url + deleteLocationData, data.data)
}


// ===================********************* Zone ********************* ====================

// POST 
export async function post_zone(data) {
    return await post_api_structure(base_url + addZone, data.data)
}
// GET 
export async function get_zone(data) {
    return await get_api_structure(base_url + getZone)
}
// PATCH 
export async function patch_zone(data) {
    return await patch_api_structure(base_url + updateZone, data.data)
}
// USER CHANGE 
export async function userChange_zone(data) {
    return await patch_api_structure(base_url + userChangeZone, data.data)
}

// ===================********************* User ********************* ====================

// POST 
export async function post_user(data) {
    return await post_api_structure(base_url + addUser, data.data)
}
// GET 
export async function get_user(data) {
    return await get_api_structure(base_url + getUser)
}
// GET -EACH 
export async function get_each_user(data) {
    return await post_api_structure(base_url + getEachUser, data.data)
}
// PATCH -EACH 
export async function patch_each_user(data) {
    return await post_api_structure(base_url + updateEachUser, data.data)
}
// PATCH - Active status 
export async function patch_update_active_status(data) {
    return await patch_api_structure(base_url + updateActiveStatus, data.data)
}

// ===================********************* Role ********************* ====================

// POST 
export async function post_role(data) {
    return await post_api_structure(base_url + updateRole, data.data)
}

// ===================********************* Request ********************* ====================

// GET 
export async function get_request(data) {
    return await get_api_structure(base_url + getRequest)
}
// PATCh 
export async function patch_request(data) {
    return await patch_api_structure(base_url + updateRequest, data.data)
}


// ===================********************* Attendance ********************* ====================

// POST MASTER ATTENDANCE KEY
export async function post_masterAttendanceKey(data) {
    return await post_api_structure(base_url + generateMasterAtKet, data.data)
}

// POST MASTER ATTENDANCE Submit
export async function post_masterAttendanceSubmit(data) {
    return await post_api_structure(base_url + submitMasterAttendance, data.data)
}
// POST 
export async function post_newAttendance(data) {
    return await post_api_structure(base_url + newAttendance, data.data)
}

// GET 
export async function get_newAttendance(data) {
    return await get_api_structure(base_url + getAttendance)
}

// PATCH 
export async function patch_newAttendance(data) {
    return await patch_api_structure(base_url + updateAttendance, data.data)
}

// DELETE 
export async function delete_newAttendance(data) {
    return await post_api_structure(base_url + deleteAttendance, data.data)
}

// GET 
export async function get_each_newAttendance(data) {
    return await post_api_structure(base_url + getEachAttendance, data.data)
}
// PATCH EACh 
export async function patch_each_newAttendance(data) {
    return await post_api_structure(base_url + updateEachAttendance, data.data)
}
// GET Attendance details
export async function get_details_newAttendance(data) {
    return await get_api_structure(base_url + getAttendanceDetails)
}
// GET Attendance details for analysis in attendance page
export async function get_detailsData_newAttendance(data) {
    return await get_api_structure(base_url + getAttendanceDetailsData)
}



// ===================********************* Attendance Access ********************* ====================

// POST 
export async function post_newAttendanceAccess(data) {
    return await post_api_structure(base_url + newAttendanceAccess, data.data)
}



// ===================********************* subZone ********************* ====================

// POST 
export async function post_subzone(data) {
    return await post_api_structure(base_url + addsubZone, data.data)
}
// GET 
export async function get_subzone(data) {
    return await get_api_structure(base_url + getsubZone)
}
// PATCH 
export async function patch_subzone(data) {
    return await patch_api_structure(base_url + updatesubZone, data.data)
}

// ===================********************* Remark DATA ********************* ====================

// POST 
export async function post_adminRemark(data) {
    return await post_api_structure(base_url + addRemark, data.data)
}
// GET 
export async function get_adminRemark(data) {
    return await post_api_structure(base_url + getRemark, data.data)
}
// PATCH
export async function patch_adminUpdateRemark(data) {
    return await patch_api_structure(base_url + updateRemark, data.data)
}
// DELETE 
export async function delete_adminRemark(data) {
    return await post_api_structure(base_url + deleteRemark, data.data)
}