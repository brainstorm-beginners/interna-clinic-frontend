import { useContext, useEffect, useState } from 'react';
import './doctorAddPatientMenu.scss';
import CloseIcon from './icons/closeIcon.png';
import AuthContext from '../../../auth/authContext';
import { Navigate } from 'react-router-dom';

const DoctorAddPatientMenu = ({closeAddPatientMenuHandle, doctorId, doctorsPatientsData, setDoctorsPatientsData, searchPatientsResults, setSearchPatientsResults}) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [patientDataFromForm, setPatientDataFromForm] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    
    const inputFields = [
        "first_name",
        "last_name",
        "middle_name",
        "IIN",
        "password",
        "gender", 
        "age",
        "ethnicity", 
        "region",
        "weight",
        "height",
        "BMI",
        "education", 
        "marital_status", 
        "job_description",
        "driving_status", 
        "was_involved_in_car_accidents", 
        "was_injured", 
        "was_hospitalized", 
        "cirrhosis", 
        "duration_of_illness",
        "EVV", 
        "previous_infectious_diseases",
        "bad_habits", 
        "accepted_PE_medications",
        "comorbidities", 
        "hepatocellular_carcinoma", 
        "GIB", 
        "stool_character", 
        "dehydration", 
        "CPU", 
        "portosystemic_bypass_surgery", 
        "thrombosis", 
        "medicines", 
        "renal_impairment", 
    ];
    
    const [selectedFields, setSelectedFields] = useState(
        inputFields.reduce((fields, field) => {
            fields[field] = false;
            return fields;
        }, {})
    );
    

    const defaultFields = {
        "AAT": 0,
        "AAT_upper": 0,
        "ALT": 0,
        "ALT_upper": 0,
        "albumin": 0,
        "bilirubin": 0,
        "blood_ammonia": 0,
        "creatinine": 0,
        "hemoglobin_level": 0,
        "indirect_elastography_of_liver": 0,
        "indirect_elastography_of_spleen": 0,
        "platelet_count": 0,
        "potassium_ion": 0,
        "presence_of_ascites": "Нет",
        "red_flags_EVV": "Нет",
        "reitan_test": "Нет данных",
        "sodium_blood_level": 0,
        "view_ents": "Другое",
        "INA": 0
    }

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
        "password": "Пароль",
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
        "duration_of_illness": "Продолжительность болезни (в днях)",
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

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);

    const handleInputChange = (field, event) => {
        setPatientDataFromForm({
            ...patientDataFromForm,
            [field]: event.target.value,
        });

        setSelectedFields({
            ...selectedFields,
            [field]: !!event.target.value,
        });
    };

    const addPatientToDb = async () => {
        const handleLogout = () => {
            setIsAuthenticated(false);
            setRedirectTo('/login');
            localStorage.removeItem('currentUserData');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        };

        const patientToAddFinalData = {
            ...defaultFields,
            ...patientDataFromForm,
            doctor_id: doctorId
        };

        console.log("Final data: " + JSON.stringify(patientToAddFinalData));

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
            let response = await fetch(`http://localhost:8080/api/v1/patients/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                },
                body: JSON.stringify({
                    ...patientToAddFinalData
                })
            });

            if (!response.ok && response.status === 401) {
                try {
                    await refresh();
                    accessToken = localStorage.getItem('accessToken');
                    response = await fetch(`http://localhost:8080/api/v1/patients/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + accessToken
                        },
                        body: JSON.stringify({
                            ...patientToAddFinalData
                        })
                    });

                    closeAddPatientMenuHandle();
                    window.location.reload(); 
                } catch (error) {
                    handleLogout();
                }
            } else {
                switch (response.status) {
                    case 422:
                        setErrorMessage('Ошибка при добавлении пациента. Заполните все поля.');
                        break;
                    case 409:
                        setErrorMessage('Пациент с таким ИИН уже существует в базе данных.');
                        break;
                    default:
                        closeAddPatientMenuHandle();
                        window.location.reload(); 
                }            
            }
        } catch (error) {
            console.log("An error ocured while trying to fetch the patient data.")
        }
    }

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <div className="doctorAddPatientMenuBox">
            <div className='doctorAddPatientMenuHeaderBox'>
                <img src={CloseIcon} className='closeDoctorAddPatientMenuButton' alt='' onClick={closeAddPatientMenuHandle} />
            </div>
            <div className='patientDataInputsList'>
                {inputFields.map((field) => {
                    if (dbEnumFieldsOptions[field]) {
                        return (
                            <div className='patidentDataInputsWrapper' key={field}>
                                <label className='patientDataLabel'>{fieldTranslations[field] || field}</label>
                                <select className={`patidentDataSelect ${selectedFields[field] ? '' : 'not-selected'}`} onChange={(event) => handleInputChange(field, event)}>
                                    <option value="">Выберите опцию...</option>
                                    {dbEnumFieldsOptions[field].map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>   
                        )
                    } else {
                        return (
                            <div className='patidentDataInputsWrapper' key={field}>
                                <label className='patientDataLabel'>{fieldTranslations[field] || field}</label>
                                <input className={`patidentDataInput ${selectedFields[field] ? '' : 'not-selected'}`} onChange={(event) => handleInputChange(field, event)} />
                            </div>
                        );
                    }
                })}
            </div>
            <button className='addPatientButton' onClick={() => addPatientToDb()}>ДОБАВИТЬ ПАЦИЕНТА</button>
            <p className='errorMessage'>{errorMessage}</p>
        </div>
    );        
}
  
export default DoctorAddPatientMenu;