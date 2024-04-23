import './adminMain.scss';
import AuthContext from '../../../auth/authContext';
import DeleteButtonIcon from './icons/deleteIcon.png';
import EditButtonIcon from './icons/editIcon.png';
import SearchButtonIcon from './icons/searchIcon.png'

import { Link, Navigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';
import DoctorPatientDataEditor from '../../doctorComponents/doctorPatientDataEditor/doctorPatientDataEditor';
import DoctorAddPatientMenu from '../../doctorComponents/doctorAddPatientMenu/doctorAddPatientMenu';
import AdminAddPatientMenu from '../adminAddPatientMenu/adminAddPatientMenu';
import AdminPatientDataEditor from '../adminPatientDataEditor/adminPatientDataEditor';

const AdminMain = ({adminUsername, openedSection}) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [patientsData, setPatientsData] = useState([]);
    const [doctorsData, setDoctorsData] = useState([])
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [isPatientDataEditorMenuOpened, setIsPatientDataEditorMenuOpened] = useState(false);
    const [isAddPatientMenuOpened, setIsAddPatientMenuOpened] = useState(false);
    const [isDoctorDataEditorMenuOpened, setIsDoctorDataEditorMenuOpened] = useState(false);
    const [isAddDoctorMenuOpened, setIsAddDoctorMenuOpened] = useState(false);
    const [searchPatientsResults, setSearchPatientsResults] = useState(null);
    const [searchDoctorsResults, setSearchDoctorsResults] = useState(null);
    

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

        const fetchPatientsData = async () => {
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
                let response = await fetch(`http://localhost:8080/api/v1/patients`, {
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
                        response = await fetch(`http://localhost:8080/api/v1/patients`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const patientsData = await response.json();
                        setPatientsData(patientsData);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const patientsData = await response.json();
                    setPatientsData(patientsData);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the patients data.")
            }
        }

        fetchPatientsData()
    }, [refresh, setIsAuthenticated, setRedirectTo]);

    const fetchDoctorsData = async () => {
        const currentUserData = localStorage.getItem('currentUserData');
        let accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

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
            let response = await fetch(`http://localhost:8080/api/v1/doctors`, {
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
                    response = await fetch(`http://localhost:8080/api/v1/doctors`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        }
                    });
                    const doctorsData = await response.json();
                    setDoctorsData(doctorsData);
                    setDataLoading(false);
                } catch (error) {
                    handleLogout();
                }
            } else {
                const doctorsData = await response.json();
                setDoctorsData(doctorsData);
                setDataLoading(false);
            }
        } catch (error) {
            console.log("An error ocured while trying to fetch the doctors data.")
        }
    }

    const logOutButtonHandle = () => {
        const confirmation = window.confirm("Вы уверены, что хотите выйти из аккаунта?");
        if (!confirmation) {
            return;
        }

        setIsAuthenticated(false);
        setRedirectTo('/login');
        localStorage.removeItem('currentUserData');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const openPatientDataEditorHandle = (patientId) => {
        setSelectedPatientId(patientId);
        setIsPatientDataEditorMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const openDoctorDataEditorHandle = (doctorId) => {
        setSelectedDoctorId(doctorId);
        setIsDoctorDataEditorMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const closePatientDataEditorHandle = () => {
        setSelectedPatientId(null);
        setIsPatientDataEditorMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    const closeDoctorDataEditorHandle = () => {
        setSelectedDoctorId(null);
        setIsDoctorDataEditorMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    const deletePatientButtonHandle = async (patientId) => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const confirmation = window.confirm("Вы уверены, что хотите удалить пациента?");
        if (!confirmation) {
            return;
        }

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
                    setPatientsData(patientsData.filter(patient => patient.id !== patientId));
                } catch (error) {
                    handleLogout();
                }
            } else {
                const responseData = await response.json();
                console.log(responseData);
                setPatientsData(patientsData.filter(patient => patient.id !== patientId));
            }
        } catch (error) {
            console.log("An error occurred while trying to delete the patient.")
        }
    };

    const deleteDoctorButtonHandle = async (doctorId) => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const confirmation = window.confirm("Вы уверены, что хотите удалить врача?");
        if (!confirmation) {
            return;
        }

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
            let response = await fetch(`http://localhost:8080/api/v1/doctors/delete/${doctorId}`, {
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
                    response = await fetch(`http://localhost:8080/api/v1/doctors/delete/${doctorId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        }
                    });
                    const responseData = await response.json();
                    console.log(responseData);
                    setDoctorsData(doctorsData.filter(doctor => doctor.id !== doctorId));
                } catch (error) {
                    handleLogout();
                }
            } else {
                const responseData = await response.json();
                console.log(responseData);
                setDoctorsData(doctorsData.filter(doctor => doctor.id !== doctorId));
            }
        } catch (error) {
            console.log("An error occurred while trying to delete the doctor.")
        }
    };

    const searchPatientButtonHandle = async () => {
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
    
        const searchQuery = document.querySelector('.searchBar').value;
    
        try {
            let response = await fetch(`http://localhost:8080/api/v1/patients/search/${searchQuery}`, {
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
                    response = await fetch(`http://localhost:8080/api/v1/patients/search/${searchQuery}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        }
                    });
                    const searchResults = await response.json();
                    setSearchPatientsResults(searchResults);
                } catch (error) {
                    handleLogout();
                }
            } else {
                const searchResults = await response.json();
                setSearchPatientsResults(searchResults);
            }
        } catch (error) {
            console.log("TEST: " + searchPatientsResults)
            console.log("An error occurred while trying to search for the patient.")
        }
    };

    const searchDoctorByButtonHandle = async () => {
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
    
        const searchQuery = document.querySelector('.searchBar').value;
    
        try {
            let response = await fetch(`http://localhost:8080/api/v1/doctors/search/${searchQuery}`, {
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
                    response = await fetch(`http://localhost:8080/api/v1/doctors/search/${searchQuery}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        }
                    });
                    const searchResults = await response.json();
                    let searchResultsArray = [];
                    searchResultsArray.push(searchResults);
                    setSearchDoctorsResults(searchResultsArray);
                } catch (error) {
                    handleLogout();
                }
            } else {
                const searchResults = await response.json();
                let searchResultsArray = [];
                searchResultsArray.push(searchResults);
                setSearchDoctorsResults(searchResultsArray);
            }
        } catch (error) {
            console.log("TEST: " + searchDoctorsResults)
            console.log("An error occurred while trying to search for the patient.")
        }
    };

    const openAddPatientMenuHandle = () => {
        setIsAddPatientMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const openAddDoctorMenuHandle = () => {
        setIsAddDoctorMenuOpened(true);
        document.documentElement.style.overflowY = 'hidden';
    }

    const closeAddPatientMenuHandle = () => {
        setIsAddPatientMenuOpened(false);
        document.documentElement.style.overflowY = 'auto';
    }

    const closeAddDoctorMenuHandle = () => {
        setIsAddDoctorMenuOpened(false);
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

    if (openedSection === 'all_patients') {
        return (
            <div className='adminMain'>
                <h1 className='dataSectionTitle'>Пациенты в базе данных</h1>
                <hr className='dataSectionDividerLineStart'/>
        
                <div className='searchBarWrapper'>
                    <input 
                        className='searchBar' 
                        placeholder='Найти пациента по ФИО или ИИН' 
                        type='search'
                        onChange={(event) => {
                            if (event.target.value === '') {
                                setSearchPatientsResults(null);
                            }
                        }}
                    />
                    <img src={SearchButtonIcon} className='searchButton' alt='' onClick={searchPatientButtonHandle}></img>
                </div>

                <button className='addPatientButton' onClick={openAddPatientMenuHandle}>ДОБАВИТЬ ПАЦИЕНТА</button>

                <div className='patientsTable'>
                    {isAddPatientMenuOpened && <div className='blurBackground'></div>}
                        {isAddPatientMenuOpened && <AdminAddPatientMenu
                                                    closeAddPatientMenuHandle={closeAddPatientMenuHandle}
                                                    patientsData={patientsData}
                                                    setPatientsData={setPatientsData}
                                                    />}
                    {searchPatientsResults === null && patientsData.map(patient => (
                        <React.Fragment key={patient.id}>
                            {isPatientDataEditorMenuOpened && <div className='blurBackground'></div>}
                            {isPatientDataEditorMenuOpened && <AdminPatientDataEditor
                                                closePatientDataEditorHandle={closePatientDataEditorHandle}
                                                patientId={selectedPatientId}
                                                patientsData={patientsData}
                                                setPatientsData={setPatientsData}
                                                searchPatientsResults={searchPatientsResults}
                                                setSearchPatientsResults={setSearchPatientsResults}
                                            />}
                            <div className='patientWrapper'>
                                <Link to={`/patient/${patient.IIN}/account`}>
                                    <div className='patientDataBox'>
                                        <h3 className='patientFullName'>{`${patient.first_name} ${patient.middle_name} ${patient.last_name}`}</h3>
                                        <p className='patientAge'>({patient.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='patientControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deletePatientButton' alt='Удалить пациента' onClick={() => deletePatientButtonHandle(patient.id)}></img>
                                    <img src={EditButtonIcon} className='editPatientButton' alt='Изменить данные' onClick={() => openPatientDataEditorHandle(patient.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                    {searchPatientsResults && searchPatientsResults.detail === 'Patients not found' && <p className='notFoundTextError'>Ничего не найдено</p>}
                    {searchPatientsResults && searchPatientsResults.length > 0 && searchPatientsResults.detail !== 'Patients not found' && searchPatientsResults.map(patient => (
                        <React.Fragment key={patient.id}>
                        {isPatientDataEditorMenuOpened && <div className='blurBackground'></div>}
                        {isPatientDataEditorMenuOpened && <DoctorPatientDataEditor
                                            closePatientDataEditorHandle={closePatientDataEditorHandle}
                                            patientId={selectedPatientId}
                                            doctorsPatientsData={patientsData}
                                            setDoctorsPatientsData={setPatientsData}
                                            searchPatientsResults={searchPatientsResults}
                                            setSearchPatientsResults={setSearchPatientsResults}
                                        />}
                            <div className='patientWrapper'>
                                <Link to={`/patient/${patient.IIN}/account`}>
                                    <div className='patientDataBox'>
                                        <h3 className='patientFullName'>{`${patient.first_name} ${patient.middle_name} ${patient.last_name}`}</h3>
                                        <p className='patientAge'>({patient.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='patientControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deletePatientButton' alt='Удалить пациента' onClick={() => deletePatientButtonHandle(patient.id)}></img>
                                    <img src={EditButtonIcon} className='editPatientButton' alt='Изменить данные' onClick={() => openPatientDataEditorHandle(patient.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    } else if (openedSection === 'all_doctors') {
        fetchDoctorsData();
        return (
            <div className='adminMain'>
                <h1 className='dataSectionTitle'>Пациенты в базе данных</h1>
                <hr className='dataSectionDividerLineStart'/>
        
                <div className='searchBarWrapper'>
                    <input 
                        className='searchBar' 
                        placeholder='Найти врача по ИИН' 
                        type='search'
                        onChange={(event) => {
                            if (event.target.value === '') {
                                setSearchPatientsResults(null);
                            }
                        }}
                    />
                    <img src={SearchButtonIcon} className='searchButton' alt='' onClick={searchDoctorByButtonHandle}></img>
                </div>

                <button className='addDoctorButton' onClick={openAddDoctorMenuHandle}>ДОБАВИТЬ ВРАЧА</button>

                <div className='doctorsTable'>
                    {/* {isAddDoctorMenuOpened && <div className='blurBackground'></div>}
                        {isAddDoctorMenuOpened && <AdminAddDoctorMenu
                                                    closeAddDoctorMenuHandle={closeAddDoctorMenuHandle}
                                                    doctorsData={doctorsData}
                                                    setDoctorsData={setDoctorsData}
                                                    />}
                    {searchDoctorsResults === null && doctorsData.map(doctor => (
                        <React.Fragment key={doctor.id}>
                            {isDoctorDataEditorMenuOpened && <div className='blurBackground'></div>}
                            {isDoctorDataEditorMenuOpened && <AdminDoctorDataEditor
                                                closeDoctorDataEditorHandle={closeDoctorDataEditorHandle}
                                                doctorId={selectedDoctorId}
                                                doctorsData={doctorsData}
                                                setDoctorsData={setDoctorsData}
                                                searchDoctorsResults={searchDoctorsResults}
                                                setSearchDoctorsResults={setSearchDoctorsResults}
                                            />}
                            <div className='doctorWrapper'>
                                <Link to={`/doctor/${doctor.IIN}/account`}>
                                    <div className='doctorDataBox'>
                                        <h3 className='doctorFullName'>{`${doctor.first_name} ${doctor.middle_name} ${doctor.last_name}`}</h3>
                                        <p className='doctorAge'>({doctor.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='doctorControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deleteDoctorButton' alt='Удалить врача' onClick={() => deleteDoctorButtonHandle(doctor.id)}></img>
                                    <img src={EditButtonIcon} className='editDoctorButton' alt='Изменить данные' onClick={() => openDoctorDataEditorHandle(doctor.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}

                    {searchDoctorsResults && searchDoctorsResults[0].detail === "Doctor not found" && <p className='notFoundTextError'>Ничего не найдено</p>}

                    {searchDoctorsResults && searchDoctorsResults.length > 0 && searchDoctorsResults[0].detail !== "Patient not found" && searchDoctorsResults.map(doctor => (
                        <React.Fragment key={doctor.id}>
                        {isDoctorDataEditorMenuOpened && <div className='blurBackground'></div>}
                        {isDoctorDataEditorMenuOpened && <AdminDoctorDataEditor
                                            closeDoctorDataEditorHandle={closeDoctorDataEditorHandle}
                                            doctorId={selectedDoctorId}
                                            doctorsData={doctorsData}
                                            setDoctorsData={setDoctorsData}
                                            searchDoctorsResults={searchDoctorsResults}
                                            setSearchDoctorsResults={setSearchDoctorsResults}
                                        />}
                            <div className='doctorWrapper'>
                                <Link to={`/doctor/${doctor.IIN}/account`}>
                                    <div className='doctorDataBox'>
                                        <h3 className='doctorFullName'>{`${doctor.first_name} ${doctor.middle_name} ${doctor.last_name}`}</h3>
                                        <p className='doctorAge'>({doctor.age} полных лет)</p>
                                    </div>
                                </Link>
                                <div className='doctorControlMenuWrapper'>
                                    <img src={DeleteButtonIcon} className='deleteDoctorButton' alt='Удалить врача' onClick={() => deleteDoctorButtonHandle(doctor.id)}></img>
                                    <img src={EditButtonIcon} className='editDoctorButton' alt='Изменить данные' onClick={() => openDoctorDataEditorHandle(doctor.id)}></img>
                                </div>
                            </div>
                        </React.Fragment>
                    ))} */}
                </div>
            </div>
        );      
    } else if (openedSection === 'all_doctors') {
        return (
            <div className='adminMain'>
                
            </div>
        );        
    }
}

export default AdminMain;
