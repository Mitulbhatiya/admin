import { call, put } from 'redux-saga/effects';
import { REQ_FOR_DELETE_ATTENDANCE_ERROR, REQ_FOR_DELETE_ATTENDANCE_SUCCESS, REQ_FOR_DELETE_LOCATION_DATA_ADMIN_ERROR, REQ_FOR_DELETE_LOCATION_DATA_ADMIN_SUCCESS, REQ_FOR_DELETE_REMARK_ADMIN_ERROR, REQ_FOR_DELETE_REMARK_ADMIN_SUCCESS, REQ_FOR_GET_ATTENDANCE_ERROR, REQ_FOR_GET_ATTENDANCE_SUCCESS, REQ_FOR_GET_DETAILS_ATTENDANCE_ERROR, REQ_FOR_GET_DETAILS_ATTENDANCE_SUCCESS, REQ_FOR_GET_DETAILS_DATA_ATTENDANCE_ERROR, REQ_FOR_GET_DETAILS_DATA_ATTENDANCE_SUCCESS, REQ_FOR_GET_EACH_ATTENDANCE_ERROR, REQ_FOR_GET_EACH_ATTENDANCE_SUCCESS, REQ_FOR_GET_EACH_USER_ERROR, REQ_FOR_GET_EACH_USER_SUCCESS, REQ_FOR_GET_LOCATION_DATA_ADMIN_ERROR, REQ_FOR_GET_LOCATION_DATA_ADMIN_SUCCESS, REQ_FOR_GET_REMARK_ADMIN_ERROR, REQ_FOR_GET_REMARK_ADMIN_SUCCESS, REQ_FOR_GET_REQUEST_ERROR, REQ_FOR_GET_REQUEST_SUCCESS, REQ_FOR_GET_SUBZONE_ERROR, REQ_FOR_GET_SUBZONE_SUCCESS, REQ_FOR_GET_USERDATA_ERROR, REQ_FOR_GET_USERDATA_SUCCESS, REQ_FOR_GET_USER_ERROR, REQ_FOR_GET_USER_SUCCESS, REQ_FOR_GET_ZONE_ERROR, REQ_FOR_GET_ZONE_SUCCESS, REQ_FOR_PATCH_ACTIVE_STATUS_ERROR, REQ_FOR_PATCH_ACTIVE_STATUS_SUCCESS, REQ_FOR_PATCH_ATTENDANCE_ERROR, REQ_FOR_PATCH_ATTENDANCE_SUCCESS, REQ_FOR_PATCH_CHANGEPASSWORD_ADMIN_ERROR, REQ_FOR_PATCH_CHANGEPASSWORD_ADMIN_SUCCESS, REQ_FOR_PATCH_EACH_ATTENDANCE_ERROR, REQ_FOR_PATCH_EACH_ATTENDANCE_SUCCESS, REQ_FOR_PATCH_EACH_USER_ERROR, REQ_FOR_PATCH_EACH_USER_SUCCESS, REQ_FOR_PATCH_LOCATION_DATA_ADMIN_ERROR, REQ_FOR_PATCH_LOCATION_DATA_ADMIN_SUCCESS, REQ_FOR_PATCH_REMARK_ADMIN_ERROR, REQ_FOR_PATCH_REMARK_ADMIN_SUCCESS, REQ_FOR_PATCH_REQUEST_ERROR, REQ_FOR_PATCH_REQUEST_SUCCESS, REQ_FOR_PATCH_SUBZONE_ERROR, REQ_FOR_PATCH_SUBZONE_SUCCESS, REQ_FOR_PATCH_ZONE_ERROR, REQ_FOR_PATCH_ZONE_SUCCESS, REQ_FOR_POST_ATTENDANCE_ACCESS_ERROR, REQ_FOR_POST_ATTENDANCE_ACCESS_SUCCESS, REQ_FOR_POST_ATTENDANCE_ERROR, REQ_FOR_POST_ATTENDANCE_SUCCESS, REQ_FOR_POST_LOCATION_DATA_ADMIN_ERROR, REQ_FOR_POST_LOCATION_DATA_ADMIN_SUCCESS, REQ_FOR_POST_MASTER_ATTENDANCE_KEY_ERROR, REQ_FOR_POST_MASTER_ATTENDANCE_KEY_SUCCESS, REQ_FOR_POST_MASTER_ATTENDANCE_SUBMIT_ERROR, REQ_FOR_POST_MASTER_ATTENDANCE_SUBMIT_SUCCESS, REQ_FOR_POST_REMARK_ADMIN_ERROR, REQ_FOR_POST_REMARK_ADMIN_SUCCESS, REQ_FOR_POST_ROLE_USER_ERROR, REQ_FOR_POST_ROLE_USER_SUCCESS, REQ_FOR_POST_SUBZONE_ERROR, REQ_FOR_POST_SUBZONE_SUCCESS, REQ_FOR_POST_USER_ERROR, REQ_FOR_POST_USER_SUCCESS, REQ_FOR_POST_ZONE_ERROR, REQ_FOR_POST_ZONE_SUCCESS, REQ_FOR_USER_CHANGE_ZONE_ERROR, REQ_FOR_USER_CHANGE_ZONE_SUCCESS } from '../action';
import { delete_adminLocationData, delete_adminRemark, delete_newAttendance, get_adminLocationData, get_adminRemark, get_adminUserdata, get_detailsData_newAttendance, get_details_newAttendance, get_each_newAttendance, get_each_user, get_newAttendance, get_request, get_subzone, get_user, get_zone, patch_adminChangePassword, patch_adminUpdateLocationData, patch_adminUpdateRemark, patch_each_newAttendance, patch_each_user, patch_newAttendance, patch_request, patch_subzone, patch_update_active_status, patch_zone, post_adminLocationData, post_adminRemark, post_masterAttendanceKey, post_masterAttendanceSubmit, post_newAttendance, post_newAttendanceAccess, post_role, post_subzone, post_user, post_zone, userChange_zone } from '../api';








