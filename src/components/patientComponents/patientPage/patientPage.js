import './patientPage.scss';
import PatientHeader from '../patientHeader/patientHeader';
import PatientMain from '../patientMain/patientMain';
import { Route, Routes, useParams } from 'react-router-dom';
import React from 'react';

const PatientPage = () => {
    const { patientIIN } = useParams();

    return (
        <div className='patientPage'>
            <PatientHeader patientIIN={patientIIN}/>
            <Routes>
                <Route path={`account/*`} element={<PatientMain patientIIN={patientIIN} openedSection={'account'}/>} />
                <Route path={`tests/*`} element={<PatientMain patientIIN={patientIIN} openedSection={'tests'}/>} />
            </Routes>
        </div>
    );
}

export default PatientPage;
