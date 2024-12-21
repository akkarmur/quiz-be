const joiErrors = {
  ALTERNATIVES_ALL: '{{field}}: प्रदान की गई सभी विकल्प सही होने चाहिए।',
  ALTERNATIVES_ANY:
    '{{field}}: प्रदान की गई विकल्पों में से कम से कम एक सही होना चाहिए।',
  ALTERNATIVES_MATCH:
    '{{field}}: प्रदान की गई विकल्पों में कोई भी सही नहीं हैं।',
  ALTERNATIVES_ONE:
    '{{field}}: प्रदान की गई विकल्पों में से एक ही सही होना चाहिए।',
  ALTERNATIVES_TYPES:
    '{{field}}: इस फ़ील्ड में से किसी भी एक प्रकार का होना चाहिए: {{types}}।',
  ANY_CUSTOM: '{{field}}: इस फ़ील्ड में कस्टम सत्यापन में विफलता हुई।',
  ANY_DEFAULT: '{{field}}: डिफ़ॉल्ट मान लागू नहीं की जा सकी।',
  ANY_FAILOVER: '{{field}}: फ़ेलओवर मान लागू नहीं की जा सकी।',
  ANY_INVALID: '{{field}}: अमान्य इनपुट है।',
  ANY_ONLY: '{{field}}: इस फ़ील्ड का मान {{number}} होनी चाहिए।',
  ANY_REF: '{{field}}: इस फ़ील्ड ने अज्ञात सहायक को संदर्भित किया है: {{ref}}।',
  ANY_REQUIRED: '{{field}}: यह फ़ील्ड अनिवार्य है।',
  ANY_UNKNOWN: '{{field}}: इस फ़ील्ड की अनुमति नहीं है।',
  ARRAY_BASE: '{{field}}: यह फ़ील्ड एक ऐरे होना चाहिए।',
  ARRAY_EXCLUDES:
    '{{field}}: इस फ़ील्ड में छोड़ी गई मानें शामिल हैं: {{value}}।',
  ARRAY_INCLUDES_REQUIRED_BOTH:
    '{{field}}: इस फ़ील्ड में {{peers}} के दोनों होने चाहिए।',
  ARRAY_INCLUDES_REQUIRED_KNOWNS:
    '{{field}}: इस फ़ील्ड में {{peers}} शामिल होना चाहिए।',
  ARRAY_INCLUDES_REQUIRED_UNKNOWNS:
    '{{field}}: इस फ़ील्ड में {{peers}} में से कम से कम एक शामिल होना चाहिए।',
  ARRAY_INCLUDES: '{{field}}: इस फ़ील्ड में {{values}} शामिल होना चाहिए।',
  ARRAY_LENGTH: '{{field}}: इस फ़ील्ड में {{number}} आइटम होने चाहिए।',
  ARRAY_MAX: '{{field}}: इस फ़ील्ड में अधिकतम {{number}} आइटम होने चाहिए।',
  ARRAY_MIN: '{{field}}: इस फ़ील्ड में कम से कम {{number}} आइटम होने चाहिए।',
  ARRAY_ORDERED_LENGTH:
    '{{field}}: इस फ़ील्ड में {{pos}} स्थान पर {{number}} आइटम होने चाहिए।',
  ARRAY_SORT: '{{field}}: इस फ़ील्ड को क्रमबद्ध करना चाहिए।',
  ARRAY_SORT_MISMATCHING:
    '{{field}}: इस फ़ील्ड को प्रदान किए गए तुलनाकर्ता के साथ क्रमबद्ध करना चाहिए।',
  ARRAY_SORT_UNSUPPORTED:
    '{{field}}: समर्थित क्रमबद्ध करने का समर्थन नहीं है: {{order}}।',
  ARRAY_SPARSE: '{{field}}: इस फ़ील्ड में अनिर्धारित आइटम नहीं होने चाहिए।',
  ARRAY_UNIQUE: '{{field}}: इस फ़ील्ड में एकमात्र तत्व होना चाहिए।',
  ARRAY_HAS_KNOWN:
    '{{field}}: इस फ़ील्ड में {{peers}} में से कम से कम एक होना चाहिए।',
  ARRAY_HAS_UNKNOWN:
    '{{field}}: इस फ़ील्ड में अज्ञात पीयर {{peers}} में से कम से कम एक होना चाहिए।',
  BINARY_BASE: '{{field}}: इस फ़ील्ड एक बफर या स्ट्रिंग होनी चाहिए।',
  BINARY_LENGTH: '{{field}}: इस फ़ील्ड में {{number}} बाइट होने चाहिए।',
  BINARY_MAX: '{{field}}: इस फ़ील्ड में अधिकतम {{number}} बाइट होने चाहिए।',
  BINARY_MIN: '{{field}}: इस फ़ील्ड में कम से कम {{number}} बाइट होने चाहिए।',
  BOOLEAN_BASE: '{{field}}: इस फ़ील्ड सच या झूठ होना चाहिए।',
  DATE_BASE: '{{field}}: अमान्य तारीख प्रारूप है।',
  DATE_FORMAT: '{{field}}: अमान्य तारीख प्रारूप है। {{format}} होना चाहिए।',
  DATE_GREATER: '{{field}}: इस फ़ील्ड को {{number}} से अधिक होना चाहिए।',
  DATE_LESS: '{{field}}: इस फ़ील्ड को {{number}} से कम होना चाहिए।',
  DATE_MAX: '{{field}}: इस फ़ील्ड को {{number}} तक की तारीख होनी चाहिए।',
  DATE_MIN: '{{field}}: इस फ़ील्ड को {{number}} के बाद की तारीख होनी चाहिए।',
  DATE_STRICT: '{{field}}: अमान्य तारीख है।',
  FUNCTION_ARITY:
    '{{field}}: इस फ़ील्ड को {{n}} के आदान-प्रदान से बनाया जाना चाहिए।',
  FUNCTION_CLASS: '{{field}}: इस फ़ील्ड को कक्षा का निर्माणकर्ता होना चाहिए।',
  FUNCTION_MAXARITY:
    '{{field}}: इस फ़ील्ड को अधिकतम {{n}} के आदान-प्रदान से बनाया जाना चाहिए।',
  FUNCTION_MINARITY:
    '{{field}}: इस फ़ील्ड को कम से कम {{n}} के आदान-प्रदान से बनाया जाना चाहिए।',
  NUMBER_BASE: '{{field}}: इस फ़ील्ड को संख्यात्मक होना चाहिए।',
  NUMBER_GREATER: '{{field}}: इस फ़ील्ड को {{number}} से अधिक होना चाहिए।',
  NUMBER_INFINITY: '{{field}}: इस फ़ील्ड को अनंत होना चाहिए।',
  NUMBER_INTEGER: '{{field}}: इस फ़ील्ड को पूर्णांक होना चाहिए।',
  NUMBER_LESS: '{{field}}: इस फ़ील्ड को {{number}} से कम होना चाहिए।',
  NUMBER_MAX: '{{field}}: इस फ़ील्ड को {{number}} से कम होना चाहिए।',
  NUMBER_MIN: '{{field}}: इस फ़ील्ड को {{number}} से अधिक होना चाहिए।',
  NUMBER_MULTIPLE:
    '{{field}}: इस फ़ील्ड को {{base}} की गुणज के रूप में होना चाहिए।',
  NUMBER_NEGATIVE: '{{field}}: इस फ़ील्ड को नकारात्मक संख्या होनी चाहिए।',
  NUMBER_PORT: '{{field}}: इस फ़ील्ड को वैध पोर्ट संख्या होनी चाहिए।',
  NUMBER_POSITIVE: '{{field}}: इस फ़ील्ड को सकारात्मक संख्या होनी चाहिए।',
  NUMBER_PRECISION:
    '{{field}}: इस फ़ील्ड को {{number}} अंश तक की संख्या होनी चाहिए।',
  NUMBER_UNSAFE: '{{field}}: इस फ़ील्ड को सुरक्षित संख्या होनी चाहिए।',
  OBJECT_UNKNOWN: '{{field}}: इस फ़ील्ड में अज्ञात प्रॉपर्टी हैं: {{child}}।',
  OBJECT_AND: '{{field}}: ये फ़ील्ड गायब हैं: {{present}}।',
  OBJECT_ASSERT: '{{field}}: इस फ़ील्ड ने एसर्शन टेस्ट पास नहीं किया।',
  OBJECT_BASE: '{{field}}: इस फ़ील्ड को ऑब्जेक्ट होना चाहिए।',
  OBJECT_LENGTH: '{{field}}: इस फ़ील्ड को {{number}} बच्चों के साथ होना चाहिए।',
  OBJECT_MAX:
    '{{field}}: इस फ़ील्ड का अधिकतम {{number}} बच्चों के साथ होना चाहिए।',
  OBJECT_MIN:
    '{{field}}: इस फ़ील्ड को कम से कम {{number}} बच्चों के साथ होना चाहिए।',
  OBJECT_MISSING: '{{field}}: यह फ़ील्ड आवश्यक है।',
  OBJECT_NAND:
    '{{field}}: {{main}} {{peers}} के साथ एक साथ मौजूद नहीं होना चाहिए।',
  OBJECT_PATTERN_MATCH:
    '{{field}}: यह फ़ील्ड आवश्यक पैटर्न से मेल नहीं खाता है।',
  OBJECT_REFTYPE: '{{field}}: अमान्य संदर्भ प्रकार है।',
  OBJECT_REGEX: '{{field}}: इस फ़ील्ड का टाइप RegExp ऑब्जेक्ट होना चाहिए।',
  OBJECT_RENAME_MULTIPLE:
    '{{field}}: इस फ़ील्ड नहीं रीनेम किया जा सकता {{from}}।',
  OBJECT_RENAME_OVERRIDE:
    '{{field}}: ओवरराइड अमान्य है और टारगेट {{to}} मौजूद है, इसलिए इस फ़ील्ड को बच्चा {{from}} रीनेम नहीं किया जा सकता।',
  OBJECT_SCHEMA: '{{field}}: अमान्य स्कीमा है।',
  OBJECT_INSTANCE: '{{field}}: अमान्य इंस्टेंस है।',
  OBJECT_WITH: '{{field}}: यह फ़ील्ड आवश्यक है जब {{peer}} मौजूद है।',
  OBJECT_WITHOUT: '{{field}}: यह फ़ील्ड {{peer}} मौजूद है जब अनुमति नहीं है।',
  OBJECT_XOR: 'केवल {{peers}} में से एक की अनुमति है।',
  OBJECT_OXOR: '{{field}}: {{peers}} में से केवल एक आवश्यक है।',
  STRING_ALPHANUM:
    '{{field}}: इस फ़ील्ड में केवल अंग्रेजी और संख्या होनी चाहिए।',
  STRING_BASE64: '{{field}}: यह फ़ील्ड मान्य Base64 स्ट्रिंग होनी चाहिए।',
  STRING_BASE: '{{field}}: इस फ़ील्ड को स्ट्रिंग होना चाहिए।',
  STRING_CREDITCARD:
    '{{field}}: यह फ़ील्ड मान्य क्रेडिट कार्ड नंबर होना चाहिए।',
  STRING_DATAURI: '{{field}}: यह फ़ील्ड मान्य डेटा URI होना चाहिए।',
  STRING_DOMAIN: '{{field}}: यह फ़ील्ड मान्य डोमेन नाम होना चाहिए।',
  STRING_EMAIL: '{{field}}: मान्य ईमेल पता दर्ज करें।',
  STRING_EMPTY: '{{field}}: इस फ़ील्ड खाली नहीं हो सकता।',
  STRING_GUID: '{{field}}: इस फ़ील्ड मान्य GUID होना चाहिए।',
  STRING_HEXALIGN:
    '{{field}}: इस फ़ील्ड का 16-हेक्स इनकोडिंग बाइट के साथ समरेखित होना चाहिए।',
  STRING_HEX: '{{field}}: यह फ़ील्ड मान्य 16-हेक्स स्ट्रिंग होनी चाहिए।',
  STRING_HOSTNAME: '{{field}}: यह फ़ील्ड मान्य होस्टनाम होना चाहिए।',
  STRING_IPVERSION:
    '{{field}}: इस फ़ील्ड में वैध IP पता {{version}} की जरूरत है।',
  STRING_IP: '{{field}}: इस फ़ील्ड में वैध IP पता होना चाहिए।',
  STRING_ISODATE:
    '{{field}}: इस फ़ील्ड में वैध ISO 8601 डेट फ़ॉर्मेट होना चाहिए।',
  STRING_ISODURATION:
    '{{field}}: इस फ़ील्ड में वैध ISO 8601 अवधि फ़ॉर्मेट होना चाहिए।',
  STRING_LENGTH:
    '{{field}}: इस फ़ील्ड की लंबाई {{number}} अक्षरों में होनी चाहिए।',
  STRING_LOWERCASE: '{{field}}: इस फ़ील्ड में छोटे अक्षर होने चाहिए।',
  STRING_MAX:
    '{{field}}: इस फ़ील्ड की अधिकतम लंबाई {{number}} अक्षरों में होनी चाहिए।',
  STRING_MIN:
    '{{field}}: इस फ़ील्ड की कम से कम लंबाई {{number}} अक्षरों में होनी चाहिए।',
  STRING_NORMALIZE:
    '{{field}}: इस फ़ील्ड को {{form}} फ़ॉर्म में यूनिकोड साधारित होना चाहिए।',
  STRING_PATTERN_BASE:
    '{{field}}: यह फ़ील्ड आवश्यक पैटर्न से मेल नहीं खाता है।',
  STRING_PATTERN_NAME:
    '{{field}}: यह फ़ील्ड {{name}} पैटर्न से मेल नहीं खाता है।',
  STRING_PATTERN_INVERT_BASE:
    '{{field}}: यह फ़ील्ड {{pattern}} पैटर्न से मेल नहीं खाता है।',
  STRING_PATTERN_INVERT_NAME:
    '{{field}}: यह फ़ील्ड {{pattern}} पैटर्न से मेल नहीं खाता है।',
  STRING_TOKEN:
    '{{field}}: इस फ़ील्ड में केवल अंग्रेजी, संख्या, अंडरस्कोर, और हैफ़न हो सकते हैं।',
  STRING_TRIM:
    '{{field}}: इस फ़ील्ड में शीर्ष या अंत में शून्य समाहित नहीं किया जा सकता।',
  STRING_UPPERCASE: '{{field}}: इस फ़ील्ड में बड़े अक्षर होने चाहिए।',
  STRING_URI: '{{field}}: मान्य URI दर्ज करें।',
  STRING_URICUSTOMSCHEME:
    '{{field}}: इस फ़ील्ड में {{scheme}} पैटर्न के साथ मेल खाने वाला मान्य URI होना चाहिए।',
  STRING_URIRELATIVEONLY:
    '{{field}}: इस फ़ील्ड में मान्य संबंधित URI होना चाहिए।',
  SYMBOL_BASE: '{{field}}: इस फ़ील्ड को सिंबोल होना चाहिए।',
  SYMBOL_MAP: '{{field}}: इस फ़ील्ड में मान्य सिंबोल मैपिंग होना चाहिए।',
}
const serverErrors = {
  INTERNAL_SERVER_ERROR: 'आंतरीक सर्वर त्रुटि',
  OK: 'ठीक है',
  UNAUTHORIZED: 'अनधिकृत उपयोगकर्ता',
  NOT_FOUND: 'डेटा नहीं मिला',
  INVALID_TOKEN: 'अमान्य टोकन',
  FORBIDDEN: 'आपके पास इस संसाधन तक पहुँचने की अनुमति नहीं है.',
  LOGIN_REQUIRED: 'लॉगिन आवश्यक',
  CREATED: 'सफलतापूर्वक बनाया गया',
  OTP_SENT_SUCCESSFULLY: 'OTP सफलतापूर्वक भेजा गया',
  REGISTERED_SUCCESSFULLY: 'सफलतापूर्वक पंजीकृत',
  LOGOUT_SUCCESSFUL: 'सफलतापूर्वक लॉग आउट हुआ',
  LOGIN_SUCCESSFUL: 'सफलतापूर्वक लॉग इन हुआ',
  PASSWORD_RESET_SUCCESSFULLY: 'सफलतापूर्वक पासवर्ड रीसेट किया गया',
  GET_USER_DETAILS_SUCCESS: 'विवरण सफलतापूर्वक प्राप्त किए गए',
  NO_DATA_FOUND: 'डेटा नहीं मिला',
  DATA_DELETED_SUCCESSFULLY: 'डेटा सफलतापूर्वक हटा दिया गया',
  DATA_UPDATED_SUCCESSFULLY: 'डेटा सफलतापूर्वक अपडेट किया गया',
  DUPLICATED_DATA: 'डेटा की प्रतिलिपि हो गई है',
  ALREADY_EXIST: 'डेटा पहले ही मौजूद है',
  OTP_INVALID: 'ओटीपी अमान्य है।',
  OTP_EXPIRED: 'ओटीपी समाप्त हो गई है।',
  TOKEN_EXPIRED: 'टोकन समाप्त हो गया है',
  TOKEN_INVALID: 'अमान्य टोकन',
  TOKEN_PREDATED: 'गलत टोकन',
  INVALID_CREDENTIALS: 'अमान्य प्रमाणपत्र',
  NOT_REGISTERED: 'उपयोगकर्ता पंजीकृत नहीं है',
  PARENT_NOT_EXISTS: 'अभिभावक मौजूद नहीं है',
  NAME_ALREADY_EXISTS: 'नाम पहले से मौजूद है',
  DATA_RESTORED_SUCCESSFULLY: 'डेटा सफलतापूर्वक पुनर्स्थापित किया गया',
  AT_LEAST_ONE_IMAGE_REQUIRED: 'कम से कम एक छवि आवश्यक है',
  FAVORITE_ADDED_SUCCESSFULLY: 'उत्पाद पसंदीदा में जोड़ा गया',
  FAVORITE_REMOVED_SUCCESSFULLY: 'उत्पाद को पसंदीदा से हटा दिया गया',
  REVIEW_ADDED_SUCCESSFULLY: 'आपकी समीक्षा के लिए धन्यवाद।',
}

export default { ...joiErrors, ...serverErrors }
