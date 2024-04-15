import './doctorMain.scss';
import AuthContext from '../../../auth/authContext';
import DeleteButtonIcon from './icons/deleteIcon.png';
import EditButtonIcon from './icons/editIcon.png';
import SearchButtonIcon from './icons/searchIcon.png'

import { Link, Navigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';
import DoctorPatientDataEditor from '../doctorPatientDataEditor/doctorPatientDataEditor';

const DoctorMain = ({doctorIIN, openedSection}) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [doctorData, setDoctorData] = useState({});
    const [doctorsPatientsData, setDoctorsPatientsData] = useState([])
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [isMenuOpened, setIsMenuOpened] = useState(false);

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

        const fetchDoctorData = async () => {
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
                let response = await fetch(`http://localhost:8080/api/v1/doctors/IIN/${doctorIIN}`, {
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
                        response = await fetch(`http://localhost:8080/api/v1/doctors/IIN/${doctorIIN}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const doctorData = await response.json();
                        setDoctorData(doctorData);
                        setDataLoading(false);
                        return doctorData;
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const doctorData = await response.json();
                    setDoctorData(doctorData);
                    setDataLoading(false);
                    return doctorData;
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctor data.")
            }
        };

        const fetchDoctorsPatientsData = async (doctorData) => {
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
                let response = await fetch(`http://localhost:8080/api/v1/doctors/${doctorData.IIN}/patients`, {
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
                        response = await fetch(`http://localhost:8080/api/v1/doctors/${doctorData.IIN}/patients`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const doctorsPatientsData = await response.json();
                        setDoctorsPatientsData(doctorsPatientsData);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const doctorsPatientsData = await response.json();
                    setDoctorsPatientsData(doctorsPatientsData);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctor data.")
            }
        }

        (async () => {
            const doctorData = await fetchDoctorData();
            if (doctorData) {
              fetchDoctorsPatientsData(doctorData);
            }
        })();

    }, [doctorIIN, refresh, setIsAuthenticated, setRedirectTo]);      

    const deletePatientButtonHandle = async (patientId) => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

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
            let response = await fetch(`http://localhost:8080/api/v1/patients/delete/${patientId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            });
    
            if (!response.ok && response.status === 401) {
                try {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://localhost:8080/api/v1/patients/delete/${patientId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        }
                    });
                    const responseData = await response.json();
                    console.log(responseData);
                    setDoctorsPatientsData(doctorsPatientsData.filter(patient => patient.id !== patientId));
                } catch (error) {
                    handleLogout();
                }
            } else {
                const responseData = await response.json();
                console.log(responseData);
                setDoctorsPatientsData(doctorsPatientsData.filter(patient => patient.id !== patientId));
            }
        } catch (error) {
            console.log("An error occurred while trying to delete the patient.")
        }
    };    

    const openPatientDataEditorHandle = (patientId) => {
        setSelectedPatientId(patientId);
        setIsMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const closePatientDataEditorHandle = () => {
        setSelectedPatientId(null);
        setIsMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }
    
    if (dataLoading) {
        return (
            <div className='loader'></div>
        );
    }

    if (openedSection === 'account') {
        return (
            <div className='doctorMain'>
                <h1 className='dataSectionTitle'>Личные данные</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='personalDataWrapper'>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Имя</div>
                        <div className='doctorDataBox'>{doctorData.first_name}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Фамилия</div>
                        <div className='doctorDataBox'>{doctorData.last_name}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Отчество</div>
                        <div className='doctorDataBox'>{doctorData.middle_name}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>ИИН</div>
                        <div className='doctorDataBox'>{doctorData.IIN}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Пол</div>
                        <div className='doctorDataBox'>{doctorData.gender}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Возраст</div>
                        <div className='doctorDataBox'>{doctorData.age}</div>
                    </div>
                    <div className='doctorDataWrapper'>
                        <div className='doctorDataLabel'>Квалификация</div>
                        <div className='doctorDataBox'>{doctorData.qualification}</div>
                    </div>
                </div>
            </div>
        );
    } else if (openedSection === 'patients') {
        return (
            <div className='doctorMain'>
                <h1 className='dataSectionTitle'>Ваши пациенты</h1>
                <hr className='dataSectionDividerLineStart'/>
        
                <div className='searchBarWrapper'>
                    <input className='searchBar' placeholder='Найти пациента' type='search'></input>
                    <img src={SearchButtonIcon} className='searchButton' alt=''></img>
                </div>
        
                <div className='doctorPatientsTable'>
                    {doctorsPatientsData.map(patient => (
                        <React.Fragment key={patient.id}>
                            {isMenuOpened && <div className='blurBackground'></div>}
                            {isMenuOpened && <DoctorPatientDataEditor closeMenuSetter={closePatientDataEditorHandle} patientId={selectedPatientId}/>}
                            <div className='doctorPatientWrapper'>
                                <Link to={`/patient/${patient.IIN}/account`}>
                                    <div className='doctorPatientDataBox'>
                                        <h3 className='patientFullName'>{`${patient.first_name} ${patient.middle_name} ${patient.last_name}`}</h3>
                                        <p className='patientAge'>({patient.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='doctorPatientControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deletePatientButton' alt='Удалить пациента' onClick={() => deletePatientButtonHandle(patient.id)}></img>
                                    <img src={EditButtonIcon} className='editPatientButton' alt='Изменить данные' onClick={() => openPatientDataEditorHandle(patient.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );        
    }
}

export default DoctorMain;
