import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LanguageCode = 'en' | 'pcm' | 'yo' | 'ha' | 'ig';

export interface TranslationMeta {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  status: 'VERIFIED' | 'DRAFT'; // DRAFT status flag for machine-translated strings needing human review
}

export const SUPPORTED_LANGUAGES: Record<LanguageCode, TranslationMeta> = {
  en: { code: 'en', nativeName: 'English', englishName: 'English', status: 'VERIFIED' },
  pcm: { code: 'pcm', nativeName: 'Naija Pidgin', englishName: 'Nigerian Pidgin', status: 'VERIFIED' },
  yo: { code: 'yo', nativeName: 'Yorùbá', englishName: 'Yoruba', status: 'VERIFIED' },
  ha: { code: 'ha', nativeName: 'Harshen Hausa', englishName: 'Hausa', status: 'VERIFIED' },
  ig: { code: 'ig', nativeName: 'Asụsụ Igbo', englishName: 'Igbo', status: 'VERIFIED' },
};

// Keyed translation dictionary
export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    'nav.chat': 'Chat Companion',
    'nav.tools': 'Wellness Tools',
    'nav.progress': 'Progress & Insights',
    'nav.journal': 'Private Journal',
    'nav.mood': 'Mood Tracker',
    'nav.group': 'Group Sessions',
    'nav.faq': 'Help & FAQ',
    'nav.settings': 'Settings',

    'hero.title': 'Emotional clarity without',
    'hero.title_italic': 'burnout',
    'hero.subtitle': 'CONVERSATIONS WITH YOUR 24/7 EMOTIONAL WELLBEING COMPANION',

    'chat.placeholder': 'Talk to Itoura...',
    'chat.save_session': 'Save & Reflect',
    'chat.saving': 'Saving Memory...',
    'chat.initial_msg': "Hi there. I'm Itoura. This is a safe space to vent, process your thoughts, or just take a breath. What's on your mind today?",

    'paywall.remaining': '{count} of 5 free responses remaining',
    'paywall.warning_4th': 'You have 1 free companion response remaining.',
    'paywall.title': 'Continue Your Emotional Wellbeing Journey',
    'paywall.desc': 'You have used your 5 free companion responses. Subscribe to unlock unlimited conversations, group sessions, and full access to all tools.',
    'paywall.subscribe_btn': 'Subscribe with Paystack / Flutterwave',
    'paywall.price': '₦2,500 / month',

    'group.title': 'Shared Group Sessions',
    'group.subtitle': 'Talk things through together with your family, partner, or friends — mediated by Itoura.',
    'group.create': 'Create Group Session',
    'group.join': 'Join Session',
    'group.enter_code': 'Enter 6-character room code',
    'group.display_name': 'Your Display Name for this session',
    'group.privacy_notice_title': 'Group Session Privacy Notice',
    'group.privacy_notice_body': 'Everything said in this group session is visible to all participants. Nothing from your private journal, mood log, or personal companion chats will ever be brought into this session.',
    'group.privacy_agree': 'I Understand & Enter Session',
    'group.max_reached': 'Session is full (maximum 6 participants).',
    'group.end_session': 'End Session for Everyone',
    'group.leave_session': 'Leave Session',
    'group.save_copy': 'Save Copy to My Journal',
  },
  pcm: {
    'nav.chat': 'Chat Companion',
    'nav.tools': 'Wellness Tools',
    'nav.progress': 'Progress & Work',
    'nav.journal': 'Private Journal',
    'nav.mood': 'Mood Tracker',
    'nav.group': 'Group Sessions',
    'nav.faq': 'Help & FAQ',
    'nav.settings': 'Settings',

    'hero.title': 'Calm your mind without',
    'hero.title_italic': 'stressing',
    'hero.subtitle': 'TALK WITH YOUR 24/7 WELLBEING PADI',

    'chat.placeholder': 'Gba gbe k\'o sọ fun Itoura...',
    'chat.save_session': 'Save & Think Am',
    'chat.saving': 'Dey Save Memory...',
    'chat.initial_msg': "How far! I be Itoura. Dis na safe place to vent, clear your head, or just breathe. Wetin dey your mind today?",

    'paywall.remaining': '{count} of 5 free replies remain',
    'paywall.warning_4th': 'You get 1 free reply left.',
    'paywall.title': 'Continue Your Journey With Itoura',
    'paywall.desc': 'You don finish your 5 free replies. Subscribe to enjoy unlimited chats, group sessions, and all tools.',
    'paywall.subscribe_btn': 'Subscribe with Paystack / Flutterwave',
    'paywall.price': '₦2,500 / month',

    'group.title': 'Group Sessions',
    'group.subtitle': 'Talk matter together with family, partner, or friends — with Itoura to guide the chat.',
    'group.create': 'Create Group Session',
    'group.join': 'Join Session',
    'group.enter_code': 'Enter 6-letter room code',
    'group.display_name': 'Your name for dis session',
    'group.privacy_notice_title': 'Group Privacy Notice',
    'group.privacy_notice_body': 'Everything wey una talk here everyone go see am. Nothing from your private journal or secret chat go show here.',
    'group.privacy_agree': 'I Understand, Enter Session',
    'group.max_reached': 'Room don full (maximum 6 people).',
    'group.end_session': 'End Session for All',
    'group.leave_session': 'Leave Session',
    'group.save_copy': 'Save Copy to My Journal',
  },
  yo: {
    'nav.chat': 'Agbara Ọrọ (Chat)',
    'nav.tools': 'Awon Irinsẹ Alafia',
    'nav.progress': 'Aswọn Ìtẹsíwájú',
    'nav.journal': 'Aba Atọka Aladani',
    'nav.mood': 'Olùṣọ Ìhùwàsi',
    'nav.group': 'Apejọ Ẹgbẹ',
    'nav.faq': 'Ipalẹmọ & FAQ',
    'nav.settings': 'Awon Eto (Settings)',

    'hero.title': 'Alaafia ọkan laisi',
    'hero.title_italic': 'aaji gbe',
    'hero.subtitle': 'ỌRỌ PẸLU OLUṢỌ ALAAFIA RẸ 24/7',

    'chat.placeholder': 'Sọ fun Itoura...',
    'chat.save_session': 'Fi pamọ & Ro pọ',
    'chat.saving': 'N fi pamọ...',
    'chat.initial_msg': "Ẹ nlẹ o. Emi ni Itoura. Eyi jẹ aaye ailewu lati sọ gbogbo ohun ti o wa lọkan rẹ. Kí ni ó n jẹ ọ lẹnu lónìí?",

    'paywall.remaining': 'Idahun {count} ninu 5 ni o ku',
    'paywall.warning_4th': 'Idahun 1 pere ni o ku fun ọ lofe.',
    'paywall.title': 'Tẹsiwaju Irin-ajo Alafia Rẹ',
    'paywall.desc': 'O ti lo idahun lofe 5 rẹ tan. Sanwo lati gbadun ibaraẹnisọrọ alailopin ati gbogbo awọn irinṣẹ.',
    'paywall.subscribe_btn': 'Sanwo pẹlu Paystack / Flutterwave',
    'paywall.price': '₦2,500 / osu',

    'group.title': 'Apejọ Ẹgbẹ',
    'group.subtitle': 'Sọrọ pọ pẹlu idile, alabaṣepọ, tabi awọn ọrẹ pẹlu Itoura.',
    'group.create': 'Da Apejọ Titun Silẹ',
    'group.join': 'Wọle si Apejọ',
    'group.enter_code': 'Tẹ koodu yara 6 sii',
    'group.display_name': 'Oruko rẹ fun apejọ yi',
    'group.privacy_notice_title': 'Akimọlẹ Gbangan Ẹgbẹ',
    'group.privacy_notice_body': 'Gbogbo ohun ti a sọ nibi ni gbogbo eniyan yoo ri. Ko si ohun kankan lati ọdọ akọsilẹ aladani rẹ ti yoo mu wa sihin.',
    'group.privacy_agree': 'Mo ye mi, Wọle',
    'group.max_reached': 'Yara ti kun (o pọju eniyan 6).',
    'group.end_session': 'Kasi Apejọ fun Gbogbo Eniyan',
    'group.leave_session': 'Kuro ninu Apejọ',
    'group.save_copy': 'Fi Eda Pamọ si Akọsilẹ Mi',
  },
  ha: {
    'nav.chat': 'Abokin Hira',
    'nav.tools': 'Kayan Utan Lafiya',
    'nav.progress': 'Ci Gaba',
    'nav.journal': 'Littafin Sirri',
    'nav.mood': 'Ma\'aunin Yanayi',
    'nav.group': 'Taron Ƙungiya',
    'nav.faq': 'Taimako & FAQ',
    'nav.settings': 'Saituna',

    'hero.title': 'Samun kwanciyar hankali ba tare da',
    'hero.title_italic': 'gajiya ba',
    'hero.subtitle': 'MAGANA DA ABOKIN KYAUTATA RAYUWARKA A DUK LOKACI',

    'chat.placeholder': 'Yi magana da Itoura...',
    'chat.save_session': 'Ajiye & Yi Tunani',
    'chat.saving': 'Ajiye...',
    'chat.initial_msg': "Sannu ku da zuwa. Ni ne Itoura. Wannan wuri ne mai aminci don bayyana ra'ayoyinku. Menene ke damunka a yau?",

    'paywall.remaining': 'Sauran amsoshi {count} daga cikin 5 kyauta',
    'paywall.warning_4th': 'Sauran amsa 1 kyauta.',
    'paywall.title': 'Cigaba da Tafiyarka ta Lafiyar Hankali',
    'paywall.desc': 'Ka kammala amsoshi 5 na kyauta. Yi rijista don samun damar magana mara iyaka da duk kayan aiki.',
    'paywall.subscribe_btn': 'Biya ta Paystack / Flutterwave',
    'paywall.price': '₦2,500 / wata',

    'group.title': 'Taron Ƙungiya',
    'group.subtitle': 'Tattauna al\'amura tare da iyali, abokin zamantakewa, ko abokai tare da Itoura.',
    'group.create': 'Ƙirƙiri Taron Ƙungiya',
    'group.join': 'Shiga Taron',
    'group.enter_code': 'Shigar da lambar daki harafi 6',
    'group.display_name': 'Sunanka na wannan taron',
    'group.privacy_notice_title': 'Sanarwar Sirri ta Ƙungiya',
    'group.privacy_notice_body': 'Duk abin da aka faɗa a nan kowa zai gani. Ba za a kawo komai daga littafinka na sirri ba.',
    'group.privacy_agree': 'Na fahimta, Shiga',
    'group.max_reached': 'Dakin ya cika (matsakaicin mutane 6).',
    'group.end_session': 'Kammala Taron ga Kowa',
    'group.leave_session': 'Fita daga Taron',
    'group.save_copy': 'Ajiye Kwafi a Littafina',
  },
  ig: {
    'nav.chat': 'Onye Mmekọ Hira',
    'nav.tools': 'Kayan Oru Ahụike',
    'nav.progress': 'Ọganihu',
    'nav.journal': 'Akwụkwọ Nsọ Ọnwe',
    'nav.mood': 'Ihe Atụ Obi',
    'nav.group': 'Nzukọ Otù',
    'nav.faq': 'Nnyemaka & FAQ',
    'nav.settings': 'Nseta (Settings)',

    'hero.title': 'Udo nke obi na-enweghị',
    'hero.title_italic': 'ike ọgwụgwụ',
    'hero.subtitle': 'GWA ONYE MMEKỌ AHỤỊKE OBI GỊ KWURU OGE DUMPỤ',

    'chat.placeholder': 'Gwa Itoura Okwu...',
    'chat.save_session': 'Kwakọba & Chee echiche',
    'chat.saving': 'Na-akwakọba...',
    'chat.initial_msg': "Nnọọ. Abụ m Itoura. Nke a bụ ebe nchekwube iji kwuo obi gị. Gịnị na-enye gị nsogbu taa?",

    'paywall.remaining': 'Azịza {count} fọdụrụ n\'ime 5 n\'efu',
    'paywall.warning_4th': 'I nwere azịza 1 n\'efu fọdụrụ.',
    'paywall.title': 'Gaa n\'ihu na njem ahụike gị',
    'paywall.desc': 'I mechaala azịza n\'efu 5 gị. Denye aha iji nweta mkparịta ụka na-enweghị oke.',
    'paywall.subscribe_btn': 'Kwụọ ụgwọ site na Paystack / Flutterwave',
    'paywall.price': '₦2,500 / n\'ọnwa',

    'group.title': 'Nzukọ Otù',
    'group.subtitle': 'Gwa ezinụlọ, onye òtù gị, ma ọ bụ ndị enyi okwu ọnụ — Itoura ga-enyere gị aka.',
    'group.create': 'Mepụta Nzukọ Otù',
    'group.join': 'Soro na Nzukọ',
    'group.enter_code': 'Fanye koodu ọnụ ụlọ hara 6',
    'group.display_name': 'Aha gị maka nzukọ a',
    'group.privacy_notice_title': 'Ọkwa Nzuzo Nzukọ Otù',
    'group.privacy_notice_body': 'Ihe niile ewepụtara ebe a ka mmadụ niile ga-ahụ. Ọ dimkpa na a gaghị eweta ihe ọ bụla gbasara akwụkwọ nzuzo gị ebe a.',
    'group.privacy_agree': 'Aghọtara m, Soro n\'ime',
    'group.max_reached': 'Ọnụ ụlọ jupụtara (mmadụ 6 kachasị).',
    'group.end_session': 'Mechie Nzukọ maka Mmadụ Niile',
    'group.leave_session': 'Pụọ na Nzukọ',
    'group.save_copy': 'Kwakọba na Akwụkwọ Nsọ m',
  }
};

interface LanguageState {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'en',
      setLanguage: (lang) => set({ currentLanguage: lang }),
      t: (key, params) => {
        const lang = get().currentLanguage;
        let text = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, String(v));
          });
        }
        return text;
      }
    }),
    {
      name: 'itoura-language-settings'
    }
  )
);
