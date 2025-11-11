import { takeLatest } from '@redux-saga/core/effects';
import {
    REQ_FOR_DELETE_ATTENDANCE_PROGRESS,
    REQ_FOR_DELETE_LOCATION_DATA_ADMIN_PROGRESS,
    REQ_FOR_DELETE_REMARK_ADMIN_PROGRESS,
    REQ_FOR_GET_ATTENDANCE_PROGRESS,
    REQ_FOR_GET_DETAILS_ATTENDANCE_PROGRESS,
    REQ_FOR_GET_DETAILS_DATA_ATTENDANCE_PROGRESS,
    REQ_FOR_GET_EACH_ATTENDANCE_PROGRESS,
    REQ_FOR_GET_EACH_USER_PROGRESS,
    REQ_FOR_GET_LOCATION_DATA_ADMIN_PROGRESS,
    REQ_FOR_GET_REMARK_ADMIN_PROGRESS,
    REQ_FOR_GET_REQUEST_PROGRESS,
    REQ_FOR_GET_SUBZONE_PROGRESS,
    REQ_FOR_GET_USERDATA_PROGRESS, REQ_FOR_GET_USER_PROGRESS, REQ_FOR_GET_ZONE_PROGRESS, REQ_FOR_PATCH_ACTIVE_STATUS_PROGRESS, REQ_FOR_PATCH_ATTENDANCE_PROGRESS, REQ_FOR_PATCH_CHANGEPASSWORD_ADMIN_PROGRESS, REQ_FOR_PATCH_EACH_ATTENDANCE_PROGRESS, REQ_FOR_PATCH_EACH_USER_PROGRESS, REQ_FOR_PATCH_LOCATION_DATA_ADMIN_PROGRESS, REQ_FOR_PATCH_REMARK_ADMIN_PROGRESS, REQ_FOR_PATCH_REQUEST_PROGRESS, REQ_FOR_PATCH_SUBZONE_PROGRESS, REQ_FOR_PATCH_ZONE_PROGRESS, REQ_FOR_POST_ATTENDANCE_ACCESS_PROGRESS, REQ_FOR_POST_ATTENDANCE_PROGRESS, REQ_FOR_POST_LOCATION_DATA_ADMIN_PROGRESS, REQ_FOR_POST_MASTER_ATTENDANCE_KEY_PROGRESS, REQ_FOR_POST_MASTER_ATTENDANCE_SUBMIT_PROGRESS, REQ_FOR_POST_REMARK_ADMIN_PROGRESS, REQ_FOR_POST_ROLE_USER_PROGRESS, REQ_FOR_POST_SUBZONE_PROGRESS, REQ_FOR_POST_USER_PROGRESS, REQ_FOR_POST_ZONE_PROGRESS, REQ_FOR_USER_CHANGE_ZONE_PROGRESS
} from '../action';
import {
    handleDELETELocationData,
    handleDELETERemark,
    handleDELETEnewAttendance,
    handleGETDetailsDatanewAttendance,
    handleGETDetailsnewAttendance,
    handleGETEachnewAttendance,
    handleGETLocationData,
    handleGETRemark,
    handleGETRequest,
    handleGETSubZone,
    handleGETUser,
    handleGETZone,
    handleGET_EachUser,
    handleGETnewAttendance,
    handleGetUserData, handlePATCHEachnewAttendance, handlePATCHLocationData, handlePATCHRemark, handlePATCHRequest, handlePATCHSubZone, handlePATCHZone, handlePATCH_ActiveUser, handlePATCH_EachUser, handlePATCHnewAttendance, handlePOSTLocationData, handlePOSTRemark, handlePOSTRole, handlePOSTSubZone, handlePOSTUser, handlePOSTZone, handlePOSTmasterAttendanceKey, handlePOSTmasterAttendanceSubmit, handlePOSTnewAttendance, handlePOSTnewAttendanceAccess, handlePatchChangePassword, handleUserChangeZone
} from './admin';






const rootSaga = (SAGA_PROGRESS, manageFunction) => {
    return function* () {
        yield takeLatest(SAGA_PROGRESS, manageFunction);
    };
};



// GET - USER DATA
export const get_userData_saga = rootSaga(REQ_FOR_GET_USERDATA_PROGRESS, handleGetUserData);
// ChangePassword
export const patch_changePassword_saga = rootSaga(REQ_FOR_PATCH_CHANGEPASSWORD_ADMIN_PROGRESS, handlePatchChangePassword);

// *************************** LOCATION DATA ****************************

// POST
export const post_postLocationData_saga = rootSaga(REQ_FOR_POST_LOCATION_DATA_ADMIN_PROGRESS, handlePOSTLocationData);
// GET
export const get_getLocationData_saga = rootSaga(REQ_FOR_GET_LOCATION_DATA_ADMIN_PROGRESS, handleGETLocationData);
// PATCH
export const patch_updateLocationData_saga = rootSaga(REQ_FOR_PATCH_LOCATION_DATA_ADMIN_PROGRESS, handlePATCHLocationData);
// DELETE
export const delete_deleteLocationData_saga = rootSaga(REQ_FOR_DELETE_LOCATION_DATA_ADMIN_PROGRESS, handleDELETELocationData);


// *************************** ZONE ****************************

