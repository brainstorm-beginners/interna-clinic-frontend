import { useContext, useEffect, useState } from 'react';
import './doctorPatientDataEditor.scss';
import CloseIcon from './icons/closeIcon.png';
import AuthContext from '../../../auth/authContext';
import { Navigate } from 'react-router-dom';

const DoctorPatientDataEditor = ({closePatientDataEditorHandle, patientId, doctorsPatientsData, setDoctorsPatientsData, searchPatientsResults, setSearchPatientsResults}) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [dataLoading, setDataLoading] = useState(true);
    const [patientData, setPatientData] = useState({});
    const [updatedPatientData, setUpdatedPatientData] = useState(patientData);
    const [newPassword, setNewPassword] = useState('');

    const fieldTranslations = {
        "AAT": "АСТ (абсолютное значение, ЕД/л или мкмоль/л)",
        "AAT_upper": "АСТ (количество верхних границ норм)",
        "ALT": "АЛТ (абсолютное значение, ЕД/л или мкмоль/л)",
        "ALT_upper": "АЛТ (количество верхних границ норм)",
        "BMI": "ИМТ (Индекс массы тела)",
        "CPU": "ЦП",
        "EVV": "Наличие ВРВ",
        "GIB": "ЖКТ за последний год",
        "IIN": "ИИН",
        "INA": "МНО",
        "accepted_PE_medications": "Список принимаемых ЛС по ПЭ",
        "age": "Возраст",
        "albumin": "Альбумин",
        "bad_habits": "Вредные привычки",
        "bilirubin": "Биллирубин",
        "blood_ammonia": "Результат экспресс теста (аммиак крови)",
        "cirrhosis": "Цирроз печени в исходе",
        "comorbidities": "Сопутствующие заболевания",
        "creatinine": "Креатинин (мкмоль/л)",
        "dehydration": "Дегидрация",
        "driving_status": "Водительское удостоверение (Наличие/отсутствие водительского удостоверения)",
        "duration_of_illness": "Продолжительность болезни",
        "education": "Образование (Уровень образования)",
        "ethnicity": "Этническая принадлежность",
        "first_name": "Имя",
        "gender": "Пол",
        "height": "Рост",
        "hemoglobin_level": "Уровень гемоглобина",
        "hepatocellular_carcinoma": "Гепатоцеллюлярная карцинома (Рак печени)",
        "indirect_elastography_of_liver": "Непрямая эластометрия печени",
        "indirect_elastography_of_spleen": "Непрямая эластометрия селезенки",
        "job_description": "Профессия",
        "last_name": "Фамилия",
        "marital_status": "Семейное положение",
        "medicines": "Принимаемые лекарства",
        "middle_name": "Отчество",
        "platelet_count": "Количество тромбоцитов",
        "portosystemic_bypass_surgery": "Портосистемное шунтирование",
        "potassium_ion": "K+",
        "presence_of_ascites": "Наличие асцита",
        "previous_infectious_diseases": "Перенесенные инфекционные заболевания за последний год",
        "red_flags_EVV": "Красные флаги ВРВ",
        "region": "Регион",
        "reitan_test": "Тест Рейтана",
        "renal_impairment": "Почечная недостаточность",
        "sodium_blood_level": "Na+",
        "stool_character": "Характер стула",
        "thrombosis": "Тромбоз",
        "view_ents": "Виды энц",
        "was_hospitalized": "Был/а ли госпитализирован/а за последний год?",
        "was_injured": "Получал/а ли травмы за последний год?",
        "was_involved_in_car_accidents": "Был/а ли участником ДТП за последний год?",
        "weight": "Вес"
    };
    
    const dbEnumFieldsOptions = {
        gender: ['Мужской', 'Женский'],
        ethnicity: ['Азиат', 'Европеец'],
        education: ['Не оконченное среднее', 'Среднее', 'Высшие'],
        marital_status: ['Не замужем/не женат', 'За мужем/женат', 'Разведен/вдова/вдовец'],
        job_description: ['Требующая большой концентрации', 'Офисная', 'Не работаю', 'С активной физ нагрузкой', 'Другое'],
        driving_status: ['Да', 'Нет'],
        was_involved_in_car_accidents: ['Да', 'Нет'],
        cirrhosis: ['ХГС', 'ХГВ', 'ХГД', 'НАЖБП/МАЖБП', 'Алкогольный стеатогепатит', 'Аутоиммунный гепатит', 'ПБХ', 'ПСХ', 'ПБХ + АИГ', 'ПСХ + АИГ', 'БВК', 'Гемохроматоз', 'Другое', 'Нет'],
        EVV: ['1 степень', '2 степень', '3 степень', '4 степень', 'Нет'],
        red_flags_EVV: ['Да', 'Нет'],
        presence_of_ascites: ['Нет', 'Контролируемый', 'Рефракетерный'],
        reitan_test: ['<40 сек', '41-60 сек', '61-90 сек', '91-120 сек', '>120 сек', 'Нет данных'],
        view_ents: ['АВС', 'Скрытая свная', 'Другое'],
        hepatocellular_carcinoma: ['Да', 'Нет'],
        was_hospitalized: ['Планово', 'Экстренно', 'Нет'],
        was_injured: ['Да', 'Нет'],
        GIB: ['Да', 'Нет'],
        previous_infectious_diseases: ['Да', 'Нет'],
        stool_character: ['Регулярный (1 раз в 1-2 дня)', 'Запор', 'Диарея'],
        portosystemic_bypass_surgery: ['Шунтирующие операции', 'Спонтанные шунты', 'Нет', 'Другое'],
        thrombosis: ['Нет', 'Тромбоз воротной вены', 'Тромбоз печеночных вен'],
        medicines: ['Прием бензодиазепин', 'Прием опиодов', 'ИПП', 'Другое'],
        renal_impairment: ['Да', 'Нет'],
        bad_habits: ['Табакокурение', 'Злоупотребление алкоголем', 'Нет', 'Другое'],
        CPU: ['Имелась', 'Отсутствовала']
    };  
      

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
                        response = await fetch(`http://localhost:8080/api/v1/patients/${patientId}`, {
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
        }

        fetchPatientData();
    }, [patientId, refresh, setIsAuthenticated, setRedirectTo])

    const handleInputChange = (field, event) => {
        setUpdatedPatientData({
            ...updatedPatientData,
            [field]: event.target.value,
        });

        if (field === 'newPassword') {
            setNewPassword(event.target.value);
        }
    };

    const savePatientData = async () => {
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
      
        updatedPatientData.password = newPassword;
      
        try {
            let response = await fetch(`http://localhost:8080/api/v1/patients/${patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({
                ...patientData,
                ...updatedPatientData
                })
            });
        
            if (!response.ok && response.status === 401) {
                try {
                    console.log("GOT AN ERROR. REFRESHING.")
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://localhost:8080/api/v1/patients/${patientId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        body: JSON.stringify({
                        ...patientData,
                        ...updatedPatientData
                        })
                    });

                    const updatedPatientDataRecieved = await response.json();
                    const updatedDoctorsPatientsData = doctorsPatientsData.map(patient => {
                        if (patient.id === updatedPatientDataRecieved.id) {
                            return updatedPatientDataRecieved;
                        }
                        return patient;
                    });

                    let updatedSearchPatientsResults = null;
                    if (searchPatientsResults) {
                        updatedSearchPatientsResults = searchPatientsResults.map(patient => {
                            if (patient.id === updatedPatientDataRecieved.id) {
                                return updatedPatientDataRecieved;
                            }
                            return patient;
                        });
                    }

                    setDoctorsPatientsData(updatedDoctorsPatientsData);
                    setSearchPatientsResults(updatedSearchPatientsResults);
                    setPatientData(updatedPatientDataRecieved);
                    closePatientDataEditorHandle();
                } catch (error) {
                    const error_text = JSON.stringify(error);
                    console.log("SOMETHING WENT WRONG HERE 1: " + error_text)
                    handleLogout();
                }
            } else {
                const updatedPatientDataRecieved = await response.json();
                const updatedDoctorsPatientsData = doctorsPatientsData.map(patient => {
                    if (patient.id === updatedPatientDataRecieved.id) {
                        return updatedPatientDataRecieved;
                    }
                    return patient;
                });

                let updatedSearchPatientsResults = null;
                if (searchPatientsResults) {
                    updatedSearchPatientsResults = searchPatientsResults.map(patient => {
                        if (patient.id === updatedPatientDataRecieved.id) {
                            return updatedPatientDataRecieved;
                        }
                        return patient;
                    });
                }

                setDoctorsPatientsData(updatedDoctorsPatientsData);
                setSearchPatientsResults(updatedSearchPatientsResults);
                setPatientData(updatedPatientDataRecieved);
                closePatientDataEditorHandle();
            }
        } catch (error) {
            const error_text = JSON.stringify(error);
            console.log("SOMETHING WENT WRONG HERE 2: " + error_text)
            console.log("An error occurred while trying to update the patient data.")
        }
    };      

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }
    
    if (dataLoading) {
        return (
            <div className="patientDataEditorBox" style={{display: "block"}}>
                <div className='patientDataEditorHeaderBox'>
                    <img src={CloseIcon} className='closePatientDataEditorButton' alt=''/>
                </div>
                <div className='dataEditorLoader'></div>
            </div>
        );
    }

    return (
        <div className="patientDataEditorBox">
            <div className='patientDataEditorHeaderBox'>
                <img src={CloseIcon} className='closePatientDataEditorButton' alt='' onClick={closePatientDataEditorHandle} />
            </div>
            {patientData && (
                <div className='patientDataInputsList'>
                    <div className='patidentDataInputsWrapper' key='password'>
                        <label className='patientDataLabel'>Пароль</label>
                        <input
                            className='patidentDataInput'
                            type='password'
                            placeholder='Введите новый пароль (необязательно)'
                            onChange={(event) => handleInputChange('password', event)}
                            value={newPassword}
                        />
                    </div>
                    {Object.entries(patientData).map(([field, value]) => {
                        if (field !== 'id' && field !== 'doctor_id') {
                            if (dbEnumFieldsOptions[field]) {
                                return (
                                    <div className='patidentDataInputsWrapper' key={field}>
                                        <label className='patientDataLabel'>{fieldTranslations[field] || field}</label>
                                        <select className='patidentDataSelect' onChange={(event) => handleInputChange(field, event)} defaultValue={value}>
                                            {dbEnumFieldsOptions[field].map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className='patidentDataInputsWrapper' key={field}>
                                        <label className='patientDataLabel'>{fieldTranslations[field] || field}</label>
                                        <input className='patidentDataInput' placeholder={value} onChange={(event) => handleInputChange(field, event)} />
                                    </div>
                                );
                            }
                        }
                        return null;
                    })}
                </div>
            )}
            <button className='patientDataSaveButton' onClick={() => savePatientData()}>СОХРАНИТЬ</button>
        </div>
    );        
}
  
export default DoctorPatientDataEditor;
