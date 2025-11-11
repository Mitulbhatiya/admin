import { all } from '@redux-saga/core/effects';
import { delete_deleteLocationData_saga, delete_deleteRemark_saga, delete_newAttenddance_saga, get_Subzone_saga, get_detailsData_newAttenddance_saga, get_details_newAttenddance_saga, get_each_newAttenddance_saga, get_each_user_saga, get_getLocationData_saga, get_getRemark_saga, get_newAttenddance_saga, get_request_saga, get_userData_saga, get_user_saga, get_zone_saga, patch_Subzone_saga, patch_active_status_saga, patch_changePassword_saga, patch_each_newAttenddance_saga, patch_each_user_saga, patch_newAttenddance_saga, patch_request_saga, patch_updateLocationData_saga, patch_updateRemark_saga, patch_zone_saga, post_Subzone_saga, post_masterAttendanceKey_saga, post_masterAttendanceSubmit_saga, post_newAttenddanceAccess_saga, post_newAttenddance_saga, post_postLocationData_saga, post_postRemark_saga, post_role_saga, post_user_saga, post_zone_saga, user_change_zone_saga } from './rootAdmin';



export function* rootSaga() {
    yield all([
        // user
        get_userData_saga(),
        // Change Password
        patch_changePassword_saga(),


        // ************* LOCATION DATA *****************
        // POST
        post_postLocationData_saga(),
        // GET
        get_getLocationData_saga(),
        // PATCH
        patch_updateLocationData_saga(),
        // DELETE
        delete_deleteLocationData_saga(),

        // ========== ZONE =========

        post_zone_saga(),
        get_zone_saga(),
        patch_zone_saga(),
        // Chnage users zone
        user_change_zone_saga(),

        // ========== SubZONE =========

        post_Subzone_saga(),
        get_Subzone_saga(),
        patch_Subzone_saga(),

        // ========== USER =============

        post_user_saga(),
        get_user_saga(),
        get_each_user_saga(),
        patch_each_user_saga(),
        // Patch active user status
        patch_active_status_saga(),

        // =========== ROLE =========
        post_role_saga(),

        // ========== Request ==========
        get_request_saga(),
        patch_request_saga(),

        // =========== Attendance =========

        // Matsre attendance key
        post_masterAttendanceKey_saga(),
        // Master attendance submit
        post_masterAttendanceSubmit_saga(),

        post_newAttenddance_saga(),
        get_newAttenddance_saga(),
        patch_newAttenddance_saga(),
        delete_newAttenddance_saga(),

        get_each_newAttenddance_saga(),
        patch_each_newAttenddance_saga(),


        // ============ Attendance detsils =========

        get_details_newAttenddance_saga(),

        // ========== Attendance details data =======
        get_detailsData_newAttenddance_saga(),

        // ============== Attendance Access =========
        post_newAttenddanceAccess_saga(),


        // ************* Remark *****************
        // POST
        post_postRemark_saga(),
        // GET
        get_getRemark_saga(),
        // PATCH
        patch_updateRemark_saga(),
        // DELETE
        delete_deleteRemark_saga(),
    ])
}