// POST
export const post_zone_saga = rootSaga(REQ_FOR_POST_ZONE_PROGRESS, handlePOSTZone);
// GET
export const get_zone_saga = rootSaga(REQ_FOR_GET_ZONE_PROGRESS, handleGETZone);
// PATCH
export const patch_zone_saga = rootSaga(REQ_FOR_PATCH_ZONE_PROGRESS, handlePATCHZone);
// USER CHANGE
export const user_change_zone_saga = rootSaga(REQ_FOR_USER_CHANGE_ZONE_PROGRESS, handleUserChangeZone);

// *************************** SubZONE ****************************

// POST
export const post_Subzone_saga = rootSaga(REQ_FOR_POST_SUBZONE_PROGRESS, handlePOSTSubZone);
// GET
export const get_Subzone_saga = rootSaga(REQ_FOR_GET_SUBZONE_PROGRESS, handleGETSubZone);
// PATCH
export const patch_Subzone_saga = rootSaga(REQ_FOR_PATCH_SUBZONE_PROGRESS, handlePATCHSubZone);

// *************************** USER ****************************

// POST
export const post_user_saga = rootSaga(REQ_FOR_POST_USER_PROGRESS, handlePOSTUser);
// GET
export const get_user_saga = rootSaga(REQ_FOR_GET_USER_PROGRESS, handleGETUser);
// GET EACH
export const get_each_user_saga = rootSaga(REQ_FOR_GET_EACH_USER_PROGRESS, handleGET_EachUser);
// PATCH EACH
export const patch_each_user_saga = rootSaga(REQ_FOR_PATCH_EACH_USER_PROGRESS, handlePATCH_EachUser);
// PATCH Active user
export const patch_active_status_saga = rootSaga(REQ_FOR_PATCH_ACTIVE_STATUS_PROGRESS, handlePATCH_ActiveUser);

// *************************** ROle ****************************

// POST
export const post_role_saga = rootSaga(REQ_FOR_POST_ROLE_USER_PROGRESS, handlePOSTRole);

// *************************** REQUEST ****************************

// GET
export const get_request_saga = rootSaga(REQ_FOR_GET_REQUEST_PROGRESS, handleGETRequest);
// PATCH
export const patch_request_saga = rootSaga(REQ_FOR_PATCH_REQUEST_PROGRESS, handlePATCHRequest);

// *************************** Attendance ****************************

// POST - MASTER ATTENDANCE KEY
export const post_masterAttendanceKey_saga = rootSaga(REQ_FOR_POST_MASTER_ATTENDANCE_KEY_PROGRESS, handlePOSTmasterAttendanceKey);

// POST - MASTER ATTENDANCE KEY
export const post_masterAttendanceSubmit_saga = rootSaga(REQ_FOR_POST_MASTER_ATTENDANCE_SUBMIT_PROGRESS, handlePOSTmasterAttendanceSubmit);

// POST
export const post_newAttenddance_saga = rootSaga(REQ_FOR_POST_ATTENDANCE_PROGRESS, handlePOSTnewAttendance);
// GET
export const get_newAttenddance_saga = rootSaga(REQ_FOR_GET_ATTENDANCE_PROGRESS, handleGETnewAttendance);
// PATCH
export const patch_newAttenddance_saga = rootSaga(REQ_FOR_PATCH_ATTENDANCE_PROGRESS, handlePATCHnewAttendance);
// GET
export const delete_newAttenddance_saga = rootSaga(REQ_FOR_DELETE_ATTENDANCE_PROGRESS, handleDELETEnewAttendance);
// GET EACH
export const get_each_newAttenddance_saga = rootSaga(REQ_FOR_GET_EACH_ATTENDANCE_PROGRESS, handleGETEachnewAttendance);
// PTCH EACH
export const patch_each_newAttenddance_saga = rootSaga(REQ_FOR_PATCH_EACH_ATTENDANCE_PROGRESS, handlePATCHEachnewAttendance);

// *************************** Attendance details ****************************
// GET
export const get_details_newAttenddance_saga = rootSaga(REQ_FOR_GET_DETAILS_ATTENDANCE_PROGRESS, handleGETDetailsnewAttendance);

// *************************** Attendance details Data ****************************
// GET
export const get_detailsData_newAttenddance_saga = rootSaga(REQ_FOR_GET_DETAILS_DATA_ATTENDANCE_PROGRESS, handleGETDetailsDatanewAttendance);


// *************************** Attendance Access ****************************

// POST
export const post_newAttenddanceAccess_saga = rootSaga(REQ_FOR_POST_ATTENDANCE_ACCESS_PROGRESS, handlePOSTnewAttendanceAccess);


// *************************** Remark****************************

// POST
export const post_postRemark_saga = rootSaga(REQ_FOR_POST_REMARK_ADMIN_PROGRESS, handlePOSTRemark);
// GET
export const get_getRemark_saga = rootSaga(REQ_FOR_GET_REMARK_ADMIN_PROGRESS, handleGETRemark);
// PATCH
export const patch_updateRemark_saga = rootSaga(REQ_FOR_PATCH_REMARK_ADMIN_PROGRESS, handlePATCHRemark);
// DELETE
export const delete_deleteRemark_saga = rootSaga(REQ_FOR_DELETE_REMARK_ADMIN_PROGRESS, handleDELETERemark);
