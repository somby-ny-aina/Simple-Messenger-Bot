const axios = require ('axios');
const description = `Usage: /translate <word|phrase> | <language_code>
Example: /translate hello | fr

af: Afrikaans  
am: Amharic  
ar: Arabic  
as: Assamese  
az: Azerbaijani  
be: Belarusian  
bg: Bulgarian  
bn: Bengali  
bs: Bosnian  

ca: Catalan  
ceb: Cebuano  
co: Corsican  
cs: Czech  
cy: Welsh  

da: Danish  
de: German  
dv: Divehi  

el: Greek  
en: English  
eo: Esperanto  
es: Spanish  
et: Estonian  
eu: Basque  

fa: Persian  
fi: Finnish  
fr: French  
fy: Frisian  

ga: Irish  
gd: Scottish Gaelic  
gl: Galician  
gu: Gujarati  

ha: Hausa  
haw: Hawaiian  
he: Hebrew  
hi: Hindi  
hmn: Hmong  
hr: Croatian  
ht: Haitian Creole  
hu: Hungarian  

id: Indonesian  
ig: Igbo  
is: Icelandic  
it: Italian  

ja: Japanese  
jw: Javanese  

ka: Georgian  
kk: Kazakh  
km: Khmer  
kn: Kannada  
ko: Korean  
ku: Kurdish (Kurmanji)  
ky: Kyrgyz  

la: Latin  
lb: Luxembourgish  
lo: Lao  
lt: Lithuanian  
lv: Latvian  

mg: Malagasy  
mi: Maori  
mk: Macedonian  
ml: Malayalam  
mn: Mongolian  
mr: Marathi  
ms: Malay  
mt: Maltese  

ne: Nepali  
nl: Dutch  
no: Norwegian  

ny: Chichewa  

pa: Punjabi  
pl: Polish  
ps: Pashto  
pt: Portuguese  

ro: Romanian  
ru: Russian  

sd: Sindhi  
si: Sinhala  
sk: Slovak  
sl: Slovenian  
sm: Samoan  
sn: Shona  
so: Somali  
sq: Albanian  
sr: Serbian  
st: Sesotho  
su: Sundanese  
sv: Swedish  
sw: Swahili  

ta: Tamil  
te: Telugu  
tg: Tajik  
th: Thai  
tl: Tagalog  
tr: Turkish  
tt: Tatar  

ug: Uyghur  
uk: Ukrainian  
ur: Urdu  
uz: Uzbek  

vi: Vietnamese  

xh: Xhosa  

yi: Yiddish  
yo: Yoruba  

zh: Chinese (Simplified)  
zh-TW: Chinese (Traditional)  

zu: Zulu  `;

const execute = async (args, senderId, sendMessage) => {
  try {
    if (!args.includes('|')) {
      return sendMessage(senderId, { text: "❌ Incorrect format. Use: /translate <word|phrase> | <language_code>" });
    }

    const lastPipeIndex = args.lastIndexOf('|');
    const text = args.slice(0, lastPipeIndex).trim();
    const targetLang = args.slice(lastPipeIndex + 1).trim();

    if (!text || !targetLang) {
      return sendMessage(senderId, { text: "❌ Please specify both the text to translate and the target language code." });
    }

    const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
      params: {
        client: 'gtx',
        sl: 'auto',
        tl: targetLang,
        dt: 't',
        q: text
      }
    });

    const translatedText = response.data?.[0]?.map((segment) => segment[0]).join(' ');

    if (translatedText) {
      return sendMessage(senderId, { text: `🌍 Translation (${targetLang}):\n\n${translatedText}` });
    } else {
      return sendMessage(senderId, { text: "❌ Could not fetch the translation. Please try again later." });
    }
  } catch (error) {
    console.error("Translation error:", error.message);
    return sendMessage(senderId, { text: "❌ Error occurred while fetching the translation. Please check the input format or try again later." });
  }
};

module.exports = {
  description,
  execute
};
