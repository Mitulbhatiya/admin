import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { REQ_FOR_POST_USER_PROGRESS, REQ_FOR_POST_ZONE_PROGRESS } from '../../redux/action';
import { alert, btnspinner } from '../../constant/alert';

import Avatar from 'react-avatar-edit'
import { addUser, base_url } from '../../constant/const';
import Cookies from 'js-cookie';
import axios from 'axios';


import AvatarEditor from 'react-avatar-editor'

const AddUse = () => {

    const dispatch = useDispatch()
    const adminReducer = useSelector(state => state.adminReducer)

    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();

    const [imgPreview, setImgPreview] = useState('')
    const [imgFile, setImgFile] = useState('')
    const [imgErr, setimgErr] = useState('')


    // ===================== For image =======================


    const [image, setImage] = React.useState(null);
    const [scale, setScale] = useState(1)
    const [previewLink, setpreviewLink] = useState("")

    const editorRef = React.useRef()

    const preview = async () => {
        const canvaImage = editorRef.current.getImage()
        // console.log(canvaImage);
        canvaImage.toBlob((blob) => {
            const previewURL = URL.createObjectURL(blob)


            setpreviewLink(previewURL);
            // console.log(previewURL);

            // Fetch the blob data asynchronously
            fetch(previewURL)
                .then(response => response.blob())
                .then(blob => {
                    // Create a file object from the blob data
                    let file = new File([blob], "test.png", { type: 'image/png' });
                    // console.log(file);


                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        // console.log(reader.result);
                    };
                    reader.onerror = function (error) {
                        // console.log('Error: ', error);
                    };

                    // Now you can use the file object as needed, for example, you can save it or perform further operations
                })
                .catch(error => {
                    // console.error('Error fetching blob:', error);
                });


            // setpreviewLink(previewURL)
            // console.log(previewURL);
            // // dataURLtoFile(previewURL, "abc.png")
            // let response = fetch(previewURL);
            // console.log(response);
            // let data = previewURL
            // let metadata = {
            //     type: 'image/png'
            // };
            // let file = new File([data], "test.png", metadata);
            // console.log(file);

        })
        // setCanvas(canvaImage)
    }
    // =========================================

    // Success/err message
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [status, setStatus] = useState('')
    const handleButtonClick = () => {
        setIsAlertVisible(true);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 3000);
    }

    if (adminReducer.post_user_success === true && status === true) {
        setStatus(false)
        handleButtonClick()
        reset()
        setImgPreview('')
        setImage(null)
        setImgFile('')
        // document.getElementById('closeModelAddUsers').click()
    }


    // Selected Zone
    const [selectedzone, setselectedzone] = useState('')
    const handleChangeSelectedZone = (e) => {
        setselectedzone(e.target.value);
    };
    // console.log(selectedzone)

    const handleChangeForImg = (e) => {
        if (e.target.files.length > 0) {
            setImgFile(e.target.files[0])
            setImage(e.target.files[0])
            setImgPreview(URL.createObjectURL(e.target.files[0]))
        }
        else {
            setImgPreview("")
            setImgFile("")
        }
    }

    const onSubmit = (dataa) => {
        // console.log(dataa);
        const finalDatas = {
            firstname: dataa.firstname,
            middlename: dataa.middlename,
            lastname: dataa.lastname,
            district: dataa.district === "" ? "NULL" : dataa.district,
            taluka: dataa.taluka === "" ? "NULL" : dataa.taluka,
            village: dataa.village === "" ? "NULL" : dataa.village,
            zone: dataa.zone,
            subzone: dataa.subzone,
            vistar: dataa.vistar,
            gender: dataa.gender,
            mobile: dataa.mobile,
            address: dataa.address === "" ? "NULL" : dataa.address,
            birthdate: dataa.birthdate,
            imgStatus: imgFile !== "" ? true : false
        }
        // console.log(finalDatas, imgFile);
        const data = new FormData()
        data.append('json', JSON.stringify(finalDatas))
        // console.log(fileList);
        let i = 0
        if (imgFile !== "") {
            // let filee = ""
            // const canvaImage = editorRef.current.getImage()
            // canvaImage.toBlob((blob) => {
            //     const previewURL = URL.createObjectURL(blob)

            //     setpreviewLink(previewURL);

            //     // Fetch the blob data asynchronously
            //     fetch(previewURL)
            //         .then(response => response.blob())
            //         .then(blob => {
            //             // Create a file object from the blob data
            //             filee = new File([blob], "test.png", { type: 'image/png' });
            //             // console.log(file);
            //             // data.append('profile', imgFile)

            //         })
            //         .catch(error => {
            //             console.error('Error fetching blob:', error);
            //         });

            // })

            // if (imgFile.size < 1000000 && (imgFile.type === "image/png" || imgFile.type === "image/jpg" || imgFile.type === "image/jpeg")) {
            //     setimgErr("")
            //     i = 0
            //     console.log(imgFile, filee);
            //     data.append('profile', filee)
            // } else {
            //     i = 1
            //     setimgErr("File size must be less than 1 MB or should be image!")
            // }



            const canvaImage = editorRef.current.getImage();
            canvaImage.toBlob(blob => {
                const previewURL = URL.createObjectURL(blob);

                // Fetch the blob data asynchronously
                fetch(previewURL)
                    .then(response => response.blob())
                    .then(blob => {
                        // Create a file object from the blob data
                        const filee = new File([blob], "test.png", { type: 'image/png' });
                        // console.log(filee);

                        // Use the file object here or call a function that depends on it
                        handleFile(filee); // Call a function passing filee as a parameter
                    })
                    .catch(error => {
                        // console.error('Error fetching blob:', error);
                    });
            });

            // Function to handle the file after it's created
            function handleFile(filee) {
                if (imgFile.size < 1000000 && (imgFile.type === "image/png" || imgFile.type === "image/jpg" || imgFile.type === "image/jpeg")) {
                    setimgErr("");
                    i = 0;
                    // console.log(filee, imgFile);
                    data.append('profile', filee);
                    setStatus(true)
                    dispatch({ type: REQ_FOR_POST_USER_PROGRESS, payload: { data } })
                } else {
                    i = 1;
                    setimgErr("File size must be less than 1 MB or should be an image!");
                }
            }
        } else {
            if (i === 0) {
                // console.log("call");
                setStatus(true)
                dispatch({ type: REQ_FOR_POST_USER_PROGRESS, payload: { data } })
            }
        }

        // console.log(i);
        // console.log(dataa.profile[0]);
        // if (i === 0) {
        //     setStatus(true)
        //     // console.log(finalDatas)

        //     dispatch({ type: REQ_FOR_POST_USER_PROGRESS, payload: { data } })
        // }
        // const header = {
        //     // 'Content-type': 'application/json',
        //     'Access-Control-Allow-Origin': '*',
        //     'Content-Type': 'multipart/form-data',
        //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        //     "Authorization": "Bearer " + Cookies.get('tkn'),
        //     "isauth": Cookies.get('isAuth') || "",
        //     "isr": Cookies.get('isr') || ""
        // }
        // axios.post(base_url + addUser, data, header)
        //     .then((res) => {
        //         // setErr("")
        //         // if (res.status === 200) {
        //         //     setStatus(false)
        //         //     window.location.reload()
        //         // }
        //     })
        //     .catch((err) => {
        //         // console.log(err);
        //         // if (err.response.status === 404) {
        //         //     Cookies.remove('isr')
        //         //     Cookies.remove('isAuth')
        //         //     Cookies.remove('tkn')
        //         //     window.location.href = "/"
        //         // } else {
        //         //     setStatus(false)
        //         //     setErr("Something went wrong, please refresh and try again, else contact developer.")
        //         // }
        //     })

    }


    // const [preview, setPreview] = useState(null);
    // const [src] = useState('');
    // const [img, setImg] = useState([])

    // const onClose = () => {
    //     setPreview(null);
    // };

    // const onCrop = (newPreview) => {
    //     setPreview(newPreview);
    // };

    // const onBeforeFileLoad = (elem) => {
    //     if (elem.target.files[0].size > 71680) {
    //         console.log("call");
    //         alert('File is too big!');
    //         elem.target.value = '';
    //     } else {
    //         setImg(elem.target.files[0])
    //     }
    // };








    // console.log(imgPreview)

    return (
        <div className="modal fade" id="AddUsers" tabIndex="-1" aria-labelledby="AddUsersLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="AddUsersLabel">Add User</h1>
                        <button type="button" id='closeModelAddUsers' className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)} enctype="multipart/form-data">
                            {
                                isAlertVisible
                                    ? alert('success', 'User created successfully 😊')
                                    : ""
                            }
                            {
                                adminReducer.post_user_error === true
                                    ? <div className="alert alert-danger fade show mt-3" role="alert">
                                        <strong> ⚠️ Opps,</strong>Something went wrong!
                                    </div>
                                    : ""
                            }
                            <div className='row'>
                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>First name<span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("firstname", {
                                            required: true,
                                            pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                        })}
                                    />
                                    <small className="text-danger">{errors.firstname?.type === 'required' && "First name is required!"}</small>
                                    <small className="text-danger">{errors.firstname?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                                </div>

                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>Middle name<span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("middlename", {
                                            required: true,
                                            pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                        })}
                                    />
                                    <small className="text-danger">{errors.middlename?.type === 'required' && "Middle name is required!"}</small>
                                    <small className="text-danger">{errors.middlename?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                                </div>

                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>Last name<span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("lastname", {
                                            required: true,
                                            pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                        })}
                                    />
                                    <small className="text-danger">{errors.lastname?.type === 'required' && "Last name is required!"}</small>
                                    <small className="text-danger">{errors.lastname?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                                </div>
                            </div>

                            <div className='row mt-4'>
                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>District</p>
                                    {/* <p>District<span className='text-danger'>*</span></p> */}
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("district", {
                                            // required: true,
                                            pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                        })}
                                    />
                                    <small className="text-danger">{errors.district?.type === 'required' && "District is required!"}</small>
                                    <small className="text-danger">{errors.district?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                                </div>

                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>Taluka</p>
                                    {/* <p>Taluka<span className='text-danger'>*</span></p> */}
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("taluka", {
                                            // required: true,
                                            pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                        })}
                                    />
                                    <small className="text-danger">{errors.taluka?.type === 'required' && "Taluka is required!"}</small>
                                    <small className="text-danger">{errors.taluka?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                                </div>

                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>village</p>
                                    {/* <p>Village<span className='text-danger'>*</span></p> */}
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("village", {
                                            // required: true,
                                            pattern: /^[a-zA-Z0-9@=*._-\s]+$/i,
                                        })}
                                    />
                                    <small className="text-danger">{errors.village?.type === 'required' && "Village is required!"}</small>
                                    <small className="text-danger">{errors.village?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                                </div>
                            </div>


                            <div className='row mt-4'>
                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>Zone<span className='text-danger'>*</span></p>
                                    <select
                                        className="form-control input_field"
                                        {...register("zone", {
                                            required: true,
                                        })}
                                        onChange={handleChangeSelectedZone}
                                    >
                                        <option value="">Tap to select</option>
                                        {
                                            adminReducer.zone.map((value, index) => {
                                                return (
                                                    <option value={value.ID} key={index}>{value.ID} - {value.name} - {value.pincode}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <small className="text-danger">{errors.zone?.type === 'required' && "Zone is required!"}</small>
                                </div>

                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>Subzone<span className='text-danger'>*</span></p>
                                    <select
                                        className="form-control input_field"
                                        {...register("subzone", {
                                            required: true,
                                        })}
                                    >
                                        <option value="">Tap to select</option>
                                        <option value="0">0</option>
                                        {
                                            adminReducer.subzone.map((value, index) => {
                                                if (value.zoneID === selectedzone) {
                                                    return (
                                                        <option value={value.ID} key={index}>{value.ID}</option>
                                                    )
                                                }
                                            })
                                        }
                                    </select>
                                    <small className="text-danger">{errors.subzone?.type === 'required' && "Subzone is required!"}</small>
                                </div>

                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>Vistar<span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("vistar", {
                                            required: true,
                                            pattern: /^[a-zA-Z0-9@=,*._-\s]+$/i,
                                        })}
                                    />
                                    <small className="text-danger">{errors.vistar?.type === 'required' && "Vistar is required!"}</small>
                                    <small className="text-danger">{errors.vistar?.type === 'pattern' && "Sorry! only letters(a-z,A-z),numbers(0-9), (.,@) are allowed."}</small>
                                </div>

                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>Mobile No.<span className='text-danger'>*</span></p>
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("mobile", {
                                            required: true,
                                            pattern: /^[0-9]+$/i,
                                        })}
                                    />
                                    <small className="text-danger">{errors.mobile?.type === 'required' && "Mobile number is required!"}</small>
                                    <small className="text-danger">{errors.mobile?.type === 'pattern' && "Sorry! only numbers(0-9) are allowed."}</small>
                                </div>

                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>Gender<span className='text-danger'>*</span></p>
                                    <select
                                        className="form-control input_field"
                                        {...register("gender", {
                                            required: true,
                                        })}
                                    >
                                        <option value="">Tap to select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>

                                    </select>
                                    <small className="text-danger">{errors.gender?.type === 'required' && "Gender is required!"}</small>
                                </div>

                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>Birthdate<span className='text-danger'>*</span></p>
                                    <input
                                        type="date"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("birthdate", {
                                            required: true,
                                        })}
                                    />
                                    <small className="text-danger">{errors.birthdate?.type === 'required' && "Birth date is required!"}</small>
                                </div>
                            </div>


                            <div className='row mt-4'>
                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-8">
                                    <p>Address</p>
                                    {/* <p>Address<span className='text-danger'>*</span></p> */}
                                    <input
                                        type="text"
                                        className="form-control input_field"
                                        placeholder="*******"
                                        {...register("address", {
                                            // required: true,
                                            pattern: /^[A-Za-z0-9,-\s]+$/,
                                        })}
                                    />
                                    <small className="text-danger">{errors.address?.type === 'required' && "Address is required!"}</small>
                                    <small className="text-danger">{errors.address?.type === 'pattern' && "Sorry! only letters(A-Z,a-z),0-9,-,comma are allowed."}</small>
                                </div>



                                <div className="mb-3 mt-3 col-12 col-md-6 col-lg-4">
                                    <p>Profile photo</p>
                                    {/* <p>Profile photo<span className='text-danger'>*</span></p> */}
                                    <input
                                        type="file"
                                        onChange={handleChangeForImg}
                                        className="form-control input_field"
                                    // {...register("profile", {
                                    //     required: true,
                                    //     validate: {
                                    //         lessThan10MB: files => files[0]?.size < 1000000 || 'Max 1 MB',
                                    //     },
                                    // })}
                                    />
                                    {
                                        imgErr !== ""
                                            ? <small className="text-danger">{imgErr}</small>
                                            : ""
                                    }
                                    <small className="text-danger">{errors.profile?.type === 'required' && "Profile is required!"}</small>
                                    {errors.profile && <span className="text-danger">{errors.profile.message}</span>}
                                </div>
                            </div>
                            {/* <div className='row mt-4'>
                                <div className='col-12'>
                                    <Avatar
                                        width={390}
                                        height={295}
                                        onCrop={onCrop}
                                        onClose={onClose}
                                        onBeforeFileLoad={onBeforeFileLoad}
                                        src={src}
                                    />
                                    <img src={preview} alt="Preview" />
                                </div>
                            </div> */}
                            {/* https://images.pexels.com/photos/19916040/pexels-photo-19916040/free-photo-of-man-in-an-orange-sweatshirt-with-cropped-sleeves-looking-in-the-mirror.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1 */}
                            <div className='row'>
                                <div className='col-12 col-md-6'>
                                    {
                                        image ? (
                                            <AvatarEditor
                                                ref={editorRef}
                                                image={image}
                                                width={250}
                                                height={250}
                                                border={50}
                                                color={[255, 255, 255, 0.6]} // RGBA
                                                scale={scale}
                                                rotate={0}
                                            />
                                        ) : ""
                                    }

                                </div>
                                <div className='col-12 col-md-6 mt-5'>
                                    {
                                        image ? (
                                            <img src={previewLink} width={250} height={250} style={{ borderRadius: '50%' }} />
                                        ) : ""
                                    }
                                </div>

                            </div>
                            {
                                image ? (
                                    <div>
                                        <span className='adminHomeEditBtn mb-2 me-2' onClick={() => setScale(scale - 0.1)} style={{ cursor: 'pointer' }}>
                                            -
                                        </span>
                                        <span className='adminHomeEditBtn mb-2 me-2' onClick={() => setScale(scale + 0.1)} style={{ cursor: 'pointer' }}>
                                            +
                                        </span>
                                        <span className='adminHomeEditBtn mb-2 me-2' onClick={preview} style={{ cursor: 'pointer' }}>
                                            Check preview
                                        </span>
                                    </div>
                                ) : ''
                            }


                            {
                                adminReducer.post_user_progress === true
                                    ? <button disabled className="btn btn_signin mb-3 mt-3 col-12">{btnspinner()}</button>
                                    : <button type="submit" className="btn btn_signin mb-3 mt-3 col-12">Add</button>
                            }

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUse