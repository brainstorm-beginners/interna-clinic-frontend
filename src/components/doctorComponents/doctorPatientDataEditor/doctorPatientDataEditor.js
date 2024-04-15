import { useContext, useEffect, useState } from 'react';
import './doctorPatientDataEditor.scss';
import CloseIcon from './icons/closeIcon.png';
import AuthContext from '../../../auth/authContext';
import { Navigate } from 'react-router-dom';

const DoctorPatientDataEditor = ({closeMenuSetter, patientId}) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(false);
    const [patientData, setPatientData] = useState({});

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);

    useEffect(() => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const fetchPatientData = async () => {
            const currentUserData = localStorage.getItem('currentUserData');
            let accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!currentUserData) {
                handleLogout();
                return;
            }

            if (!accessToken) {
                if (refreshToken) {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                } else {
                    handleLogout();
                    return;
                }
            }

            try {
                let response = await fetch(`http://localhost:8080/api/v1/patients/${patientId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    }
                });

                if (!response.ok && response.status === 401) {
                    try {
                        await refresh();
                        accessToken = localStorage.getItem('accessToken');
                        response = await fetch(`http://localhost:8080/api/v1/doctors/IIN/${patientId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const patientData = await response.json();
                        setPatientData(patientData);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const patientData = await response.json();
                    setPatientData(patientData);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctor data.")
            }
        }

        fetchPatientData();
    }, [patientId, refresh, setIsAuthenticated, setRedirectTo])

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }
    
    if (dataLoading) {
        return (
            <div className="patientDataEditorBox" style={{display: "block"}}>
                <div className='patientDataEditorHeaderBox'>
                    <img src={CloseIcon} className='closePatientDataEditorButton' alt=''/>
                </div>
                <div className='loader'></div>
            </div>
        );
    }

    return (
        <div className="patientDataEditorBox">
            <div className='patientDataEditorHeaderBox'>
                <img src={CloseIcon} className='closePatientDataEditorButton' alt='' onClick={closeMenuSetter} />
            </div>
            {patientData && (
                <div className='patientDataInputsList'>
                    {Object.entries(patientData).map(([field, value]) => {
                        if (field !== 'id' && field !== 'doctor_id') {
                            return (
                                <div className='patidentDataInputsWrapper' key={field}>
                                    <label className='patientDataLabel'>{field}</label>
                                    <input className='patidentDataInput' placeholder={value} />
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            )}
            <button className='patientDataSaveButton'>СОХРАНИТЬ</button>
        </div>
      );
  }
  
  export default DoctorPatientDataEditor;