const handleData = (apiDataFunction, SUCCESS, ERROR) => {
    return function* (action) {
        try {
            const res = yield call(apiDataFunction, action.payload);
            const status = res.status;
            const data = res.data;
            if (status === 200) {
                yield put({ type: SUCCESS, data });
            } else {
                yield put({ type: ERROR, data });
            }
        } catch (error) {
            // console.log(error);
            yield put({ type: ERROR, error });
        }
    };
};



export const handleGetUserData = handleData(
    get_adminUserdata,
    REQ_FOR_GET_USERDATA_SUCCESS,
    REQ_FOR_GET_USERDATA_ERROR
);

// Change Password
export const handlePatchChangePassword = handleData(
    patch_adminChangePassword,
    REQ_FOR_PATCH_CHANGEPASSWORD_ADMIN_SUCCESS,
    REQ_FOR_PATCH_CHANGEPASSWORD_ADMIN_ERROR
);




// ********************************** Location Data ***************************************

// POST
export const handlePOSTLocationData = handleData(
    post_adminLocationData,
    REQ_FOR_POST_LOCATION_DATA_ADMIN_SUCCESS,
    REQ_FOR_POST_LOCATION_DATA_ADMIN_ERROR
);

// GET
export const handleGETLocationData = handleData(
    get_adminLocationData,
    REQ_FOR_GET_LOCATION_DATA_ADMIN_SUCCESS,
    REQ_FOR_GET_LOCATION_DATA_ADMIN_ERROR
);
// PATCH
export const handlePATCHLocationData = handleData(
    patch_adminUpdateLocationData,
    REQ_FOR_PATCH_LOCATION_DATA_ADMIN_SUCCESS,
    REQ_FOR_PATCH_LOCATION_DATA_ADMIN_ERROR
);
// DELETE
export const handleDELETELocationData = handleData(
    delete_adminLocationData,
    REQ_FOR_DELETE_LOCATION_DATA_ADMIN_SUCCESS,
    REQ_FOR_DELETE_LOCATION_DATA_ADMIN_ERROR
);


