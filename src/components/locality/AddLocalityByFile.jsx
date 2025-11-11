import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import icon_csv from '../assets/icon_csv.svg'
import icon_upload from '../assets/icon_upload.svg'
import Cookies from 'js-cookie';
import { addLocationByCSV, base_url } from '../../constant/const';
import axios from 'axios';
const AddLocalityByFile = () => {

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [err, setErr] = useState("")
    const [status, setStatus] = useState(false)
    // For All File Upload (If you have serious chnaged then change it otherwise do not change it)
    const wrapperRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [fileErr, setFileErr] = useState("")

    const onDragEnter = () => wrapperRef.current.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current.classList.remove('dragover');
    const onDrop = () => wrapperRef.current.classList.remove('dragover');

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            if (newFile.type === 'text/csv') {
                const updatedList = [newFile];
                setFileList(updatedList);
            }
            else {
                setFileErr("Only CSV file allowed!")
            }
        }
    }

    const fileRemove = () => {
        setFileList([]);
    }
    const onSubmit = (value) => {
        setStatus(true)
        const formData = new FormData();
        formData.append('locationCSV', fileList[0])
        const header = {
            'Content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'multipart/form-data',
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
            "Authorization": "Bearer " + Cookies.get('tkn'),
            "isauth": Cookies.get('isAuth') || "",
            "isr": Cookies.get('isr') || ""
        }
        axios.post(base_url + addLocationByCSV, formData, header)
            .then((res) => {
                setErr("")
                if (res.status === 200) {
                    setStatus(false)
                    window.location.reload()
                }
            })
            .catch((err) => {

                if (err.response.status === 404) {
                    Cookies.remove('isr')
                    Cookies.remove('isAuth')
                    Cookies.remove('tkn')
                    window.location.href = "/"
                } else {
                    setStatus(false)
                    setErr("Something went wrong, please refresh and try again, else contact developer.")
                }
            })

    }
    // //console.log(fileList, "This is uploadcsv location")
    // File Upload Logic Section End------------

    return (
        <>
            {/* This is for file Uploding Section */}
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <p className='text-danger'>{err}</p>
                <div className='file_upload_for_all '>
                    {
                        fileList.length === 0 ? (
                            <>
                                <div
                                    ref={wrapperRef}
                                    className="drop-file-input"
                                    onDragEnter={onDragEnter}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                >
                                    <div className="drop-file-input__label">
                                        <img src={icon_upload} alt="" />
                                        <p>Drag & Drop your files here</p>
                                        <p>Only CSV File!<span className='text-danger'> *</span></p>
                                    </div>
                                    <input type="file"
                                        name='file'
                                        {
                                        ...register("file", {
                                            required: true
                                        })
                                        }
                                        onChange={onFileDrop}
                                    />
                                </div>
                                <span className='text-danger'>{fileErr}</span>
                                <span className="text-danger">{errors.file?.type === 'required' && "File is required!"}</span>
                            </>
                        ) : null
                    }

                    {
                        fileList.length > 0 ? (
                            <div className="drop-file-preview">
                                <p className="drop-file-preview__title">
                                    Ready to upload
                                </p>
                                {
                                    fileList.map((item, index) => (
                                        <div key={index} className="drop-file-preview__item">
                                            <img src={icon_csv} alt="" />
                                            <div className="drop-file-preview__item__info">
                                                <p>{item.name}</p>
                                                <p>{(item.size / 1048576).toFixed(0)} MB</p>
                                            </div>
                                            <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>x</span>
                                        </div>
                                    ))
                                }
                            </div>
                        ) : null
                    }
                </div>
                {/* End of File Uploading Section */}
                {
                    status === true
                        ? <button className="btn btn_signin mb-3 mt-3" disabled>Uploading..</button>
                        : <button type="submit" className="btn btn_signin mb-3 mt-3">Upload</button>
                }

            </form>
        </>
    )
}

export default AddLocalityByFile