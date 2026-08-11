import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LanguageCode = 'en' | 'pcm' | 'yo' | 'ha' | 'ig';

export interface TranslationMeta {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  status: 'VERIFIED' | 'DRAFT';
}

export const SUPPORTED_LANGUAGES: Record<LanguageCode, TranslationMeta> = {
  en: { code: 'en', nativeName: 'English', englishName: 'English', status: 'VERIFIED' },
  pcm: { code: 'pcm', nativeName: 'Naija Pidgin', englishName: 'Nigerian Pidgin', status: 'VERIFIED' },
  yo: { code: 'yo', nativeName: 'Yorùbá', englishName: 'Yoruba', status: 'VERIFIED' },
  ha: { code: 'ha', nativeName: 'Harshen Hausa', englishName: 'Hausa', status: 'VERIFIED' },
  ig: { code: 'ig', nativeName: 'Asụsụ Igbo', englishName: 'Igbo', status: 'VERIFIED' },
};

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav
    'nav.chat': 'Chat Companion',
    'nav.tools': 'Wellness Tools',
    'nav.progress': 'Progress & Insights',
    'nav.journal': 'Private Journal',
    'nav.mood': 'Mood Tracker',
    'nav.group': 'Group Sessions',
    'nav.faq': 'Help & FAQ',
    'nav.settings': 'Settings',

    // Hero
    'hero.title': 'Emotional clarity without',
    'hero.title_italic': 'burnout',
    'hero.subtitle': 'CONVERSATIONS WITH YOUR 24/7 EMOTIONAL WELLBEING COMPANION',

    // Chat
    'chat.placeholder': 'Talk to Itoura...',
    'chat.save_session': 'Save & Reflect',
    'chat.saving': 'Saving Memory...',
    'chat.initial_msg': "Hi there. I'm Itoura. This is a safe space to vent, process your thoughts, or just take a breath. What's on your mind today?",
    
    // Chips
    'chip.anxious': 'Anxious',
    'chip.exhausted': 'Exhausted',
    'chip.overwhelmed': 'Overwhelmed',
    'chip.okay': 'Doing Okay',
    'chip.anxious_prompt': "I'm feeling pretty anxious today.",
    'chip.exhausted_prompt': "I am completely exhausted.",
    'chip.overwhelmed_prompt': "I feel really overwhelmed.",
    'chip.okay_prompt': "I'm actually doing okay.",

    // Tools Page
    'tools.title': 'Wellness Tools',
    'tools.subtitle': 'Take a moment for yourself. Choose an exercise to help you reset.',
    'tools.begin': 'Begin Exercise',
    'tools.breathe_title': 'Box Breathing',
    'tools.breathe_desc': 'A simple technique to quickly regulate your nervous system with equal 4-second intervals.',
    'tools.grounding_title': '5-4-3-2-1 Grounding',
    'tools.grounding_desc': 'Engage your physical senses to bring yourself back to the present moment.',
    'tools.meditation_title': 'Mindful Moment',
    'tools.meditation_desc': 'Guided reflection to help process complex emotions and quiet your mind.',
    'tools.break_title': 'Take a Break',
    'tools.break_desc': 'Disconnect, rest your eyes, and step away from work screens.',

    // Progress Page
    'progress.title': 'Your Progress',
    'progress.subtitle': 'Patterns, reflections, and how you\'re doing over time.',
    'progress.trend_title': 'Mood Trend (Past 7 Days)',
    'progress.days_count': '{count} of 7 days',
    'progress.top_themes': 'Top Themes',
    'progress.no_themes': 'No themes recorded yet. Have a chat with Itoura to see patterns.',
    'progress.weekly_reflection': 'Weekly Reflection',
    'progress.next_step': 'Suggested Next Step',

    // Journal Page
    'journal.title': 'Your Journal',
    'journal.subtitle': 'A private space for your thoughts.',
    'journal.new_entry': 'New Entry',
    'journal.save_entry': 'Save Entry',
    'journal.back': 'Back',
    'journal.title_placeholder': 'Give your thoughts a title...',
    'journal.content_placeholder': 'What\'s on your mind? This space is entirely yours...',
    'journal.no_entries_title': 'No entries yet',
    'journal.no_entries_desc': 'Writing down your feelings is a powerful way to process them. Start your first entry whenever you\'re ready.',
    'journal.write_first': 'Write First Entry',

    // Mood Page
    'mood.title': 'Mood Check-in',
    'mood.subtitle': 'Take a moment to reflect on how you\'re feeling right now.',
    'mood.patterns': 'Recent Patterns',
    'mood.how_feeling': 'How are you feeling?',
    'mood.energy_level': 'Energy Level',
    'mood.exhausted': 'Exhausted',
    'mood.energized': 'Energized',
    'mood.note_label': 'Add a note (optional)',
    'mood.note_placeholder': 'What\'s making you feel this way?',
    'mood.save_btn': 'Save Check-in',
    'mood.history': 'Recent History',
    'mood.no_history': 'No check-ins yet. Start tracking your mood above.',
    'mood.terrible': 'Terrible',
    'mood.bad': 'Bad',
    'mood.okay': 'Okay',
    'mood.good': 'Good',
    'mood.great': 'Great',

    // Settings Page
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account, privacy, and companion memory',
    'settings.account': 'Account',
    'settings.privacy': 'Privacy & Confidentiality',
    'settings.memory': 'Companion Memory',
    'settings.preferences': 'Preferences',
    'settings.local_storage': 'Privacy & Local Storage',

    // FAQ Page
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Everything you need to know about your new companion.',
    'faq.still_questions': 'Still have questions?',
    'faq.contact_support': 'Contact Support',

    // Daily Popup
    'daily.reminder': 'Daily Reminder',
    'daily.start': 'Start My Day',

    // Paywall
    'paywall.remaining': '{count} of 5 free responses remaining',
    'paywall.warning_4th': 'You have 1 free companion response remaining.',
    'paywall.title': 'Continue Your Emotional Wellbeing Journey',
    'paywall.desc': 'You have used your 5 free companion responses. Subscribe to unlock unlimited conversations, group sessions, and full access to all tools.',
    'paywall.subscribe_btn': 'Pay with Paystack (Card / Transfer / USSD)',
    'paywall.price': '₦2,500 / month',

    // Group
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
    // Nav
    'nav.chat': 'Chat Companion',
    'nav.tools': 'Wellness Tools',
    'nav.progress': 'Progress & Work',
    'nav.journal': 'Private Journal',
    'nav.mood': 'Mood Tracker',
    'nav.group': 'Group Sessions',
    'nav.faq': 'Help & FAQ',
    'nav.settings': 'Settings',

    // Hero
    'hero.title': 'Calm your mind without',
    'hero.title_italic': 'stressing',
    'hero.subtitle': 'TALK WITH YOUR 24/7 WELLBEING PADI',

    // Chat
    'chat.placeholder': 'Talk to Itoura...',
    'chat.save_session': 'Save & Think Am',
    'chat.saving': 'Dey Save Memory...',
    'chat.initial_msg': "How far! I be Itoura. Dis na safe place to vent, clear your head, or just breathe. Wetin dey your mind today?",

    // Chips
    'chip.anxious': 'Tension Dey Body',
    'chip.exhausted': 'Body Don Weak',
    'chip.overwhelmed': 'Everything Don Full Head',
    'chip.okay': 'I Dey Okay',
    'chip.anxious_prompt': "Tension dey my body today.",
    'chip.exhausted_prompt': "Body don weak me finish.",
    'chip.overwhelmed_prompt': "Everything just don full my head.",
    'chip.okay_prompt': "I dey manage, I dey okay.",

    // Tools Page
    'tools.title': 'Wellness Tools',
    'tools.subtitle': 'Take small time for yourself. Pick exercise make you reset.',
    'tools.begin': 'Start Exercise',
    'tools.breathe_title': 'Box Breathing',
    'tools.breathe_desc': 'Simple breathing exercise to calm your body.',
    'tools.grounding_title': '5-4-3-2-1 Grounding',
    'tools.grounding_desc': 'Use your eyes and body to come back to the present moment.',
    'tools.meditation_title': 'Mindful Moment',
    'tools.meditation_desc': 'Guided thinking to help quiet your mind.',
    'tools.break_title': 'Take a Break',
    'tools.break_desc': 'Step away from screen and rest your eyes small.',

    // Progress Page
    'progress.title': 'Your Progress',
    'progress.subtitle': 'How your mind dey go over time.',
    'progress.trend_title': 'Mood Trend (Past 7 Days)',
    'progress.days_count': '{count} of 7 days',
    'progress.top_themes': 'Top Matter Wey Dey Your Mind',
    'progress.no_themes': 'No themes recorded yet. Talk with Itoura to see patterns.',
    'progress.weekly_reflection': 'Weekly Reflection',
    'progress.next_step': 'Next Step To Take',

    // Journal Page
    'journal.title': 'Your Journal',
    'journal.subtitle': 'Private place for your secret thoughts.',
    'journal.new_entry': 'New Entry',
    'journal.save_entry': 'Save Entry',
    'journal.back': 'Back',
    'journal.title_placeholder': 'Give your thought a title...',
    'journal.content_placeholder': 'Wetin dey your mind? Dis place na 100% yours...',
    'journal.no_entries_title': 'Nothing dey here yet',
    'journal.no_entries_desc': 'To write down your mind na powerful way to rest. Start your first entry anytime.',
    'journal.write_first': 'Write First Entry',

    // Mood Page
    'mood.title': 'Mood Check-in',
    'mood.subtitle': 'Take small time check how your body dey feel right now.',
    'mood.patterns': 'Recent Patterns',
    'mood.how_feeling': 'How you dey feel?',
    'mood.energy_level': 'Energy Level',
    'mood.exhausted': 'Body Don Weak',
    'mood.energized': 'Full Of Energy',
    'mood.note_label': 'Add small note (optional)',
    'mood.note_placeholder': 'Wetin make you feel dis way?',
    'mood.save_btn': 'Save Check-in',
    'mood.history': 'Recent History',
    'mood.no_history': 'No check-in yet. Start tracking above.',
    'mood.terrible': 'Worst',
    'mood.bad': 'Bad',
    'mood.okay': 'Okay',
    'mood.good': 'Good',
    'mood.great': 'Very Good',

    // Settings Page
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your privacy and memory',
    'settings.account': 'Account',
    'settings.privacy': 'Privacy & Confidentiality',
    'settings.memory': 'Companion Memory',
    'settings.preferences': 'Preferences',
    'settings.local_storage': 'Privacy & Local Storage',

    // FAQ Page
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Everything you need to know about Itoura.',
    'faq.still_questions': 'Still get questions?',
    'faq.contact_support': 'Contact Support',

    // Daily Popup
    'daily.reminder': 'Daily Reminder',
    'daily.start': 'Start My Day',

    // Paywall
    'paywall.remaining': '{count} of 5 free replies remain',
    'paywall.warning_4th': 'You get 1 free reply left.',
    'paywall.title': 'Continue Your Journey With Itoura',
    'paywall.desc': 'You don finish your 5 free replies. Subscribe to enjoy unlimited chats, group sessions, and all tools.',
    'paywall.subscribe_btn': 'Pay with Paystack (Card / Transfer / USSD)',
    'paywall.price': '₦2,500 / month',

    // Group
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
    // Nav
    'nav.chat': 'Agbara Ọrọ (Chat)',
    'nav.tools': 'Awọn Irinṣẹ Alaafia',
    'nav.progress': 'Awọn Ìtẹsíwájú',
    'nav.journal': 'Àkọsílẹ̀ Aladani',
    'nav.mood': 'Olùṣọ́ Ìhùwàsí',
    'nav.group': 'Àpèjọ Ẹgbẹ́',
    'nav.faq': 'Ìpalẹmọ́ & FAQ',
    'nav.settings': 'Awọn Ètò',

    // Hero
    'hero.title': 'Alaafia ọkan laisi',
    'hero.title_italic': 'aaji gbe',
    'hero.subtitle': 'ỌRỌ PẸLU OLUṢỌ ALAAFIA RẸ 24/7',

    // Chat
    'chat.placeholder': 'Sọ fun Itoura...',
    'chat.save_session': 'Fi pamọ & Ro pọ',
    'chat.saving': 'N fi pamọ...',
    'chat.initial_msg': "Ẹ nlẹ o. Emi ni Itoura. Eyi jẹ aaye ailewu lati sọ gbogbo ohun ti o wa lọkan rẹ. Kí ni ó n jẹ ọ lẹnu lónìí?",

    // Chips
    'chip.anxious': 'Ẹrù Ń Ba Mi',
    'chip.exhausted': 'Aagba Ti Bá Mi',
    'chip.overwhelmed': 'Ọ̀ràn Pọ̀ Lọ́kàn Mi',
    'chip.okay': 'Mo Wà Dada',
    'chip.anxious_prompt': "Ẹrù ń ba mi lọ́jọ́ lónìí.",
    'chip.exhausted_prompt': "Aagba ti bá mi pátápátá.",
    'chip.overwhelmed_prompt': "Ọ̀ràn pọ̀ púpọ̀ lọ́kàn mi lónìí.",
    'chip.okay_prompt': "Mo wà dada, alàáfíà ni.",

    // Tools Page
    'tools.title': 'Awọn Irinṣẹ Alaafia',
    'tools.subtitle': 'Gba àkókò díẹ̀ fún ara rẹ. Sọ ara rẹ di tuntun pẹ̀lú awọn irinṣẹ wọnyí.',
    'tools.begin': 'Bẹ̀rẹ̀ Ìdánrawò',
    'tools.breathe_title': 'Èémí Box Breathing',
    'tools.breathe_desc': 'Ọ̀nà rọrùn lati pèsè àlàáfíà fún agbára rẹ.',
    'tools.grounding_title': 'Ìtẹ̀síwájú 5-4-3-2-1',
    'tools.grounding_desc': 'Lò awọn ìmọ̀ ara rẹ lati padà si àkókò ìsinsìnyí.',
    'tools.meditation_title': 'Àkókò Àdárakọ',
    'tools.meditation_desc': 'Àṣàrò lati mú kúrò ninu riru ọkàn.',
    'tools.break_title': 'Gba Ìsinmi',
    'tools.break_desc': 'Fi àwòrán kọ̀mpútà sílẹ̀ lati sinmi ojú rẹ.',

    // Progress Page
    'progress.title': 'Awọn Ìtẹsíwájú Rẹ',
    'progress.subtitle': 'Àwòrán ìhùwàsí ati àṣàrò rẹ ní gbogbo àkókò.',
    'progress.trend_title': 'Ìhùwàsí (Ọjọ́ 7 Sẹ́yìn)',
    'progress.days_count': 'Ọjọ́ {count} ninu 7',
    'progress.top_themes': 'Awọn Ọ̀ràn Pàtàkì',
    'progress.no_themes': 'Kò sí ọ̀ràn kankan ti a kọ sílẹ̀ pẹ̀lú Itoura síbẹ̀.',
    'progress.weekly_reflection': 'Àṣàrò Ọ̀sẹ̀',
    'progress.next_step': 'Ìgbésẹ̀ Kan Lati Gbe',

    // Journal Page
    'journal.title': 'Àkọsílẹ̀ Aladani Rẹ',
    'journal.subtitle': 'Ààyè àdáni fún àwọn èrò rẹ.',
    'journal.new_entry': 'Àkọsílẹ̀ Titun',
    'journal.save_entry': 'Fi Àkọsílẹ̀ Pamọ́',
    'journal.back': 'Padà',
    'journal.title_placeholder': 'Tẹ orukọ fún èrò rẹ...',
    'journal.content_placeholder': 'Kí ni ó wa lọ́kàn rẹ? Ààyè yìí jẹ́ tìrẹ pátápátá...',
    'journal.no_entries_title': 'Kò sí àkọsílẹ̀ síbẹ̀',
    'journal.no_entries_desc': 'Kíkọ èrò rẹ sílẹ̀ jẹ́ ọ̀nà agbára lati pèsè àlàáfíà fún ọkàn rẹ.',
    'journal.write_first': 'Kọ Àkọsílẹ̀ Àkọ́kọ́',

    // Mood Page
    'mood.title': 'Ìgbéyẹ̀wò Ìhùwàsí',
    'mood.subtitle': 'Yẹ ara rẹ wo bí ó ṣe ń rí lára rẹ lónìí.',
    'mood.patterns': 'Àwòṣe Ìhùwàsí',
    'mood.how_feeling': 'Báwo ni ó ṣe ń rí lára rẹ?',
    'mood.energy_level': 'Agbára Ara',
    'mood.exhausted': 'Aagba Ti Bá Mi',
    'mood.energized': 'Agbára Pọ̀',
    'mood.note_label': 'Kọ àkọsílẹ̀ díẹ̀ (ti o ba fẹ́)',
    'mood.note_placeholder': 'Kí ni ó mú ọ rí bẹ́ẹ̀?',
    'mood.save_btn': 'Fi Ìgbéyẹ̀wò Pamọ́',
    'mood.history': 'Ìtàn Ìhùwàsí Sẹ́yìn',
    'mood.no_history': 'Kò sí ìgbéyẹ̀wò síbẹ̀.',
    'mood.terrible': 'Burú Púpọ̀',
    'mood.bad': 'Burú',
    'mood.okay': 'O Wà Dada',
    'mood.good': 'Dada',
    'mood.great': 'Dada Púpọ̀',

    // Settings Page
    'settings.title': 'Awọn Ètò',
    'settings.subtitle': 'Agbára àkọsílẹ̀ ati àmọ̀dání rẹ',
    'settings.account': 'Akauntì',
    'settings.privacy': 'Àṣírí Ati Àbò',
    'settings.memory': 'Ìrántí Olùṣọ́',
    'settings.preferences': 'Awọn Ìfẹsẹntẹ́',
    'settings.local_storage': 'Àbò Lórí Ẹ̀rọ Rẹ',

    // FAQ Page
    'faq.title': 'Awọn Ìbéèrè Ti A N Beere Púpọ̀',
    'faq.subtitle': 'Gbogbo ohun ti o gbọ́dọ̀ mọ̀ nipa olùṣọ́ titun rẹ.',
    'faq.still_questions': 'Ṣé o tún ní ìbéèrè?',
    'faq.contact_support': 'Ṣìkẹ́ Ìranwọ́',

    // Daily Popup
    'daily.reminder': 'Ìránntí Lójoojúmọ́',
    'daily.start': 'Bẹ̀rẹ̀ Ọjọ́ Mi',

    // Paywall
    'paywall.remaining': 'Idahun {count} ninu 5 ni o ku',
    'paywall.warning_4th': 'Idahun 1 pere ni o ku fun ọ lofe.',
    'paywall.title': 'Tẹsiwaju Irin-ajo Alafia Rẹ',
    'paywall.desc': 'O ti lo idahun lofe 5 rẹ tan. Sanwo lati gbadun ibaraẹnisọrọ alailopin ati gbogbo awọn irinṣẹ.',
    'paywall.subscribe_btn': 'Sanwo pẹlu Paystack (Card / Transfer / USSD)',
    'paywall.price': '₦2,500 / osu',

    // Group
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
    // Nav
    'nav.chat': 'Abokin Hira',
    'nav.tools': 'Kayan Utan Lafiya',
    'nav.progress': 'Ci Gaba',
    'nav.journal': 'Littafin Sirri',
    'nav.mood': 'Ma\'aunin Yanayi',
    'nav.group': 'Taron Ƙungiya',
    'nav.faq': 'Taimako & FAQ',
    'nav.settings': 'Saituna',

    // Hero
    'hero.title': 'Samun kwanciyar hankali ba tare da',
    'hero.title_italic': 'gajiya ba',
    'hero.subtitle': 'MAGANA DA ABOKIN KYAUTATA RAYUWARKA A DUK LOKACI',

    // Chat
    'chat.placeholder': 'Yi magana da Itoura...',
    'chat.save_session': 'Ajiye & Yi Tunani',
    'chat.saving': 'Ajiye...',
    'chat.initial_msg': "Sannu ku da zuwa. Ni ne Itoura. Wannan wuri ne mai aminci don bayyana ra'ayoyinku. Menene ke damunka a yau?",

    // Chips
    'chip.anxious': 'Ruhina Yana Da Damuwa',
    'chip.exhausted': 'Na Gaji Kwarai',
    'chip.overwhelmed': 'Matsaloli Sun Yi Yawa',
    'chip.okay': 'Ina Lafiya',
    'chip.anxious_prompt': "Ruhina yana cikin tashin hankali a yau.",
    'chip.exhausted_prompt': "Na gaji kwarai da gaske.",
    'chip.overwhelmed_prompt': "Tunanina ya cika da matsatsun abubuwa.",
    'chip.okay_prompt': "Ina lafiya lau.",

    // Tools Page
    'tools.title': 'Kayan Utan Lafiya',
    'tools.subtitle': 'Kula da kanka kankan lokaci. Zaɓi motsa jiki don sanya natsuwa.',
    'tools.begin': 'Fara Motsa Jiki',
    'tools.breathe_title': 'Buga Numfashi',
    'tools.breathe_desc': 'Hanya mai sauƙi don daidaita kanka.',
    'tools.grounding_title': 'Sauraron Hankali 5-4-3-2-1',
    'tools.grounding_desc': 'Yi amfani da jikinka don komawa ga lokacin yanzu.',
    'tools.meditation_title': 'Lokacin Natsuwa',
    'tools.meditation_desc': 'Tunani mai jagora don kwantar da hankalinka.',
    'tools.break_title': 'Samun Hutu',
    'tools.break_desc': 'Ka huta da komfuta ka hutar da idanuwanka.',

    // Progress Page
    'progress.title': 'Ci Gabanka',
    'progress.subtitle': 'Yanayin tunanikinka a tsawon lokaci.',
    'progress.trend_title': 'Yanayin Zuciya (Kwanaki 7 Na Baya)',
    'progress.days_count': 'Kwanaki {count} daga 7',
    'progress.top_themes': 'Babban Abubuwan Tunani',
    'progress.no_themes': 'Ba a rubuta komai ba tukuna da Itoura.',
    'progress.weekly_reflection': 'Tunani Na Mako',
    'progress.next_step': 'Mataki Na Gaba',

    // Journal Page
    'journal.title': 'Littafin Sirri',
    'journal.subtitle': 'Wuri na musamman don tunaninka.',
    'journal.new_entry': 'Sabon Rubutu',
    'journal.save_entry': 'Ajiye Rubutu',
    'journal.back': 'Baya',
    'journal.title_placeholder': 'Ba tunaninka suna...',
    'journal.content_placeholder': 'Menene ke zuciyarka? Wannan wurin naka ne...',
    'journal.no_entries_title': 'Babu rubutu tukuna',
    'journal.no_entries_desc': 'Rubuta abin da ke zuciyarka hanya ce mai kyau ta samun natsuwa.',
    'journal.write_first': 'Rubuta Na Farko',

    // Mood Page
    'mood.title': 'Ma\'aunin Yanayi',
    'mood.subtitle': 'Duba yadda kake ji a jikinka a yanzu.',
    'mood.patterns': 'Kayan Yanayi Na Kusa',
    'mood.how_feeling': 'Yaya kake ji?',
    'mood.energy_level': 'Ƙarfin Jiki',
    'mood.exhausted': 'Na Gaji Kwarai',
    'mood.energized': 'Da Cikakken Ƙarfi',
    'mood.note_label': 'Ƙara ɗan bayani (na zaɓi)',
    'mood.note_placeholder': 'Menene ya sa kake ji haka?',
    'mood.save_btn': 'Ajiye Yanayi',
    'mood.history': 'Tarihin Yanayi Na Baya',
    'mood.no_history': 'Babu bayanan yanayi tukuna.',
    'mood.terrible': 'Mummuna',
    'mood.bad': 'Mara Kyau',
    'mood.okay': 'Da Dadi',
    'mood.good': 'Mai Kyau',
    'mood.great': 'Kyakkyawa Kwarai',

    // Settings Page
    'settings.title': 'Saituna',
    'settings.subtitle': 'Gudanar da sirrinka da tunanin aboki',
    'settings.account': 'Asansu (Account)',
    'settings.privacy': 'Sirri Da Kariya',
    'settings.memory': 'Tunawa Ta Aboki',
    'settings.preferences': 'Zaɓaɓɓun Saituna',
    'settings.local_storage': 'Kariya A Na\'urarka',

    // FAQ Page
    'faq.title': 'Tambayoyi Da Aka Fi Yi',
    'faq.subtitle': 'Duk abin da kake buƙatar sani game da sabon abokinka.',
    'faq.still_questions': 'Har yanzu kana da tambayoyi?',
    'faq.contact_support': 'Tuntubi Taimako',

    // Daily Popup
    'daily.reminder': 'Tunatarwa Ta Kullum',
    'daily.start': 'Fara Ranata',

    // Paywall
    'paywall.remaining': 'Sauran amsoshi {count} daga cikin 5 kyauta',
    'paywall.warning_4th': 'Sauran amsa 1 kyauta.',
    'paywall.title': 'Cigaba da Tafiyarka ta Lafiyar Hankali',
    'paywall.desc': 'Ka kammala amsoshi 5 na kyauta. Yi rijista don samun damar magana mara iyaka da duk kayan aiki.',
    'paywall.subscribe_btn': 'Biya ta Paystack (Card / Transfer / USSD)',
    'paywall.price': '₦2,500 / wata',

    // Group
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
    // Nav
    'nav.chat': 'Onye Mmekọ Hira',
    'nav.tools': 'Kayan Oru Ahụike',
    'nav.progress': 'Ọganihu',
    'nav.journal': 'Akwụkwọ Nsọ Ọnwe',
    'nav.mood': 'Ihe Atụ Obi',
    'nav.group': 'Nzukọ Otù',
    'nav.faq': 'Nnyemaka & FAQ',
    'nav.settings': 'Nseta (Settings)',

    // Hero
    'hero.title': 'Udo nke obi na-enweghị',
    'hero.title_italic': 'ike ọgwụgwụ',
    'hero.subtitle': 'GWA ONYE MMEKỌ AHỤỊKE OBI GỊ KWURU OGE DUMPỤ',

    // Chat
    'chat.placeholder': 'Gwa Itoura Okwu...',
    'chat.save_session': 'Kwakọba & Chee echiche',
    'chat.saving': 'Na-akwakọba...',
    'chat.initial_msg': "Nnọọ. Abụ m Itoura. Nke a bụ ebe nchekwube iji kwuo obi gị. Gịnị na-enye gị nsogbu taa?",

    // Chips
    'chip.anxious': 'Obi Na-ama M Mpaghara',
    'chip.exhausted': 'Ike Gwụrụ M',
    'chip.overwhelmed': 'Ihe Ka M Mpaghara',
    'chip.okay': 'M Mepụrụ Mma',
    'chip.anxious_prompt': "Obi na-ama m mpaghara taa.",
    'chip.exhausted_prompt': "Ike gwụrụ m kpam kpam.",
    'chip.overwhelmed_prompt': "Ihe m na-eche bara ụba ukwuu.",
    'chip.okay_prompt': "A nọ m nke ọma.",

    // Tools Page
    'tools.title': 'Kayan Oru Ahụike',
    'tools.subtitle': 'Nara obere oge maka onwe gị. Mepụta mmega ahụ iji mee ka uche gị jụọ oyi.',
    'tools.begin': 'Fọrọ Mmega Ahụ',
    'tools.breathe_title': 'Ndụ Inye Ndụ Box Breathing',
    'tools.breathe_desc': 'Uzo dị mfe iji mee ka ahụ gị jụọ oyi.',
    'tools.grounding_title': 'Ezi Uche 5-4-3-2-1',
    'tools.grounding_desc': 'Yi ahụ gị na anya gị lụọ ọgụ iji lụta na oge ugbu a.',
    'tools.meditation_title': 'Oge Ezi Echiche',
    'tools.meditation_desc': 'Echiche e ji aka mepụta iji mee ka obi gị dajụọ.',
    'tools.break_title': 'Nara Hụọ Ike',
    'tools.break_desc': 'Pụọ n\'ihu kọmputa ma nyere anya gị aka.',

    // Progress Page
    'progress.title': 'Ọganihu Gị',
    'progress.subtitle': 'Otụ uche gị si aga na oge gara aga.',
    'progress.trend_title': 'Ọnọdụ Obi (Ụbọchị 7 Gara Aga)',
    'progress.days_count': 'Ụbọchị {count} n\'ime 7',
    'progress.top_themes': 'Ihe Ndị Dị Mkpa N\'uche Gị',
    'progress.no_themes': 'A nweghị ihe edere na Itoura taa.',
    'progress.weekly_reflection': 'Echiche Nke izu',
    'progress.next_step': 'Ihe Ị Ga-eme Na-esote',

    // Journal Page
    'journal.title': 'Akwụkwọ Nsọ Ọnwe Gị',
    'journal.subtitle': 'Ebe nzuzo maka echiche gị.',
    'journal.new_entry': 'Mepụta Ihe Shie Nsọ',
    'journal.save_entry': 'Kwakọba Ihe Edere',
    'journal.back': 'Azụ',
    'journal.title_placeholder': 'Kee aha maka echiche gị...',
    'journal.content_placeholder': 'Gịnị na-eme n\'obi gị? Ebe a bụ nke gị kpam kpam...',
    'journal.no_entries_title': 'A nweghị ihe edere taa',
    'journal.no_entries_desc': 'Iji aka gị na-ede ihe n\'akwụkwọ bụ ụzọ dị ukwuu iji mee ka obi gị jụọ oyi.',
    'journal.write_first': 'Ede Ihe Nke Mbụ',

    // Mood Page
    'mood.title': 'Ihe Atụ Obi Gị',
    'mood.subtitle': 'Nara obere oge iji chọpụta otụ ahụ gị dị ugbua.',
    'mood.patterns': 'Ọnọdụ Obi Gara Aga',
    'mood.how_feeling': 'Otụ ka obi gị dị?',
    'mood.energy_level': 'Ike Ahụ Gị',
    'mood.exhausted': 'Ike Gwụrụ M',
    'mood.energized': 'Full Of Energy',
    'mood.note_label': 'Kee obere okwu (nhọrọ)',
    'mood.note_placeholder': 'Gịnị mere ị ji enwe mmetụta a?',
    'mood.save_btn': 'Kwakọba Ọnọdụ Obi',
    'mood.history': 'Ịtàn Ọnọdụ Obi Gara Aga',
    'mood.no_history': 'A nweghị ihe atụ obi edere.',
    'mood.terrible': 'Ọ Jokarịrị',
    'mood.bad': 'Ọ Jọrọ Ajo',
    'mood.okay': 'M Mepụrụ Mma',
    'mood.good': 'Ọ Dị Mma',
    'mood.great': 'Ọ Dị Mma Ukwuu',

    // Settings Page
    'settings.title': 'Nseta (Settings)',
    'settings.subtitle': 'Jikwaa nzuzo na ihe mmekọ gị',
    'settings.account': 'Akaụntụ Gị',
    'settings.privacy': 'Nzuzo Na Nchedo',
    'settings.memory': 'Manche Onye Mmekọ',
    'settings.preferences': 'Ihe Ị Na-ahọrọ',
    'settings.local_storage': 'Nchedo Na Igwe Gị',

    // FAQ Page
    'faq.title': 'Ajụjụ Ndị A Na-ajụ Mgbe Niile',
    'faq.subtitle': 'Ihe niile ị kwesịrị ịma gbasara onye mmekọ gị.',
    'faq.still_questions': 'Ị nwere ajụjụ ndị ọzọ?',
    'faq.contact_support': 'Gwa Nnyemaka Okwu',

    // Daily Popup
    'daily.reminder': 'Ncheta Nke Ụbọchị',
    'daily.start': 'Fọrọ Ụbọchị M',

    // Paywall
    'paywall.remaining': 'Azịza {count} fọdụrụ n\'ime 5 n\'efu',
    'paywall.warning_4th': 'I nwere azịza 1 n\'efu fọdụrụ.',
    'paywall.title': 'Gaa n\'ihu na njem ahụike gị',
    'paywall.desc': 'I mechaala azịza n\'efu 5 gị. Denye aha iji nweta mkparịta ụka na-enweghị oke.',
    'paywall.subscribe_btn': 'Kwụọ ụgwọ site na Paystack / Flutterwave',
    'paywall.price': '₦2,500 / n\'ọnwa',

    // Group
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
      setLanguage: (lang) => {
        set({ currentLanguage: lang });
      },
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
