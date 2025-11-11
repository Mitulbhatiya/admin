
export const alert = (alert_name, text) => {
    return (
        <>
            <div className={`alert alert-${alert_name} alert-dismissible fade show mx-0 mt-2`} role="alert">
                {text}
                {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}
            </div>
        </>
    )
}

export const spinner = () => {
    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="spinner-border " role="status" style={{ width: '1.5rem', height: '1.5rem', color: '#3d3d3d' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    )
}

export const btnspinner = () => {
    return (
        <>
            <div className="d-flex justify-content-center">
                <div className="spinner-border " role="status" style={{ width: '1.5rem', height: '1.5rem', color: '#E9E9E9' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </>
    )
}