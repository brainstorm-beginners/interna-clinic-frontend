import { useContext, useEffect, useRef, useState } from 'react';
import './adminAddPatientMenu.scss';
import CloseIcon from './icons/closeIcon.png';
import AuthContext from '../../../auth/authContext';
import { Navigate } from 'react-router-dom';

const AdminAddPatientMenu = ({closeAddPatientMenuHandle, patientsData, setPatientsData}) => {
    const { refresh, setIsAuthenticated, redirectTo, setRedirectTo } = useContext(AuthContext);
    const [doctorsData, setDoctorsData] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fields = {
        // NOT REQUIRED
        is_on_controlled: {type: 'enum', options: ['Да', 'Нет', 'Нет данных'], translation: 'Будет ли на контроле', required: false, data_type: 'str', default: 'Нет данных'},

        // REQUIRED
        doctor_id: {type: 'enum', options: [], translation: 'Выберите врача', required: true, data_type: 'int'},
        first_name: {type: 'input', translation: 'Имя', required: true, data_type: 'str'},
        last_name: {type: 'input', translation: 'Фамилия', required: true, data_type: 'str'},
        middle_name: {type: 'input', translation: 'Отчество', required: true, data_type: 'str'},
        IIN: {type: 'input', translation: 'ИИН', required: true, data_type: 'int'},
        password: {type: 'input', translation: 'Пароль', required: true, data_type: 'str'},
        age: {type: 'input', translation: 'Возраст', required: true, data_type: 'int'},
        gender: {type: 'enum', options: ['Мужской', 'Женский'], translation: 'Пол', required: true, data_type: 'str'},
        ethnicity: {type: 'enum', options: ['Азиат', 'Европеец'], translation: 'Этническая принадлежность', required: true, data_type: 'str'},
        region: {type: 'input', translation: 'Регион', required: true, data_type: 'str'},
        height: {type: 'input', translation: 'Рост (в сантиметрах)', required: true, data_type: 'int'},
        weight: {type: 'input', translation: 'Вес (в килограммах)', required: true, data_type: 'int'},
        // BMI: {type: 'input', translation: 'Индекс массы тела'} - Автоматически высчитывается и присваивается ниже в методе fetch-запроса
        education: {type: 'enum', options: ['Не оконченное среднее', 'Среднее', 'Высшее'], translation: 'Уровень образования', required: true, data_type: 'str'},
        marital_status: {type: 'enum', options: ['Не замужем/не женат', 'Замужем/Женат', 'Разведен/вдова/вдовец'], translation: 'Семейное положение', required: true,
                                                                                                                                                    data_type: 'str'},
        job_description: {type: 'enum', options: ['С точными механизмами', 'Офисная', 'С активной физической нагрузкой', 'Не работаю', 'Другое'],
                                                                                                                        translation: 'С чем связана работа', required: true,
                                                                                                                        data_type: 'str'},
        driving_status: {type: 'enum', options: ['Да', 'Нет'], translation: 'Водит ли транспортное средство', required: true, data_type: 'str'},
        was_involved_in_car_accidents: {type: 'enum', options: ['Да', 'Нет'], translation: 'Был ли участником ДТП за последний год?', required: true, data_type: 'str'},
        cirrhosis: {type: 'multiple', options: ['ХГС', 'ХГВ', 'ХГД', 'НАЖБП/МАЖБП', 'Алкогольный стеатогепатит', 'Аутоиммунный гепатит', 'ПБХ', 'ПСХ', 'ПБХ + АИГ',
                                                                                                                'ПСХ + АИГ', 'БВК', 'Гемохроматоз', 'Другое'], 
                                                                                                                translation: 'Цирроз печени в исходе', required: true,
                                                                                                                data_type: 'str'},
        duration_of_illness: {type: 'input', translation: 'Известная продолжительность болезни печени (в годах)', required: true, data_type: 'int'},

        // NOT REQUIRED
        platelet_count: {type: 'input', translation: 'Кол-во тромбоцитов в крови', required: false, data_type: 'float', default: 0.00},
        hemoglobin_level: {type: 'input', translation: 'Уровень гемоглобина в крови', required: false, data_type: 'float', default: 0.00},
        ALT: {type: 'input', translation: 'АЛТ (абсолютное значение)', required: false, data_type: 'float', default: 0.00},
        ATL_unit: {type: 'enum', options: ['ЕД/Л', 'МККАТ/Л'], translation: 'Единица измерения АЛТ', required: false, data_type: 'str', default: 'ЕД/Л'},
        AAT: {type: 'input', translation: 'АCТ (абсолютное значение)', required: false, data_type: 'float', default: 0.00},
        AAT_unit: {type: 'enum', options: ['ЕД/Л', 'МККАТ/Л'], translation: 'Единица измерения АСТ', required: false, data_type: 'str', default: 'ЕД/Л'},
        bilirubin: {type: 'input', translation: 'Билирубин (МКМОЛЬ/Л)', required: false, data_type: 'float', default: 0.00},
        creatinine: {type: 'input', translation: 'Креатинин (МКМОЛЬ/Л)', required: false, data_type: 'float', default: 0.00},
        INA: {type: 'input', translation: 'МНО', required: false, data_type: 'float', default: 0.00},
        albumin: {type: 'input', translation: 'Альбумин', required: false, data_type: 'float', default: 0.00},
        sodium_blood_level: {type: 'input', translation: 'Na+', required: false, data_type: 'float', default: 0.00},
        potassium_ion: {type: 'input', translation: 'K+', required: false, data_type: 'float', default: 0.00},

        // REQUIRED
        blood_ammonia: {type: 'input', translation: 'Результат экспресс теста (аммиак крови)', required: true, data_type: 'float'},

        // NOT REQUIRED
        indirect_elastography_of_liver: {type: 'input', translation: 'Результат непрямой эластографии печени, стадия фиброза (kPa)', required: false, data_type: 'float', default: 0.00},
        indirect_elastography_of_spleen: {type: 'input', translation: 'Результат непрямой эластографии селезенки (kPa)', required: false, data_type: 'float', default: 0.00},
        EVV: {type: 'enum', options: ['1 степень', '2 степень', '3 степень', '4 степень', 'Нет', 'Нет данных'], translation: 'Наличие ВРВ', required: false,
                                                                                                                                                data_type: 'str',
                                                                                                                                                default: 'Нет данных'},
        red_flags_EVV: {type: 'enum', options: ['Да', 'Нет', 'Нет данных'], translation: "Красные знаки ВРВ", required: false, data_type: 'str', default: 'Нет данных'},
        presence_of_ascites: {type: 'enum', options: ['Контролируемый', 'Рефракетерный', 'Нет', 'Нет данных'], translation: 'Наличие асцита', required: false, data_type: 'str',
                                                                                                                                                            default: 'Нет данных'},

        // REQUIRED
        reitan_test: {type: 'enum', options: ['<40 сек', '41-60 сек', '61-90 сек', '91-120 сек', '>120 сек'], translation: 'Тест Рейтана', required: true, data_type: 'str'},
        type_of_encephalopathy: {type: 'enum', options: ['А (acute: ПЭ, ассоциированная с острой печеночной недостаточностью)',
                                                            'B (bypass: ПЭ, ассоциированная с портосистемным шунтированием)', 'C (cirrhosis: ПЭ, ассоциированная с ЦП)'],
                                                            translation: 'Тип энцефалопатии', required: true, data_type: 'str'},
        degree_of_encephalopathy: {type: 'enum', options: ['Скрытая ISHEN – Минимальная WHC', 'Скрытая ISHEN - 1 WHC', 'Явная ISHEN 2', 'Явная ISHEN 3 WHC', 'Явная ISHEN 4 WHC'],
                                                                                                translation: 'Степень энцефалопатии', required: true, data_type: 'str'},

        // NOT REQUIRED
        process_of_encephalopathy: {type: 'enum', options: ['Эпизодическая', 'Рецидивирующая', 'персистирующая', 'Нет данных'], translation: 'Течение энцефалопатии',
                                                                                                                        required: false, data_type: 'str', default: 'Нет данных'},
        presence_of_precipitating_factors: {type: 'enum', options: ['Спровоцированная', 'Неспровоцированная', 'Нет данных'], translation: 'Наличие провоцирующих факторов',
                                                                                                                        required: false, data_type: 'str', default: 'Нет данных'},
        comorbidities: {type: 'multiple', options: ['ВИЧ -инфекция', 'Сахарный диабет/гликемия натощак', 'Избыточный вес / ожирение', 'Ишемическая болезнь сердца', 'АГ',
                                                                                                                        'Хроническая болезнь почек',
                                                                                                                        'Хроническое обструктивное болезнь легких', 'Другое',
                                                                                                                        'Нет данных'], translation: 'Сопутствующие заболевания',
                                                                                                                        required: false, data_type: 'str', default: 'Нет данных'},
        was_planned_hospitalized_with_liver_diseases: {type: 'enum_expandable', options: [{'Да': 'number_of_planned_hospitalizations_with_liver_diseases'}, 'Нет', 'Нет данных'],
                                                                                                translation: 'Был/а ли ПЛАНОВО госпитализирован/а с заболеваниями печени за последний год?',
                                                                                                required: false, data_type: 'str', default: 'Нет данных'},
        number_of_planned_hospitalizations_with_liver_diseases: {type: 'input', translation: 'Количество плановых госпитализаций', required: false, data_type: 'int', default: 0},
        was_planned_hospitalized_without_liver_diseases: {type: 'enum_expandable', options: [{'Да': 'number_of_planned_hospitalizations_without_liver_diseases'}, 'Нет', 'Нет данных'],
                                                                                                translation: 'Был/а ли ПЛАНОВО госпитализирован/а БЕЗ заболеваний печени за последний год?',
                                                                                                required: false, data_type: 'str', default: 'Нет данных'},
        number_of_planned_hospitalizations_without_liver_diseases: {type: 'input', translation: 'Количество плановых госпитализаций', required: false, data_type: 'int', default: 0},
        
        
        was_emergency_hospitalized_with_liver_diseases: {type: 'enum_expandable', options: [{'Да': 'number_of_emergency_hospitalizations_with_liver_diseases'}, 'Нет', 'Нет данных'],
                                                                                                translation: 'Был/а ли ЭКСТРЕННО госпитализирован/а с заболеваниями печени за последний год?',
                                                                                                required: false, data_type: 'str', default: 'Нет данных'},
        number_of_emergency_hospitalizations_with_liver_diseases: {type: 'input', translation: 'Количество экстренных госпитализаций', required: false, data_type: 'int', default: 0},
        was_emergency_hospitalized_without_liver_diseases: {type: 'enum_expandable', options: [{'Да': 'number_of_emergency_hospitalizations_without_liver_diseases'}, 'Нет', 'Нет данных'],
                                                                                                translation: 'Был/а ли ЭКСТРЕННО госпитализирован/а БЕЗ заболеваний печени за последний год?',
                                                                                                required: false, data_type: 'str', default: 'Нет данных'},
        number_of_emergency_hospitalizations_without_liver_diseases: {type: 'input',translation: 'Количество экстренных госпитализаций', required: false, data_type: 'int', default: 0},

        was_injured: {type: 'enum', options: ['Да', 'Нет'], translation: 'Получал/а ли травмы за последний год?', required: false, data_type: 'str', default: 'Нет'},

        // REQUIRED
        GIB: {type: 'enum', options: ['Да', 'Нет'], translation: 'ЖКК за последний год', required: true, data_type: 'str'},
        previous_infectious_diseases: {type: 'multiple', options: ['Инфекция органов дыхания', 'Инфекция органов пищеварения', 'Инфекция мочеполовой системы', 'Другое', 'Нет'],
                                                                                                translation: 'Переносил/а ли инфекционные заболевания за последний год?',
                                                                                                required: true, data_type: 'str'},
        stool_character: {type: 'enum', options: ['Регулярный (1 раз в 1-2 дня)', 'Запор', 'Диарея'], translation: 'Характер стула', required: true, data_type: 'str'},
        dehydration: {type: 'enum', options: ['Назначение диуретиков в неконтролируемых дозировках', 'Парацентез в больших объемах', 'Нет', 'Нет данных'], translation: 'Дегидратация',
                                                                                                required: true, data_type: 'str'},
        portosystemic_bypass_surgery: {type: 'enum', options: ['Шунтирующие операции', 'Cпонтанные шунты (Гастроэзофагеальные)', 'Cпонтанные шунты (Забрюшинные)',
                                                                                'Cпонтанные шунты (Анастомозы между левой ветвью воротной вены и сосудами передней брюшной стенки)',
                                                                                'Cпонтанные шунты (Между прямокишечным сплетением и нижней полой веной)', 'Нет данных'],
                                                                                translation: 'Портосистемное шунтирование', required: true, data_type: 'str'},
        thrombosis: {type: 'multiple', options: ['Тромбоз воротной вены', 'Тромбоз печеночных вен', 'Нет'], translation: 'Тромбоз', required: true, data_type: 'str'},
        medicines: {type: 'multiple', options: ['Прием бензодиазепин', 'Прием опиодов', 'ИПП', 'Нет'], translation: 'ЛС', required: true, data_type: 'str'},
        renal_impairment: {type: 'enum', options: ['Да', 'Нет'], translation: 'Почечная недостаточность', required: true, data_type: 'str'},
        bad_habits: {type: 'multiple', options: ['Табакокурение', 'Злоупотребление алкоголем', 'Нет'], translation: 'Вредные привычки', required: true, data_type: 'str'}, //
        CP: {type: 'enum', options: ['Имелась', 'Отсутствовала'], translation: 'Приверженность к лечению по ЦП', required: true, data_type: 'str'},
        accepted_PE_medications: {type: 'input', translation: 'Лекарственные препараты, принимаемые ранее по ПЭ Список принимаемых ЛС по ПЭ', required: false, data_type: 'str',
                                                                                                                                                    default: 'Нет'},
        accepted_medications_at_the_time_of_inspection: {type: 'input', translation: 'Лекарственные препараты, принимаемые на момент осмотра', required: false, data_type: 'str', 
                                                                                                                                                    default: 'Нет'},                                                                   
    }

    const [formData, setFormData] = useState(() => {
        const initialData = {};
    
        Object.keys(fields).forEach((fieldKey) => {
            const field = fields[fieldKey];
            if (field.default) {
                initialData[fieldKey] = field.type === 'multiple' ? [field.default] : field.default;
            } else {
                switch (field.data_type) {
                case 'float':
                    initialData[fieldKey] = field.required ? '' : 0.00;
                    break;
                case 'str':
                    initialData[fieldKey] = field.type === 'multiple' ? [] : '';
                    break;
                case 'int':
                    initialData[fieldKey] = field.required ? '' : 0;
                    break;
                default:
                    initialData[fieldKey] = '';
                }
            }
        });
    
        return initialData;
    });                

    useEffect(() => {
        if (redirectTo) {
            setRedirectTo(null);
        }
    }, [redirectTo, setRedirectTo]);

    useEffect(() => {
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
                        setDoctorsData(doctorsData['data']);
                        setDataLoading(false);
                    } catch (error) {
                        handleLogout();
                    }
                } else {
                    const doctorsData = await response.json();
                    setDoctorsData(doctorsData['data']);
                    setDataLoading(false);
                }
            } catch (error) {
                console.log("An error ocured while trying to fetch the doctors data.")
            }
        };

        fetchDoctorsData();
    }, [refresh, setIsAuthenticated, setRedirectTo])
    
    const handleInputChange = (fieldName, event) => {
        const field = fields[fieldName]
    
        if (event.target.value !== "" && field.required) {
            event.target.classList.remove('not-selected');
        }
        
        if (event.target.value === "" && field.required) {
            event.target.classList.add('not-selected');
        }        
    
        setFormData(prevFormData => {
            let updatedValue = event.target.value;
    
            if (updatedValue === '' && !field.required) {
                switch (field.data_type) {
                    case 'int':
                        updatedValue = 0;
                        break;
                    case 'float':
                        updatedValue = 0.00;
                        break;
                    default:
                        updatedValue = '';
                }
            }

            if (field.type === 'enum_expandable' && (updatedValue === 'Нет данных' || updatedValue === 'Нет')) {
                const expandableOptionKey = Object.values(field.options.find(option => typeof option === 'object'))[0];
                prevFormData[expandableOptionKey] = 0;
            }
    
            const updatedFormData = {...prevFormData, [fieldName]: updatedValue};
            return updatedFormData;
        });
    };

    useEffect(() => {
        console.log("FORM DATA: " + JSON.stringify(formData));
    }, [formData]); 
    
    const handleCheckboxChange = (fieldName, option, event) => {

        setFormData(prevFormData => {
            let updatedValue = prevFormData[fieldName] ? [...prevFormData[fieldName]] : [];
            if (event.target.checked) {
                updatedValue.push(option);
            } else {
                updatedValue = updatedValue.filter(item => item !== option);
            }
            const updatedFormData = {...prevFormData, [fieldName]: updatedValue};
            return updatedFormData;
        });
    };

    const areAllFieldsValid = (patientToAddFinalData, fields) => {
        const traverseFields = (data, fieldPath) => {
            for (let key in data) {
                console.log("CHECKING... " + key + " | VALUE: " + data[key])
                if (Array.isArray(data[key])) {
                    const fieldTranslation = fields[key]?.translation || key;

                    if (fields[key]?.required && data[key].length === 0) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' является обязательным и должно быть заполнено.`);
                    }
                } else if (typeof data[key] === 'object' && data[key] !== null) {
                    console.log("IT SEEMS LIKE IT'S OBJECT, OBVIOUSLY...")
                    traverseFields(data[key], fieldPath ? `${fieldPath}.${key}` : key);
                } else {
                    const fieldTranslation = fields[key]?.translation || key;
    
                    if (fields[key]?.required && (data[key] === undefined || data[key] === null || data[key] === '' || (Array.isArray(data[key]) && data[key].length === 0))) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' является обязательным и должно быть заполнено.`);
                    }
                    if (key === 'IIN') {
                        if (!/^\d{12}$/.test(data[key])) {
                            console.log("OOOPS ERROR HERE")
                            throw new Error(`Поле '${fieldTranslation}' должно содержать ровно 12 цифр.`);
                        }
                    }
                    if (fields[key]?.data_type === 'int' && !Number.isInteger(Number(data[key]))) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' должно быть целым числом.`);
                    }
                    if (fields[key]?.data_type === 'float' && isNaN(Number(data[key]))) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' должно быть числом.`);
                    }
                    if (fields[key]?.type === 'multiple' && data[key].length === 0) {
                        console.log("OOOPS ERROR HERE")
                        throw new Error(`Поле '${fieldTranslation}' должно быть выбрано хотя бы одно значение.`);
                    }
                }
            }
        };
    
        try {
            traverseFields(patientToAddFinalData, '');
        } catch (error) {
            console.error(error.message);
            console.log("ERROR FIELD: " + error.message.split(' ')[1])
            return error.message;
        }
    };        
    
    const addPatientToDb = async () => {
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
        
        const errorFieldMessage = areAllFieldsValid(formData, fields);
        if (errorFieldMessage) {
            setErrorMessage(errorFieldMessage);
            return;
        }
        
        const patientToAddFinalData = {
            ...formData,
            BMI: (formData['weight'] / ((formData['height'] / 100) * (formData['height'] / 100))).toFixed(2),
        };
    
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
    
                    const recievedPatientData = await response.json()
                    closeAddPatientMenuHandle();
                    setPatientsData([recievedPatientData, ...patientsData])
                } catch (error) {
                    handleLogout();
                }
            } else {
                console.log("\n\n\n\n\nRESPONSE STATUS: " + response.status)
                switch (response.status) {
                    case 422:
                        setErrorMessage('Ошибка при добавлении пациента. Проверьте все поля.');
                        break;
                    case 409:
                        setErrorMessage('Пациент с таким ИИН уже существует в базе данных.');
                        break;
                    case 500:
                        setErrorMessage('Возникла какая-то ошибка. Попробуйте позже.');
                        break;
                    default:
                        const recievedPatientData = await response.json()
                        closeAddPatientMenuHandle();
                        setPatientsData([recievedPatientData, ...patientsData])
                        closeAddPatientMenuHandle();
                }            
            }
        } catch (error) {
            console.log("An error ocured while trying to fetch the patient data.")
        }
    };
    

    if (redirectTo) {
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <div className="adminAddPatientMenuBox">
            <div className='adminAddPatientMenuHeaderBox'>
                <img src={CloseIcon} className='closeAdminAddPatientMenuButton' alt='' onClick={closeAddPatientMenuHandle} />
            </div>
            <div className='patientDataInputsList'>
                {Object.keys(fields).map((fieldKey) => {
                    const field = fields[fieldKey];
                    const not_to_display_fields = ['is_on_controlled', 'number_of_planned_hospitalizations_with_liver_diseases', 'number_of_planned_hospitalizations_without_liver_diseases', 'number_of_emergency_hospitalizations_with_liver_diseases', 'number_of_emergency_hospitalizations_without_liver_diseases']
                    if (not_to_display_fields.includes(fieldKey)) {
                        return null;
                    }
                    if (field.type === 'enum' || field.type === 'enum_expandable') {
                        return (
                            <div className='patientDataInputsWrapper' key={fieldKey}>
                                <label className='patientDataLabel'>{field.translation || fieldKey}</label>
                                <select className={`patientDataSelect ${!field.required ? '' : 'not-selected'}`} onChange={(event) => handleInputChange(fieldKey, event)}>
                                    {field.default 
                                        ? <option value={field.default}>{field.default}</option>
                                        : <option value="">Выберите опцию...</option>
                                    }
                                    {fieldKey === 'doctor_id' ? doctorsData.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`}
                                        </option>
                                    )) : field.options.map(option => {
                                        if (typeof option === 'object') {
                                            return Object.keys(option).map(key => (
                                                <option key={key} value={key}>{key}</option>
                                            ));
                                        } else if (option !== field.default) {
                                            return <option key={option} value={option}>{option}</option>
                                        }
                                    })}
                                </select>
                                {field.type === 'enum_expandable' && field.options.map(option => {
                                    if (typeof option === 'object' && Object.keys(option).includes(formData[fieldKey])) {
                                        return (
                                            <div className='patientDataInputsWrapper' key={fieldKey}>
                                                <label className='patientDataLabel' style={{marginTop: '20px'}}>
                                                    {fields[Object.values(option)[0]].translation || fieldKey}
                                                </label>
                                                <input className={`patientDataInput`} onChange={(event) => handleInputChange(Object.values(option)[0], event)} />
                                            </div>
                                        );
                                    }
                                })}
                            </div>   
                        );
                    } else if (field.type === 'input') {
                        return (
                            <div className='patientDataInputsWrapper' key={fieldKey}>
                                <label className='patientDataLabel'>{field.translation || fieldKey}</label>
                                <input className={`patientDataInput ${!field.required ? '' : 'not-selected'}`} onChange={(event) => handleInputChange(fieldKey, event)} />
                            </div>
                        );
                    } else if (field.type === 'multiple') {
                        const otherOptionsSelected = formData[fieldKey].some(option => option !== 'Нет' && option !== 'Нет данных');
                        const noDataOptionsSelected = formData[fieldKey].includes('Нет') || formData[fieldKey].includes('Нет данных');
                        const anyOptionSelected = formData[fieldKey].length > 0;

                        return (
                            <div className='patientDataInputsWrapper' key={fieldKey}>
                                <label className='patientDataLabel'>{field.translation || fieldKey}</label>
                                <div className={`patientDataCheckBoxesWrapper ${field.required && !anyOptionSelected ? 'not-selected' : ''}`}>
                                    {field.options.map((option, index) => (
                                        <div key={index}>
                                            <input 
                                                type='checkbox' 
                                                id={`${fieldKey}_${index}`} 
                                                name={fieldKey} 
                                                value={option}
                                                checked={formData[fieldKey].includes(option)}
                                                onChange={event => handleCheckboxChange(fieldKey, option, event)}
                                                disabled={(otherOptionsSelected && (option === 'Нет' || option === 'Нет данных')) || (noDataOptionsSelected && option !== 'Нет' && option !== 'Нет данных')}
                                            />
                                            <label htmlFor={`${fieldKey}_${index}`}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <button className='addPatientButton' onClick={() => addPatientToDb()}>ДОБАВИТЬ ПАЦИЕНТА</button>
            <p className='errorMessage'>{errorMessage}</p>
        </div>
    );        
}
  
export default AdminAddPatientMenu;