// ********************************** Zone ***************************************

// POST
export const handlePOSTZone = handleData(
    post_zone,
    REQ_FOR_POST_ZONE_SUCCESS,
    REQ_FOR_POST_ZONE_ERROR
);

// GET
export const handleGETZone = handleData(
    get_zone,
    REQ_FOR_GET_ZONE_SUCCESS,
    REQ_FOR_GET_ZONE_ERROR
);
// PATCH
export const handlePATCHZone = handleData(
    patch_zone,
    REQ_FOR_PATCH_ZONE_SUCCESS,
    REQ_FOR_PATCH_ZONE_ERROR
);

// USER CHANGE
export const handleUserChangeZone = handleData(
    userChange_zone,
    REQ_FOR_USER_CHANGE_ZONE_SUCCESS,
    REQ_FOR_USER_CHANGE_ZONE_ERROR
);




// ********************************** SUBZone ***************************************

// POST
export const handlePOSTSubZone = handleData(
    post_subzone,
    REQ_FOR_POST_SUBZONE_SUCCESS,
    REQ_FOR_POST_SUBZONE_ERROR
);

// GET
export const handleGETSubZone = handleData(
    get_subzone,
    REQ_FOR_GET_SUBZONE_SUCCESS,
    REQ_FOR_GET_SUBZONE_ERROR
);
// PATCH
export const handlePATCHSubZone = handleData(
    patch_subzone,
    REQ_FOR_PATCH_SUBZONE_SUCCESS,
    REQ_FOR_PATCH_SUBZONE_ERROR
);





// ********************************** User ***************************************

// POST
export const handlePOSTUser = handleData(
    post_user,
    REQ_FOR_POST_USER_SUCCESS,
    REQ_FOR_POST_USER_ERROR
);
// GET
export const handleGETUser = handleData(
    get_user,
    REQ_FOR_GET_USER_SUCCESS,
    REQ_FOR_GET_USER_ERROR
);
// GET_Each
export const handleGET_EachUser = handleData(
    get_each_user,
    REQ_FOR_GET_EACH_USER_SUCCESS,
    REQ_FOR_GET_EACH_USER_ERROR
);
// PATCH_Each
export const handlePATCH_EachUser = handleData(
    patch_each_user,
    REQ_FOR_PATCH_EACH_USER_SUCCESS,
    REQ_FOR_PATCH_EACH_USER_ERROR
);
// PATCH Active user
export const handlePATCH_ActiveUser = handleData(
    patch_update_active_status,
    REQ_FOR_PATCH_ACTIVE_STATUS_SUCCESS,
    REQ_FOR_PATCH_ACTIVE_STATUS_ERROR
);

// ********************************** Role ***************************************

// POST
export const handlePOSTRole = handleData(
    post_role,
    REQ_FOR_POST_ROLE_USER_SUCCESS,
    REQ_FOR_POST_ROLE_USER_ERROR
);

// ********************************** Request ***************************************

// GET
export const handleGETRequest = handleData(
    get_request,
    REQ_FOR_GET_REQUEST_SUCCESS,
    REQ_FOR_GET_REQUEST_ERROR
);
// PATCH
export const handlePATCHRequest = handleData(
    patch_request,
    REQ_FOR_PATCH_REQUEST_SUCCESS,
    REQ_FOR_PATCH_REQUEST_ERROR
);


// ********************************** Attendance ***************************************



// MASTER ATTENDANCE KEY
// POST
export const handlePOSTmasterAttendanceKey = handleData(
    post_masterAttendanceKey,
    REQ_FOR_POST_MASTER_ATTENDANCE_KEY_SUCCESS,
    REQ_FOR_POST_MASTER_ATTENDANCE_KEY_ERROR
);

