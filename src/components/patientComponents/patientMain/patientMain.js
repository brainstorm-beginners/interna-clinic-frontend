import './patientMain.scss';
import AuthContext from '../../../auth/authContext';

import { Navigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';

const PatientMain = ({patientIIN, openedSection}) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [patientData, setPatientData] = useState({});
    const [doctorData, setDoctorData] = useState({});

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
                let response = await fetch(`http://localhost:8080/api/v1/patients/IIN/${patientIIN}`, {
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
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the patient data.")
            }
        };

        const fetchDoctorData = async (doctorId) => {
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
                let response = await fetch(`http://localhost:8080/api/v1/doctors/full_name/${doctorId}`, {
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
                        response = await fetch(`http://localhost:8080/api/v1/doctors/full_name/${doctorId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + accessToken
                            }
                        });
                        const doctorData = await response.json();
                        setDoctorData(doctorData);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const doctorData = await response.json();
                    setDoctorData(doctorData);
                    setDataLoading(false);
                }   
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctor data.")
            }
        }

        fetchPatientData();
        fetchDoctorData(patientData.doctor_id);
    }, [patientData.doctor_id, patientIIN, refresh, setIsAuthenticated, setRedirectTo]);
    
    const navigateTo = (targetHTMLelementID) => {
        const element = document.getElementById(targetHTMLelementID);
        if (element) {
            const elementRect = element.getBoundingClientRect();
            const absoluteElementTop = elementRect.top + window.scrollY;
            const middle = absoluteElementTop - (window.innerHeight / 4);
            window.scrollTo({
                top: middle,
                behavior: 'smooth'
            });
        }
    };    

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    };
    
    if (dataLoading) {
        return (
            <div className='loader'></div>
        );
    };

    if (openedSection === 'account') {
        return (
            <div className='patientMain'>
                <ul className='sectionNavigation'>
                    <li className='sectionNavigation__element' onClick={() => navigateTo('demographicData')}>Демографические данные</li>
                    <li className='sectionNavigation__element' onClick={() => navigateTo('doctorData')}>Лечащий врач</li>
                    <li className='sectionNavigation__element' onClick={() => navigateTo('etiologyData')}>Медицинские данные (Этиология)</li>
                    <li className='sectionNavigation__element' onClick={() => navigateTo('laboratoryResearchData')}>Лабораторные исследования</li>
                    <li className='sectionNavigation__element' onClick={() => navigateTo('fibrosisData')}>Стадия заболевания / Фиброз / Шкалы</li>
                    <li className='sectionNavigation__element' onClick={() => navigateTo('anamnesisData')}>Анамнез пациента</li>
                    <li className='sectionNavigation__element' onClick={() => navigateTo('provokingFactsData')}>Провоцирующие факторы</li>
                    <li className='sectionNavigation__element' onClick={() => navigateTo('commitmentData')}>Приверженность</li>
                </ul>

                <h1 className='dataSectionTitle' id='demographicData'>Демографические данные</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='personalDataWrapper'>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Имя</div>
                        <div className='patientDataBox'>{patientData.first_name}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Фамилия</div>
                        <div className='patientDataBox'>{patientData.last_name}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Отчество</div>
                        <div className='patientDataBox'>{patientData.middle_name}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>ИИН</div>
                        <div className='patientDataBox'>{patientData.IIN}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Пол</div>
                        <div className='patientDataBox'>{patientData.gender}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Возраст</div>
                        <div className='patientDataBox'>{patientData.age}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Этническая принадлежность</div>
                        <div className='patientDataBox'>{patientData.ethnicity}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Регион</div>
                        <div className='patientDataBox'>{patientData.region}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Рост</div>
                        <div className='patientDataBox'>{patientData.height}см</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Вес</div>
                        <div className='patientDataBox'>{patientData.weight}кг</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>ИМТ</div>
                        <div className='patientDataBox'>{patientData.BMI}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Уровень образования</div>
                        <div className='patientDataBox'>{patientData.education}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Семейное положение</div>
                        <div className='patientDataBox'>{patientData.marital_status}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Описание работы</div>
                        <div className='patientDataBox'>{patientData.job_description}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Водит ли транспортное средство</div>
                        <div className='patientDataBox'>{patientData.driving_status}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Был/а ли участником ДТП за последний год?</div>
                        <div className='patientDataBox'>{patientData.was_involved_in_car_accidents}</div>
                    </div>
                </div>

                <h1 className='dataSectionTitle' style={{marginTop: '100px'}} id='doctorData'>Лечащий врач</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='personalDataWrapper'>
                    <div className='patientDoctorDataWrapper'>
                        <div className='patientDoctorDataLabel'>ФИО врача</div>
                        <div className='patientDoctorDataBox'>{doctorData.last_name} {doctorData.first_name} {doctorData.middle_name}</div>
                    </div>
                    <div className='patientDoctorDataWrapper'>
                        <div className='patientDoctorDataLabel'>Квалификация</div>
                        <div className='patientDoctorDataBox'>{doctorData.qualification}</div>
                    </div>
                </div>

                <h1 className='dataSectionTitle' style={{marginTop: '100px'}} id='etiologyData'>Медицинские данные (Этиология)</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='medicalDataWrapper'>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Цирроз печени в исходе</div>
                        <div className='patientDataBox'>{patientData.cirrhosis ? patientData.cirrhosis.join(', '): 'Загрузка...'}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Известная продолжительность болезни печени (в годах)</div>
                        <div className='patientDataBox'>{patientData.duration_of_illness}</div>
                    </div>
                </div>

                <h1 className='dataSectionTitle' style={{marginTop: '100px'}} id='laboratoryResearchData'>Лабораторные исследования</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='medicalDataWrapper'>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Количество тромбоцитов</div>
                        <div className='patientDataBox'>{patientData.platelet_count}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Уровень гемоглобина</div>
                        <div className='patientDataBox'>{patientData.hemoglobin_level}</div>
                    </div>
                    <div className='patientDataTogetherWrapper'>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>АЛТ (абсолютное значение, ЕД/л или мкмоль/л)</div>
                            <div className='patientDataBox'>{patientData.ALT}</div>
                        </div>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Единица измерения АЛТ</div>
                            <div className='patientDataBox'>{patientData.ALT_unit}</div>
                        </div>
                    </div>
                    <div className='patientDataTogetherWrapper'>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>АСТ (абсолютное значение, ЕД/л или мкмоль/л)</div>
                            <div className='patientDataBox'>{patientData.AAT}</div>
                        </div>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Единица измерения АСТ</div>
                            <div className='patientDataBox'>{patientData.AAT_unit}</div>
                        </div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Билирубин, мкмоль/л</div>
                        <div className='patientDataBox'>{patientData.bilirubin}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Креатинин, мкмоль/л</div>
                        <div className='patientDataBox'>{patientData.creatinine}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>МНО </div>
                        <div className='patientDataBox'>{patientData.INA}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Альбумин</div>
                        <div className='patientDataBox'>{patientData.albumin}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Na+ </div>
                        <div className='patientDataBox'>{patientData.sodium_blood_level}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>K+</div>
                        <div className='patientDataBox'>{patientData.potassium_ion}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Результат экспресс теста (аммиак крови)</div>
                        <div className='patientDataBox'>{patientData.blood_ammonia}</div>
                    </div>
                </div>

                <h1 className='dataSectionTitle' style={{marginTop: '100px'}} id='fibrosisData'>Стадия заболевания / Фиброз / Шкалы</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='medicalDataWrapper'>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Результат непрямой эластографии печени, стадия фиброза</div>
                        <div className='patientDataBox'>{patientData.indirect_elastography_of_liver}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Результат непрямой эластографии селезенки</div>
                        <div className='patientDataBox'>{patientData.indirect_elastography_of_spleen}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Наличие ВРВ</div>
                        <div className='patientDataBox'>{patientData.EVV}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Красные знаки ВРВ</div>
                        <div className='patientDataBox'>{patientData.red_flags_EVV}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Наличие асцита</div>
                        <div className='patientDataBox'>{patientData.presence_of_ascites}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Тест Рейтана</div>
                        <div className='patientDataBox'>{patientData.reitan_test}</div>
                    </div>
                    <div className='patientDataTogetherWrapper'>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Тип энцефалопатии</div>
                            <div className='patientDataBox'>{patientData.type_of_encephalopathy}</div>
                        </div>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Степень энцефалопатии</div>
                            <div className='patientDataBox'>{patientData.degree_of_encephalopathy}</div>
                        </div>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Процесс энцефалопатии</div>
                            <div className='patientDataBox'>{patientData.process_of_encephalopathy}</div>
                        </div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Наличие провоцирующих факторов</div>
                        <div className='patientDataBox'>{patientData.presence_of_precipitating_factors}</div>
                    </div>
                </div>
                <h1 className='dataSectionTitle' style={{marginTop: '100px'}} id='anamnesisData'>Анамнез пациента</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='medicalDataWrapper'>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Сопутствующие заболевания</div>
                        <div className='patientDataBox'>{patientData.comorbidities ? patientData.comorbidities.join(', ') : 'Загрузка...'}</div>
                    </div>
                    <div className='patientDataTogetherWrapper'>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Был/а ли ПЛАНОВО госпитализирован/а с заболеваниями печени?</div>
                            <div className='patientDataBox'>{patientData.was_planned_hospitalized_with_liver_diseases}</div>
                        </div>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Кол-во ПЛАНОВЫХ госпитализаций с заболеваниями печени</div>
                            <div className='patientDataBox'>{patientData.number_of_planned_hospitalizations_with_liver_diseases}</div>
                        </div>
                    </div>
                    <div className='patientDataTogetherWrapper'>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Был/а ли ПЛАНОВО госпитализирован/а БЕЗ заболеваний печени?</div>
                            <div className='patientDataBox'>{patientData.was_planned_hospitalized_without_liver_diseases}</div>
                        </div>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Кол-во ПЛАНОВЫХ госпитализаций БЕЗ заболеваний печени</div>
                            <div className='patientDataBox'>{patientData.number_of_planned_hospitalizations_without_liver_diseases}</div>
                        </div>
                    </div>
                    <div className='patientDataTogetherWrapper'>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Был/а ли ЭКСТРЕННО госпитализирован/а с заболеваниями печени?</div>
                            <div className='patientDataBox'>{patientData.was_emergency_hospitalized_with_liver_diseases}</div>
                        </div>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Кол-во ЭКСТРЕННЫХ госпитализаций с заболеваниями печени</div>
                            <div className='patientDataBox'>{patientData.number_of_emergency_hospitalizations_with_liver_diseases}</div>
                        </div>
                    </div>
                    <div className='patientDataTogetherWrapper'>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Был/а ли ЭКСТРЕННО госпитализирован/а БЕЗ заболеваний печени?</div>
                            <div className='patientDataBox'>{patientData.was_emergency_hospitalized_without_liver_diseases}</div>
                        </div>
                        <div className='patientDataWrapper'>
                            <div className='patientDataLabel'>Кол-во ЭКСТРЕННЫХ госпитализаций БЕЗ заболеваний печени</div>
                            <div className='patientDataBox'>{patientData.number_of_emergency_hospitalizations_without_liver_diseases}</div>
                        </div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Получал/а ли травмы (2023-2024)</div>
                        <div className='patientDataBox'>{patientData.was_injured}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Наличие гепатоцеллюлярной карциномы</div>
                        <div className='patientDataBox'>{patientData.hepatocellular_carcinoma}</div>
                    </div>
                    
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Переносил/а ли инфекционные заболевания (2023-2024)</div>
                        <div className='patientDataBox'>{patientData.previous_infectious_diseases}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Дегидратация</div>
                        <div className='patientDataBox'>{patientData.dehydration}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Портосистемное шунтирование</div>
                        <div className='patientDataBox'>{patientData.portosystemic_bypass_surgery}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Приверженность к лечению по ЦП</div>
                        <div className='patientDataBox'>{patientData.CPU}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Список принимаемых ЛС по ПЭ </div>
                        <div className='patientDataBox'>{patientData.accepted_PE_medications}</div>
                    </div>
                </div>
                <h1 className='dataSectionTitle' style={{marginTop: '100px'}} id='provokingFactsData'>Провоцирующие факторы</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='medicalDataWrapper'>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>ЖКК (2023-2024)</div>
                        <div className='patientDataBox'>{patientData.GIB}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Перенесенные инфекционные заболевания за последний год</div>
                        <div className='patientDataBox'>{patientData.previous_infectious_diseases ? patientData.previous_infectious_diseases.join(', ') : 'Загрузка...'}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Характер стула</div>
                        <div className='patientDataBox'>{patientData.stool_character}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Дегидратация</div>
                        <div className='patientDataBox'>{patientData.dehydration}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Портосистемное шунтирование</div>
                        <div className='patientDataBox'>{patientData.portosystemic_bypass_surgery}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Тромбоз</div>
                        <div className='patientDataBox'>{patientData.thrombosis}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>ЛС</div>
                        <div className='patientDataBox'>{patientData.medicines ? patientData.medicines.join(', ') : 'Загрузка...'}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Почечная недостаточноть</div>
                        <div className='patientDataBox'>{patientData.renal_impairment}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Вредные привычки</div>
                        <div className='patientDataBox'>{patientData.bad_habits}</div>
                    </div>
                </div>
                <h1 className='dataSectionTitle' style={{marginTop: '100px'}} id='commitmentData'>Приверженность</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='medicalDataWrapper'>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Приверженность к лечению по ЦП</div>
                        <div className='patientDataBox'>{patientData.CP}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Лекарственные препараты, принимаемые ранее по ПЭ Список принимаемых ЛС по ПЭ</div>
                        <div className='patientDataBox'>{patientData.accepted_PE_medications}</div>
                    </div>
                    <div className='patientDataWrapper'>
                        <div className='patientDataLabel'>Лекарственные препараты, принимаемые на момент осмотра</div>
                        <div className='patientDataBox'>{patientData.accepted_medications_at_the_time_of_inspection}</div>
                    </div>
                </div>
            </div>
        );
    } else if (openedSection === 'tests') {
        return (
            <div className='patientMain'>
                <h1 className='dataSectionTitle' style={{marginTop: '100px'}}>Доступные тесты</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='patientAvailableTestsWrapper'>

                </div>
                <h1 className='dataSectionTitle' style={{marginTop: '100px'}}>Выполненные тесты</h1>
                <hr className='dataSectionDividerLineStart'/>
                <div className='patientCompletedTestsWrapper'>

                </div>
            </div>
        );
    }
}

export default PatientMain;
