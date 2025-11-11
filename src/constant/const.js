// export const base_url = "http://localhost:3006"

// Use proxy in production (Vercel) to handle CORS issues
// The proxy is available at /api/* and will forward to https://api.satdham.in
// In development, you can use direct API or run 'vercel dev' to use the proxy locally
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname === 'satsabha.satdham.in' || 
   window.location.hostname.includes('vercel.app'))

export const base_url = isProduction ? "/api" : "https://api.satdham.in"
// Admin Login
export const adminLogin = "/login/admin"
// Userdata
export const userData = "/admin/userdata"
// Change Password
export const changePassword = "/admin/update/password"

// ============================ Location Data ===========================

// POST
export const addLocationData = "/admin/add/location"
// GET 
export const getLocationData = "/admin/get/location"
// PATCH 
export const updateLocationData = "/admin/update/location"
// DELETE 
export const deleteLocationData = "/admin/delete/location"
// POST -CSV
export const addLocationByCSV = "/admin/add/locationcsv"

// ============================ Zone ===========================

// POST
export const addZone = "/admin/zone/add"
// GET 
export const getZone = "/admin/zone/get"
// PATCH
export const updateZone = "/admin/zone/update"
// USAER CHANGE
export const userChangeZone = "/admin/zone/userchange"

// ============================ User ===========================

// POST
export const addUser = "/admin/user/add"
// GET
export const getUser = "/admin/user/get"
// GET - Each
export const getEachUser = "/admin/user/get/each"
// PATCH - Each
export const updateEachUser = "/admin/user/update/each"
// PATCH change Active status
export const updateActiveStatus = "/admin/user/update/active"

// Reset password
export const resetPasswordUrl = "/admin/user/password/reset"
// ============================ Role ===========================

// POST
export const updateRole = "/admin/user/role/update"

// ============================ Request ===========================

// GET
export const getRequest = "/admin/request/get"
export const updateRequest = "/admin/request/update"


// =================== Attendance ===================

export const newAttendance = "/admin/attendance/add"
export const getAttendance = "/admin/attendance/get"
export const updateAttendance = "/admin/attendance/update"
export const deleteAttendance = "/admin/attendance/delete"

export const getEachAttendance = "/admin/attendance/get/each"
export const updateEachAttendance = "/admin/attendance/update/each"

// get all atdetails (Attendace details)
export const getAttendanceDetails = "/admin/attendance/details/get"
// Get all atendance data (for analysis in attendance page)
export const getAttendanceDetailsData = "/admin/attendance/details/data/get"

// Generate master attendance key
export const generateMasterAtKet = "/admin/attendance/master/key"
export const submitMasterAttendance = "/admin/attendance/master/submit"

// =================== Attendance Access ===================

export const newAttendanceAccess = "/admin/attendance/access"


// ============================ Zone ===========================

// POST
export const addsubZone = "/admin/subzone/add"
// GET 
export const getsubZone = "/admin/subzone/get"
// PATCH
export const updatesubZone = "/admin/subzone/update"


// ============================ Remark ===========================

// POST
export const addRemark = "/admin/add/remark"
// GET 
export const getRemark = "/admin/get/remark"
// PATCH 
export const updateRemark = "/admin/update/remark"
// DELETE 
export const deleteRemark = "/admin/delete/remark"