// MASTER ATTENDANCE Submit
// POST
export const handlePOSTmasterAttendanceSubmit = handleData(
    post_masterAttendanceSubmit,
    REQ_FOR_POST_MASTER_ATTENDANCE_SUBMIT_SUCCESS,
    REQ_FOR_POST_MASTER_ATTENDANCE_SUBMIT_ERROR
);

// POST
export const handlePOSTnewAttendance = handleData(
    post_newAttendance,
    REQ_FOR_POST_ATTENDANCE_SUCCESS,
    REQ_FOR_POST_ATTENDANCE_ERROR
);
// GET
export const handleGETnewAttendance = handleData(
    get_newAttendance,
    REQ_FOR_GET_ATTENDANCE_SUCCESS,
    REQ_FOR_GET_ATTENDANCE_ERROR
);
// PATCH
export const handlePATCHnewAttendance = handleData(
    patch_newAttendance,
    REQ_FOR_PATCH_ATTENDANCE_SUCCESS,
    REQ_FOR_PATCH_ATTENDANCE_ERROR
);
// DELETE
export const handleDELETEnewAttendance = handleData(
    delete_newAttendance,
    REQ_FOR_DELETE_ATTENDANCE_SUCCESS,
    REQ_FOR_DELETE_ATTENDANCE_ERROR
);

// GETEach
export const handleGETEachnewAttendance = handleData(
    get_each_newAttendance,
    REQ_FOR_GET_EACH_ATTENDANCE_SUCCESS,
    REQ_FOR_GET_EACH_ATTENDANCE_ERROR
);

// PATCHEach
export const handlePATCHEachnewAttendance = handleData(
    patch_each_newAttendance,
    REQ_FOR_PATCH_EACH_ATTENDANCE_SUCCESS,
    REQ_FOR_PATCH_EACH_ATTENDANCE_ERROR
);


// ========== Attendance details ===========
// GET 
export const handleGETDetailsnewAttendance = handleData(
    get_details_newAttendance,
    REQ_FOR_GET_DETAILS_ATTENDANCE_SUCCESS,
    REQ_FOR_GET_DETAILS_ATTENDANCE_ERROR
);

// ========== Attendance details Data ===========
// GET 
export const handleGETDetailsDatanewAttendance = handleData(
    get_detailsData_newAttendance,
    REQ_FOR_GET_DETAILS_DATA_ATTENDANCE_SUCCESS,
    REQ_FOR_GET_DETAILS_DATA_ATTENDANCE_ERROR
);


// ********************************** Attendance Access ***************************************

// POST
export const handlePOSTnewAttendanceAccess = handleData(
    post_newAttendanceAccess,
    REQ_FOR_POST_ATTENDANCE_ACCESS_SUCCESS,
    REQ_FOR_POST_ATTENDANCE_ACCESS_ERROR
);



// ********************************** Location Data ***************************************

// POST
export const handlePOSTRemark = handleData(
    post_adminRemark,
    REQ_FOR_POST_REMARK_ADMIN_SUCCESS,
    REQ_FOR_POST_REMARK_ADMIN_ERROR
);

// GET
export const handleGETRemark = handleData(
    get_adminRemark,
    REQ_FOR_GET_REMARK_ADMIN_SUCCESS,
    REQ_FOR_GET_REMARK_ADMIN_ERROR
);
// PATCH
export const handlePATCHRemark = handleData(
    patch_adminUpdateRemark,
    REQ_FOR_PATCH_REMARK_ADMIN_SUCCESS,
    REQ_FOR_PATCH_REMARK_ADMIN_ERROR
);
// DELETE
export const handleDELETERemark = handleData(
    delete_adminRemark,
    REQ_FOR_DELETE_REMARK_ADMIN_SUCCESS,
    REQ_FOR_DELETE_REMARK_ADMIN_ERROR
);

