import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { REQ_FOR_PATCH_CHANGEPASSWORD_ADMIN_PROGRESS } from '../../redux/action';
import { alert, btnspinner } from '../../constant/alert';

const ChangePassword = () => {
    const dispatch = useDispatch()
    const adminuser = useSelector(state => state.adminReducer)

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [passwordMatch, setpasswordMatch] = useState("")

    // Success/err message
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [status, setStatus] = useState('')
    const handleButtonClick = () => {
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 5000);
    }

    if (adminuser.patch_changePassword_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
        setValue('oldPassword', '')
        setValue('newPassword', '')
        setValue('confirmPassword', '')
    }

    const onSubmit = (dataa) => {
        if (dataa.newPassword !== dataa.confirmPassword) {
            setpasswordMatch("New password and confirm new password are not matched!")
        } else {
            setStatus(true)
            setpasswordMatch("")
            const data = {
                oldPassword: dataa.oldPassword,
                newPassword: dataa.newPassword
            }
            dispatch({ type: REQ_FOR_PATCH_CHANGEPASSWORD_ADMIN_PROGRESS, payload: { data } })
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {
                    isAlertVisible
                        ? alert('success', 'Password updated successfully 😊')
                        : ""
                }
                {
                    adminuser.patch_changePassword_error === true
                        ? <div className="alert alert-danger fade show mt-3" role="alert">
                            <strong> ⚠️ Opps,</strong>Invalid authentication!!
                        </div>
                        : ""
                }
                {
                    passwordMatch !== ""
                        ? <div className="alert alert-danger fade show mt-3" role="alert">
                            <strong> ⚠️ Opps,</strong> {passwordMatch}
                        </div>
                        : ""
                }

                <div className="mb-3 mt-3">
                    <p><span className='text-danger'>*</span>Old password</p>
                    <input
                        type="text"
                        className="form-control input_field"
                        placeholder="*******"
                        {...register("oldPassword", {
                            required: true,
                            pattern: /^[a-zA-Z0-9@=*._-]+$/i,
                        })}
                    />
                    <small className="text-danger">{errors.oldPassword?.type === 'required' && "Old Password is required!"}</small>
                    <small className="text-danger">{errors.oldPassword?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                </div>
                <div className="mb-3 mt-3">
                    <p><span className='text-danger'>*</span>New password</p>
                    <input
                        type="text"
                        className="form-control input_field"
                        placeholder="*******"
                        {...register("newPassword", {
                            required: true,
                            pattern: /^[a-zA-Z0-9@=*._-]+$/i,
                        })}
                    />
                    <small className="text-danger">{errors.newPassword?.type === 'required' && "New Password is required!"}</small>
                    <small className="text-danger">{errors.newPassword?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                </div>
                <div className="mb-3 mt-3">
                    <p><span className='text-danger'>*</span>Confirm new password</p>
                    <input
                        type="text"
                        className="form-control input_field"
                        placeholder="*******"
                        {...register("confirmPassword", {
                            required: true,
                            pattern: /^[a-zA-Z0-9@=*._-]+$/i,
                        })}
                    />
                    <small className="text-danger">{errors.confirmPassword?.type === 'required' && " Confirm new Password is required!"}</small>
                    <small className="text-danger">{errors.confirmPassword?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                </div>

                {
                    adminuser.patch_changePassword_progress === true
                        ? <button disabled className="btn btn_signin mb-3 mt-3 col-12">{btnspinner()}</button>
                        : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12">Update</button>
                }

            </form>
        </>
    )
}

export default ChangePassword