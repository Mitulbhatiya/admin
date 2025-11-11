import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { REQ_FOR_PATCH_EACH_USER_PROGRESS } from '../../redux/action'
import { alert, btnspinner } from '../../constant/alert'
import userImg from '../assets/user.png'

const DetailsUpdate = () => {
    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();

    const [updateProfilePhotoStatus, setUpdateProfilePhotoStatus] = useState(false)

    const getTimeFunction = (dd) => {
        const utcTimestamp = dd; // Note the 'Z' at the end, indicating UTC
        const utcDate = new Date(utcTimestamp);
        const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // 5.5 hours in milliseconds
        // Date
        var istDateString = istDate.toISOString();
        istDateString = istDateString.split("T")[0].split("-")[2] + "-" + istDateString.split("T")[0].split("-")[1] + "-" + istDateString.split("T")[0].split("-")[0]
        // This gives you the IST timestamp
        const date = new Date(utcTimestamp);
        date.setHours(date.getHours());
        date.setMinutes(date.getMinutes());
        // Time
        const istTime = date.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        return {
            istTime,
            istDateString
        }
    }

    // Success/err message
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [status, setStatus] = useState('')
    const handleButtonClick = () => {
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 4000);
    }

    if (adminReducer.patch_each_user_success === true && status === true) {
        setStatus(false)
        handleButtonClick()

        // document.getElementById('closeModelAddUsers').click()
    }

    const onSubmit = (dataa) => {
        setStatus(true)
        if (updateProfilePhotoStatus === true) {
            const finalDatas = {
                ID: adminReducer?.user?.userData?.ID,
                firstname: dataa.firstname,
                middlename: dataa.middlename,
                lastname: dataa.lastname,
                gender: dataa.gender,
                district: dataa.district === "" ? "NULL" : dataa.district,
                taluka: dataa.taluka === "" ? "NULL" : dataa.taluka,
                village: dataa.village === "" ? "NULL" : dataa.village,
                mobile: dataa.mobile,
                address: dataa.address === "" ? "NULL" : dataa.address,
                zone: dataa.zone,
                subzone: dataa.subzone,
                vistar: dataa.vistar,
                updateProfile: "updateWithProfile",
                profileurl: adminReducer?.user?.userData?.profileurl
            }
            const data = new FormData()
            data.append('json', JSON.stringify(finalDatas))
            data.append('profile', dataa.profile[0])
            dispatch({ type: REQ_FOR_PATCH_EACH_USER_PROGRESS, payload: { data } })
        } else {
            const finalDatas = {
                ID: adminReducer?.user?.userData?.ID,
                firstname: dataa.firstname,
                middlename: dataa.middlename,
                lastname: dataa.lastname,
                gender: dataa.gender,
                district: dataa.district === "" ? "NULL" : dataa.district,
                taluka: dataa.taluka === "" ? "NULL" : dataa.taluka,
                village: dataa.village === "" ? "NULL" : dataa.village,
                mobile: dataa.mobile,
                address: dataa.address === "" ? "NULL" : dataa.address,
                zone: dataa.zone,
                subzone: dataa.subzone,
                vistar: dataa.vistar,
                updateProfile: "updateWithOutProfile",

            }
            const data = new FormData()
            data.append('json', JSON.stringify(finalDatas))
            // console.log(data);

            dispatch({ type: REQ_FOR_PATCH_EACH_USER_PROGRESS, payload: { data } })
        }
    }

    const [selectedsubzone, setselectedsubzone] = useState(adminReducer?.user?.userData?.zone)
    let subzone = []
    subzone.push({ ID: '0', zoneID: selectedsubzone })
    adminReducer.subzone?.map((value) => {
        if (value.zoneID === selectedsubzone) {
            subzone.push(value)
        }
    })

    return (
        <>

            <form onSubmit={handleSubmit(onSubmit)} enctype="multipart/form-data">
                {
                    isAlertVisible
                        ? alert('success', 'User updated successfully 😊')
                        : ""
                }
                {
                    adminReducer.patch_each_user_error === true
                        ? <div className="alert alert-danger fade show mt-3" role="alert">
                            <strong> ⚠️ Opps,</strong>Something went wrong!
                        </div>
                        : ""
                }
                <div className='row mt-3 profile'>
                    <div className='col-12 col-sm-12 col-md-3 col-lg-3 col-xl-2'>
                        <div>
                            {
                                adminReducer?.user?.userData.profilePhotoStatus === false
                                    ? <img
                                        className='img-fluid'
                                        src={userImg}
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            borderRadius: '50%'
                                        }}
                                    />
                                    : <img
                                        className='img-fluid'
                                        src={`https://dzhov20ss4n5i.cloudfront.net/${adminReducer?.user?.userData?.profileurl}`}
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            borderRadius: '50%'
                                        }}
                                    />
                            }

                        </div>
                    </div>
                    <div className='col-12 col-sm-12 col-md-9 col-lg-9 col-xl-10'>
                        <div className='row'>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>UID 🙎</small>
                                <h4 className="user_profile_details_text">
                                    {adminReducer?.user?.userData?.ID}
                                </h4>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>Zone<span className='text-danger'>*</span> </small>
                                <select
                                    className="form-control input_field"
                                    defaultValue={adminReducer?.user?.userData?.zone}
                                    {...register("zone", {
                                        required: true,
                                    })}
                                    onChange={e => setselectedsubzone(e.target.value)}
                                    style={{ backgroundColor: 'transparent' }}
                                >
                                    <option value="">Tap to select</option>
                                    {
                                        adminReducer.zone.map((value, index) => {
                                            return (
                                                <option value={value.ID} key={index}>{value.ID.split('Z')[1]} - {value.name} - {value.pincode}</option>
                                            )
                                        })
                                    }
                                </select>
                                <small className="text-danger">{errors.zone?.type === 'required' && "Zone is required!"}</small>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>SubZone<span className='text-danger'>*</span> </small>
                                <select
                                    className="form-control input_field"
                                    defaultValue={adminReducer?.user?.userData?.subzone}
                                    {...register("subzone", {
                                        required: true,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                >
                                    <option value="">Tap to select</option>
                                    {
                                        subzone.map((value, index) => {
                                            return (
                                                <option value={value.ID} key={index}>{value.ID}</option>
                                            )
                                        })
                                    }
                                </select>
                                <small className="text-danger">{errors.subzone?.type === 'required' && "Subzone is required!"}</small>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>Vistar<span className='text-danger'>*</span> </small>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    defaultValue={adminReducer?.user?.userData?.vistar}
                                    {...register("vistar", {
                                        required: true,
                                        pattern: /^[a-zA-Z0-9@=,*._-\s]+$/i,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                                <small className="text-danger">{errors.vistar?.type === 'required' && "Vistar is required!"}</small>
                                <small className="text-danger">{errors.vistar?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>

                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>Lastname<span className='text-danger'>*</span> </small>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    defaultValue={adminReducer?.user?.userData?.lastname}
                                    {...register("lastname", {
                                        required: true,
                                        pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                                <small className="text-danger">{errors.lastname?.type === 'required' && "Last name is required!"}</small>
                                <small className="text-danger">{errors.lastname?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>

                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>Firstname<span className='text-danger'>*</span> </small>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    defaultValue={adminReducer?.user?.userData?.firstname}
                                    {...register("firstname", {
                                        required: true,
                                        pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                                <small className="text-danger">{errors.firstname?.type === 'required' && "First name is required!"}</small>
                                <small className="text-danger">{errors.firstname?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>

                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mt-3'>
                                <small>Middlename<span className='text-danger'>*</span> </small>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    defaultValue={adminReducer?.user?.userData?.middlename}
                                    {...register("middlename", {
                                        required: true,
                                        pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                                <small className="text-danger">{errors.middlename?.type === 'required' && "Middle name is required!"}</small>
                                <small className="text-danger">{errors.middlename?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>

                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2 mt-3'>
                                <small>Gender<span className='text-danger'>*</span> </small>
                                <select
                                    className="form-control input_field"
                                    defaultValue={adminReducer?.user?.userData?.gender}
                                    {...register("gender", {
                                        required: true,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                >
                                    <option value="">Tap to select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>

                                </select>
                                <small className="text-danger">{errors.gender?.type === 'required' && "Gender is required!"}</small>
                            </div>
                        </div>
                        <hr className='my-4' />
                        <div className='row'>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>District </small>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    defaultValue={adminReducer?.user?.userData?.district === "NULL" ? "" : adminReducer?.user?.userData?.district}
                                    {...register("district", {
                                        pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                                <small className="text-danger">{errors.district?.type === 'required' && "District is required!"}</small>
                                <small className="text-danger">{errors.district?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>Taluka </small>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    defaultValue={adminReducer?.user?.userData?.taluka === "NULL" ? "" : adminReducer?.user?.userData?.taluka}
                                    {...register("taluka", {
                                        pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                                <small className="text-danger">{errors.taluka?.type === 'required' && "Taluka is required!"}</small>
                                <small className="text-danger">{errors.taluka?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>Village</small>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    defaultValue={adminReducer?.user?.userData?.village === "NULL" ? "" : adminReducer?.user?.userData?.village}
                                    {...register("village", {
                                        // required: true,
                                        pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                                <small className="text-danger">{errors.village?.type === 'required' && "Village is required!"}</small>
                                <small className="text-danger">{errors.village?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>

                                <small>Mobile<span className='text-danger'>*</span> </small>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    defaultValue={adminReducer?.user?.userData?.mobile}
                                    {...register("mobile", {
                                        required: true,
                                        pattern: /^[0-9]+$/i,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                                <small className="text-danger">{errors.mobile?.type === 'required' && "Mobile number is required!"}</small>
                                <small className="text-danger">{errors.mobile?.type === 'pattern' && "Sorry! only numbers(0-9) are allowed."}</small>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>Role </small>
                                <h4 className="user_profile_details_text">
                                    {adminReducer?.user?.userData?.role === "zonesubadmin" ? "Sub-admin" : adminReducer?.user?.userData?.role}
                                </h4>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>Attendance access </small>
                                <h4 className="user_profile_details_text">
                                    {adminReducer?.user?.userData?.attendancePermission === false ? "False" : "True"}
                                </h4>
                            </div>
                        </div>
                        <hr className='my-3' />
                        <div className='row'>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>Joining date </small>
                                <h4 className="user_profile_details_text">
                                    {getTimeFunction(adminReducer?.user?.userData?.createdAt).istDateString} <br />  {getTimeFunction(adminReducer?.user?.userData?.createdAt).istTime}
                                </h4>
                            </div>
                            <div className='col-6 col-sm-6 col-md-6 col-lg-3 col-xl-2'>
                                <small>Attendance 🙋‍♂️ </small>
                                <h4 className="user_profile_details_text">
                                    {adminReducer?.user?.userData?.attendance}%
                                </h4>
                            </div>
                            <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-8'>
                                <small>Address </small>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    placeholder="*******"
                                    defaultValue={adminReducer?.user?.userData?.address === "NULL" ? "" : adminReducer?.user?.userData?.address}
                                    {...register("address", {
                                        // required: true,
                                        pattern: /^[A-Za-z0-9,-\s]+$/,
                                    })}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                                <small className="text-danger">{errors.address?.type === 'required' && "Address is required!"}</small>
                                <small className="text-danger">{errors.address?.type === 'pattern' && "Sorry! only letters(A-Z,a-z),0-9,-,comma are allowed."}</small>
                            </div>
                        </div>
                        <div className='mt-4'>
                            <small>Do you want to update profile photo?<span className='text-danger'>*</span></small>
                            <div>
                                <input
                                    type='radio'
                                    name='isLcoalituUpdate'
                                    checked={updateProfilePhotoStatus === true}
                                    onClick={() => {
                                        setUpdateProfilePhotoStatus(true)
                                    }}
                                /> &nbsp;<span>Yes</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <input
                                    type='radio'
                                    defaultChecked
                                    name='isLcoalituUpdate'
                                    checked={updateProfilePhotoStatus === false}
                                    onClick={() => setUpdateProfilePhotoStatus(false)}
                                /> &nbsp;<span>No</span>
                            </div>
                            {
                                updateProfilePhotoStatus === true
                                    ? <>
                                        <p className='mt-4'>Update Profile photo</p>
                                        <input
                                            type="file"
                                            className="form-control input_field"
                                            {...register("profile", {
                                                required: true,
                                                validate: {
                                                    lessThan10MB: files => files[0]?.size < 1000000 || 'Max 1 MB',
                                                },
                                            })}
                                            style={{ backgroundColor: 'transparent' }}
                                        />
                                        <small className="text-danger">{errors.profile?.type === 'required' && "Profile is required!"}</small>
                                        {errors.profile && <span className="text-danger">{errors.profile.message}</span>}
                                    </>
                                    : ""
                            }
                        </div>
                        {
                            adminReducer.patch_each_user_progress === true
                                ? <button disabled className="btn btn_signin mb-3 mt-5 col-6 col-lg-2">{btnspinner()}</button>
                                : <button type="submit" className="btn btn_signin mb-3 mt-5 col-6 col-lg-2">Update</button>
                        }

                    </div>
                </div>
            </form>
        </>
    )
}

export default DetailsUpdate