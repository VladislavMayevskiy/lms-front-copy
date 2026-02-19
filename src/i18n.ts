import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

const loadPath = '/i18n/{{lng}}.json';

i18n.use(Backend)
	.use(initReactI18next)
	.init({
		lng: 'en',
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath,
		},
		react: {
			useSuspense: false,
		},
	});

export default i18n;
