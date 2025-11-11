import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import axios from 'axios'
import Cookies from 'js-cookie'
import { adminLogin, base_url } from '../constant/const';
import { alert, btnspinner, spinner } from '../constant/alert';
import Support from './support/Support';

const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    // loader
    const [loader, setLoader] = useState(false)
    // err
    const [err, setErr] = useState('')

    const onSubmit = (data) => {
        // console.log(data);
        setLoader(true)
        const header = {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }
        // console.log(header);
        axios.post(base_url + adminLogin, data, header)
            .then((res) => {
                // console.log(res);
                if (res.status === 200) {
                    // setStatus(true)
                    setLoader(false)
                    localStorage.setItem('user', JSON.stringify(data.adminid));
                    localStorage.setItem('cred', JSON.stringify(data.password));
                    Cookies.set("isAuth", res.data.isAuth, { expires: 1, secure: false, sameSite: 'Strict', })
                    Cookies.set("tkn", res.data.token, { expires: 1, secure: false, sameSite: 'Strict', })
                    Cookies.set("isr", res.data.role, { expires: 1, secure: false, sameSite: 'Strict', })
                    window.location.href = "/"
                }
            })
            .catch((err) => {
                // console.log(err);
                if (err?.response?.status === 301) {
                    setLoader(false)
                    setErr(err.response.data.message || "Opps! Somthing went wrong.")
                } else {
                    setLoader(false)
                    setErr("Opps! Somthing went wrong.")

                }
            })

    }
    return (
        <div className='container-fluid loginPage'>
            <div className='row '>
                <div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12'>
                    <div className='sec1'>
                        <div className='text-center'>
                            Welcome to
                        </div>
                        <div className='text-center satsabha_font'>
                            SAT-Sabha
                        </div>
                        <div className='text-center' style={{ fontSize: '22px' }}>
                            Advance Attendance System
                        </div>
                    </div>
                </div>
                <div className='col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12'>

                    <div className='sec2'>

                        {
                            err !== ''
                                ? alert('danger', `${err}`)
                                : null
                        }


                        <div style={{ fontSize: '26px' }}>World-class design & User Experienced dashboard with SAT-SABHA</div>

                        <div style={{ fontSize: '22px' }} className='mt-5'>Sign In</div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3 my-5">
                                <p>ID <span className='text-danger'>*</span></p>
                                <input
                                    type="text"
                                    className="form-control input_field"
                                    defaultValue={JSON.parse(localStorage.getItem('user'))}
                                    placeholder="Ex:- abc"
                                    {...register("adminid", {
                                        required: true,
                                    })}
                                />
                                <small className="text-danger">{errors.adminid?.type === 'required' && "Mobile number is required!"}</small>
                            </div>
                            <div className="mb-3 mt-4">
                                <p>Password <span className='text-danger'>*</span></p>
                                <input
                                    type="Password"
                                    className="form-control input_field"
                                    placeholder="********"
                                    defaultValue={JSON.parse(localStorage.getItem('cred'))}
                                    {...register("password", {
                                        required: true,
                                        pattern: /^[a-zA-Z0-9@#!._]+$/i,
                                    })}
                                />
                                <small className="text-danger">{errors.password?.type === 'required' && "Passowrd is required!"}</small>
                                <small className="text-danger">{errors.password?.type === 'pattern' && "Sorry! only letters(a-z),numbers(0-9), and (.,@,#,_) are allowed."}</small>
                            </div>
                            {
                                loader === true
                                    ? <button disabled className="btn btn_signin mb-3 mt-3 col-12">{btnspinner()}</button>
                                    : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12">Sign in</button>
                            }

                        </form>

                        <p className='text-center mt-3'>Develop & manage by <a target="_blank" href='https://bitbrains.in'>bitbrains.in</a></p>
                    </div>

                </div>
            </div>

            <Support />
        </div>
    )
}

export default Login