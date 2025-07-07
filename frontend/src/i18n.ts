import i18n from "i18next";
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationVI from './locales/vi/translation.json';

const resources = {
    en: {translation: translationEN},
    vi: {translation: translationVI}
};

i18n
    .use(LanguageDetector)  //Tự động phát hiện ngôn ngữ của người dùng
    .use(initReactI18next)  //Kết nối i18next với React
    .init ({
        resources,
        fallbackLng:'vi', // nếu không tìm thấy ngôn ngữ người dùng, sẽ sử dụng tiếng Việt
        interpolation: {
            escapeValue: false // không escape giá trị, để có thể sử dụng HTML trong các chuỗi dịch
        }
    });

    export default i18n;