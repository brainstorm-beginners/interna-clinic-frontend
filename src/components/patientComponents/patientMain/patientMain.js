import './patientMain.scss';
import AuthContext from '../../../auth/authContext';

import { Navigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';

const PatientMain = ({patientIIN}) => {
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

        const fetchData = async () => {
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
            
            let response = await fetch(`http://localhost:8080/api/v1/patients/IIN/${patientIIN}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            });
    
            if (!response.ok && response.status === 401) {
                try {
                    setDataLoading(true);
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://localhost:8080/api/v1/patients/IIN/${patientIIN}`, {
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
            }
        };
    
        fetchData();
    }, [patientIIN, refresh, setIsAuthenticated, setRedirectTo]);    

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }
    
    if (dataLoading) {
        return (
            <div className='loader'></div>
        );
    }

    return (
        <div className='patientMain'>
            <h1 className='dataSectionTitle'>Личные данные</h1>
            <hr className='dataSectionDividerLineStart'/>
            <div className='patientPersonalDataWrapper'>
                <div className='patientFirstNameWrapper'>
                    <div className='patientFirstNameLabel'>Имя</div>
                    <div className='patientFirstNameBox'>{patientData.first_name}</div>
                </div>
                <div className='patientLastNameWrapper'>
                    <div className='patientLastNameLabel'>Фамилия</div>
                    <div className='patientLastNameBox'>{patientData.last_name}</div>
                </div>
                <div className='patientMiddleNameWrapper'>
                    <div className='patientMiddleNameLabel'>Отчество</div>
                    <div className='patientMiddleNameBox'>{patientData.middle_name}</div>
                </div>
                <div className='patientIINWrapper'>
                    <div className='patientIINLabel'>ИИН</div>
                    <div className='patientIINBox'>{patientData.IIN}</div>
                </div>
            </div>
            <hr className='dataSectionDividerLineEnd'/>
        </div>
    );
}

export default PatientMain;
