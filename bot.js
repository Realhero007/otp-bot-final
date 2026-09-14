const { Bot, InlineKeyboard } = require("grammy");
const { fetch } = require("undici");
const fs = require("fs");
const path = require("path");

// --- Environment Variables ---
const BOT_TOKEN = process.env.BOT_TOKEN; 
const MASTER_ADMIN = parseInt(process.env.MASTER_ADMIN) || 6916044653; 
const OTP_GROUP_ID = process.env.OTP_GROUP_ID || "-1004463922857"; 

// 🔗 লিংকসমূহ
const OTP_GROUP_LINK = process.env.OTP_GROUP_LINK || "https://t.me/fast_otp0";     
const CHANNEL_CHAT_LINK = process.env.CHANNEL_CHAT_LINK || "https://t.me/fastotpchat"; 

if (!BOT_TOKEN) {
    console.error("ERROR: BOT_TOKEN is missing in Environment Variables!");
    process.exit(1);
}

// 🌍 ২০০+ দেশের পূর্ণাঙ্গ ISO ও Dial Code তালিকা
const COUNTRY_DIAL_CODES = [
    { name: "Afghanistan", iso: "AF", code: "93" },
    { name: "Albania", iso: "AL", code: "355" },
    { name: "Algeria", iso: "DZ", code: "213" },
    { name: "American Samoa", iso: "AS", code: "1684" },
    { name: "Andorra", iso: "AD", code: "376" },
    { name: "Angola", iso: "AO", code: "244" },
    { name: "Anguilla", iso: "AI", code: "1264" },
    { name: "Antigua and Barbuda", iso: "AG", code: "1268" },
    { name: "Argentina", iso: "AR", code: "54" },
    { name: "Armenia", iso: "AM", code: "374" },
    { name: "Aruba", iso: "AW", code: "297" },
    { name: "Australia", iso: "AU", code: "61" },
    { name: "Austria", iso: "AT", code: "43" },
    { name: "Azerbaijan", iso: "AZ", code: "994" },
    { name: "Bahamas", iso: "BS", code: "1242" },
    { name: "Bahrain", iso: "BH", code: "973" },
    { name: "Bangladesh", iso: "BD", code: "880" },
    { name: "Barbados", iso: "BB", code: "1246" },
    { name: "Belarus", iso: "BY", code: "375" },
    { name: "Belgium", iso: "BE", code: "32" },
    { name: "Belize", iso: "BZ", code: "501" },
    { name: "Benin", iso: "BJ", code: "229" },
    { name: "Bermuda", iso: "BM", code: "1441" },
    { name: "Bhutan", iso: "BT", code: "975" },
    { name: "Bolivia", iso: "BO", code: "591" },
    { name: "Bosnia and Herzegovina", iso: "BA", code: "387" },
    { name: "Botswana", iso: "BW", code: "267" },
    { name: "Brazil", iso: "BR", code: "55" },
    { name: "Brunei", iso: "BN", code: "673" },
    { name: "Bulgaria", iso: "BG", code: "359" },
    { name: "Burkina Faso", iso: "BF", code: "226" },
    { name: "Burundi", iso: "BI", code: "257" },
    { name: "Cambodia", iso: "KH", code: "855" },
    { name: "Cameroon", iso: "CM", code: "237" },
    { name: "Canada", iso: "CA", code: "1" },
    { name: "Cape Verde", iso: "CV", code: "238" },
    { name: "Central African Republic", iso: "CF", code: "236" },
    { name: "Chad", iso: "TD", code: "235" },
    { name: "Chile", iso: "CL", code: "56" },
    { name: "China", iso: "CN", code: "86" },
    { name: "Colombia", iso: "CO", code: "57" },
    { name: "Comoros", iso: "KM", code: "269" },
    { name: "Congo", iso: "CG", code: "242" },
    { name: "Costa Rica", iso: "CR", code: "506" },
    { name: "Croatia", iso: "HR", code: "385" },
    { name: "Cuba", iso: "CU", code: "53" },
    { name: "Cyprus", iso: "CY", code: "357" },
    { name: "Czech Republic", iso: "CZ", code: "420" },
    { name: "Denmark", iso: "DK", code: "45" },
    { name: "Djibouti", iso: "DJ", code: "253" },
    { name: "Dominica", iso: "DM", code: "1767" },
    { name: "Dominican Republic", iso: "DO", code: "1809" },
    { name: "Ecuador", iso: "EC", code: "593" },
    { name: "Egypt", iso: "EG", code: "20" },
    { name: "El Salvador", iso: "SV", code: "503" },
    { name: "Equatorial Guinea", iso: "GQ", code: "240" },
    { name: "Eritrea", iso: "ER", code: "291" },
    { name: "Estonia", iso: "EE", code: "372" },
    { name: "Ethiopia", iso: "ET", code: "251" },
    { name: "Fiji", iso: "FJ", code: "679" },
    { name: "Finland", iso: "FI", code: "358" },
    { name: "France", iso: "FR", code: "33" },
    { name: "Gabon", iso: "GA", code: "241" },
    { name: "Gambia", iso: "GM", code: "220" },
    { name: "Georgia", iso: "GE", code: "995" },
    { name: "Germany", iso: "DE", code: "49" },
    { name: "Ghana", iso: "GH", code: "233" },
    { name: "Greece", iso: "GR", code: "30" },
    { name: "Grenada", iso: "GD", code: "1473" },
    { name: "Guatemala", iso: "GT", code: "502" },
    { name: "Guinea", iso: "GN", code: "224" },
    { name: "Guyana", iso: "GY", code: "592" },
    { name: "Haiti", iso: "HT", code: "509" },
    { name: "Honduras", iso: "HN", code: "504" },
    { name: "Hong Kong", iso: "HK", code: "852" },
    { name: "Hungary", iso: "HU", code: "36" },
    { name: "Iceland", iso: "IS", code: "354" },
    { name: "India", iso: "IN", code: "91" },
    { name: "Indonesia", iso: "ID", code: "62" },
    { name: "Iran", iso: "IR", code: "98" },
    { name: "Iraq", iso: "IQ", code: "964" },
    { name: "Ireland", iso: "IE", code: "353" },
    { name: "Israel", iso: "IL", code: "972" },
    { name: "Italy", iso: "IT", code: "39" },
    { name: "Ivory Coast", iso: "CI", code: "225" },
    { name: "Jamaica", iso: "JM", code: "1876" },
    { name: "Japan", iso: "JP", code: "81" },
    { name: "Jordan", iso: "JO", code: "962" },
    { name: "Kazakhstan", iso: "KZ", code: "7" },
    { name: "Kenya", iso: "KE", code: "254" },
    { name: "Kuwait", iso: "KW", code: "965" },
    { name: "Kyrgyzstan", iso: "KG", code: "996" },
    { name: "Laos", iso: "LA", code: "856" },
    { name: "Latvia", iso: "LV", code: "371" },
    { name: "Lebanon", iso: "LB", code: "961" },
    { name: "Lesotho", iso: "LS", code: "266" },
    { name: "Liberia", iso: "LR", code: "231" },
    { name: "Libya", iso: "LY", code: "218" },
    { name: "Liechtenstein", iso: "LI", code: "423" },
    { name: "Lithuania", iso: "LT", code: "370" },
    { name: "Luxembourg", iso: "LU", code: "352" },
    { name: "Macau", iso: "MO", code: "853" },
    { name: "Macedonia", iso: "MK", code: "389" },
    { name: "Madagascar", iso: "MG", code: "261" },
    { name: "Malawi", iso: "MW", code: "265" },
    { name: "Malaysia", iso: "MY", code: "60" },
    { name: "Maldives", iso: "MV", code: "960" },
    { name: "Mali", iso: "ML", code: "223" },
    { name: "Malta", iso: "MT", code: "356" },
    { name: "Mauritania", iso: "MR", code: "222" },
    { name: "Mauritius", iso: "MU", code: "230" },
    { name: "Mexico", iso: "MX", code: "52" },
    { name: "Moldova", iso: "MD", code: "373" },
    { name: "Monaco", iso: "MC", code: "377" },
    { name: "Mongolia", iso: "MN", code: "976" },
    { name: "Montenegro", iso: "ME", code: "382" },
    { name: "Morocco", iso: "MA", code: "212" },
    { name: "Mozambique", iso: "MZ", code: "258" },
    { name: "Myanmar", iso: "MM", code: "95" },
    { name: "Namibia", iso: "NA", code: "264" },
    { name: "Nepal", iso: "NP", code: "977" },
    { name: "Netherlands", iso: "NL", code: "31" },
    { name: "New Zealand", iso: "NZ", code: "64" },
    { name: "Nicaragua", iso: "NI", code: "505" },
    { name: "Niger", iso: "NE", code: "227" },
    { name: "Nigeria", iso: "NG", code: "234" },
    { name: "North Korea", iso: "KP", code: "850" },
    { name: "Norway", iso: "NO", code: "47" },
    { name: "Oman", iso: "OM", code: "968" },
    { name: "Pakistan", iso: "PK", code: "92" },
    { name: "Palestine", iso: "PS", code: "970" },
    { name: "Panama", iso: "PA", code: "507" },
    { name: "Papua New Guinea", iso: "PG", code: "675" },
    { name: "Paraguay", iso: "PY", code: "595" },
    { name: "Peru", iso: "PE", code: "51" },
    { name: "Philippines", iso: "PH", code: "63" },
    { name: "Poland", iso: "PL", code: "48" },
    { name: "Portugal", iso: "PT", code: "351" },
    { name: "Qatar", iso: "QA", code: "974" },
    { name: "Romania", iso: "RO", code: "40" },
    { name: "Russia", iso: "RU", code: "7" },
    { name: "Rwanda", iso: "RW", code: "250" },
    { name: "Saudi Arabia", iso: "SA", code: "966" },
    { name: "Senegal", iso: "SN", code: "221" },
    { name: "Serbia", iso: "RS", code: "381" },
    { name: "Seychelles", iso: "SC", code: "248" },
    { name: "Sierra Leone", iso: "SL", code: "232" },
    { name: "Singapore", iso: "SG", code: "65" },
    { name: "Slovakia", iso: "SK", code: "421" },
    { name: "Slovenia", iso: "SI", code: "386" },
    { name: "Somalia", iso: "SO", code: "252" },
    { name: "South Africa", iso: "ZA", code: "27" },
    { name: "South Korea", iso: "KR", code: "82" },
    { name: "Spain", iso: "ES", code: "34" },
    { name: "Sri Lanka", iso: "LK", code: "94" },
    { name: "Sudan", iso: "SD", code: "249" },
    { name: "Suriname", iso: "SR", code: "597" },
    { name: "Swaziland", iso: "SZ", code: "268" },
    { name: "Sweden", iso: "SE", code: "46" },
    { name: "Switzerland", iso: "CH", code: "41" },
    { name: "Syria", iso: "SY", code: "963" },
    { name: "Taiwan", iso: "TW", code: "886" },
    { name: "Tajikistan", iso: "TJ", code: "992" },
    { name: "Tanzania", iso: "TZ", code: "255" },
    { name: "Thailand", iso: "TH", code: "66" },
    { name: "Togo", iso: "TG", code: "228" },
    { name: "Tunisia", iso: "TN", code: "216" },
    { name: "Turkey", iso: "TR", code: "90" },
    { name: "Turkmenistan", iso: "TM", code: "993" },
    { name: "Uganda", iso: "UG", code: "256" },
    { name: "Ukraine", iso: "UA", code: "380" },
    { name: "United Arab Emirates", iso: "AE", code: "971" },
    { name: "United Kingdom", iso: "GB", code: "44" },
    { name: "United States", iso: "US", code: "1" },
    { name: "Uruguay", iso: "UY", code: "598" },
    { name: "Uzbekistan", iso: "UZ", code: "998" },
    { name: "Venezuela", iso: "VE", code: "58" },
    { name: "Vietnam", iso: "VN", code: "84" },
    { name: "Yemen", iso: "YE", code: "967" },
    { name: "Zambia", iso: "ZM", code: "260" },
    { name: "Zimbabwe", iso: "ZW", code: "263" }
];

const bot = new Bot(BOT_TOKEN);
const DB_FILE = path.join(__dirname, "bot_database.json");

let activeOtpCheckers = {};
let userSentOtps = new Set(); 
let globalSentOtps = new Set(); 
let botInfo = null;
let adminState = {}; 
let userState = {};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function getCountryFlag(countryName) {
    if (!countryName) return "🌐";
    const match = countryName.match(/\(([A-Z]{2})\)/);
    let isoCode = match ? match[1] : null;

    if (!isoCode) {
        const found = COUNTRY_DIAL_CODES.find(c => countryName.toLowerCase().includes(c.name.toLowerCase()));
        if (found) isoCode = found.iso;
    }

    if (isoCode && isoCode.length === 2) {
        const codePoints = isoCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }
    return "🌐";
}

function parsePhoneNumberInfo(rawPhone) {
    let clean = rawPhone.replace(/[^\d]/g, "");
    let dialCode = "";
    let isoCode = "";
    
    const sorted = [...COUNTRY_DIAL_CODES].sort((a,b) => b.code.length - a.code.length);
    for (const item of sorted) {
        if (clean.startsWith(item.code)) {
            dialCode = item.code;
            isoCode = item.iso;
            break;
        }
    }

    if (!dialCode) {
        dialCode = "880";
        isoCode = "BD";
    }

    let nationalNumber = clean;
    if (nationalNumber.startsWith(dialCode)) {
        nationalNumber = nationalNumber.substring(dialCode.length);
    }

    return {
        dialCode: dialCode,
        isoCode: isoCode,
        nationalNumber: nationalNumber,
        fullNumberWithPlus: `+${clean}`
    };
}

function maskPhoneNumber(phoneStr) {
    let clean = phoneStr.replace(/[^\d]/g, "");
    if (clean.length <= 6) return phoneStr;
    const prefix = clean.substring(0, 4);
    const suffix = clean.substring(clean.length - 3);
    return `+${prefix}FAST${suffix}`;
}

function extractOtp(messageText) {
    if (!messageText || typeof messageText !== 'string') return null;
    const codeMatch = messageText.match(/\b\d{4,8}\b/);
    if (codeMatch) return codeMatch[0];
    const linkMatch = messageText.match(/(https?:\/\/[^\s]+)/gi);
    if (linkMatch) return linkMatch[0];
    return null;
}

function readDb() {
    if (!fs.existsSync(DB_FILE)) {
        const defaultServices = ["Telegram", "WhatsApp", "Imo", "Instagram", "Facebook", "TikTok", "Uber"];
        const defaultApis = [
            "https://panel.lamix.org/api/v1/messages?token=F03xiioltLwvYbIlS470UQ9XuVWkp-KlqC5f_r2yXhs",
            "http://169.58.213.56/crapi/ALEIUS/viewstats?token=dsglfRknOC2y_94AAD164B4ED"
        ];
        fs.writeFileSync(DB_FILE, JSON.stringify({ 
            numbers: [], 
            admins: [MASTER_ADMIN], 
            users: [], 
            services: defaultServices, 
            serviceRates: {}, 
            balances: {}, 
            withdrawals: [],
            apiUrls: defaultApis,
            checkDelay: 4000,
            numberLimit: 1, 
            customOtpMsg: "🚀 <b>FAST OTP RECEIVED!</b>\n\n📱 <code>{service}</code> | {flag} <code>{country}</code> | 📞 <code>+{phone}</code>\n\n💬 <i>\"{message}\"</i>\n\n👉 <code>{code}</code> <i>(Tap to Copy)</i>\n\n💰 <b>+৳{reward} BDT added to your balance!</b>"
        }, null, 2));
    }
    try {
        const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
        if (!data.admins.includes(MASTER_ADMIN)) data.admins.push(MASTER_ADMIN);
        if (!data.numberLimit) data.numberLimit = 1;
        return data;
    } catch (e) {
        return { numbers: [], admins: [MASTER_ADMIN], users: [], services: [], serviceRates: {}, balances: {}, withdrawals: [], apiUrls: [], checkDelay: 4000, numberLimit: 1 };
    }
}

function writeDb(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch(e) {
        console.error("Database write error:", e);
    }
}

// --- Keyboards ---
const userReplyMenu = {
    reply_markup: {
        keyboard: [
            [{ text: "📱 Get Number" }, { text: "💰 Balance" }],
            [{ text: "💳 Withdraw" }, { text: "🚦 Live Traffic" }],
            [{ text: "📊 Status" }, { text: "⚙️ Switch to Admin Menu" }]
        ],
        resize_keyboard: true
    }
};

const adminReplyMenu = {
    reply_markup: {
        keyboard: [
            [{ text: "📱 Add Number" }, { text: "❌ Delete Numbers" }],
            [{ text: "🛠️ Service Settings" }, { text: "💸 Withdraw Requests" }],
            [{ text: "📢 Admin Control" }, { text: "👤 Switch to User Menu" }]
        ],
        resize_keyboard: true
    }
};

bot.command("start", async (ctx) => {
    const dbData = readDb();
    const userId = ctx.from.id;

    if (!dbData.users.includes(userId)) dbData.users.push(userId);
    if (dbData.balances[userId] === undefined) dbData.balances[userId] = 0.00;
    writeDb(dbData);

    if (dbData.admins.includes(userId)) {
        await ctx.reply("⚙️ অ্যাডমিন প্যানেলে আপনাকে স্বাগতম!", adminReplyMenu).catch(()=>{});
    } else {
        await ctx.reply("📱 ইউজার প্যানেলে আপনাকে স্বাগতম।", userReplyMenu).catch(()=>{});
    }
});

// --- Dynamic Admin Settings ---
bot.command("adminmenu", async (ctx) => {
    const dbData = readDb();
    if (!dbData.admins.includes(ctx.from.id)) return;

    const keyboard = new InlineKeyboard()
        .text("➕ Add API URL", "adm_add_api").text("❌ Delete API URL", "adm_del_api").row()
        .text("⏱️ Set Delay", "adm_set_delay").text("🔢 Set Multi-Num Limit", "adm_set_limit").row()
        .text("📋 View Settings", "adm_view_config");

    await ctx.reply("🔑 <b>Admin System Settings Panel</b>\n\nনিচের অপশনগুলো থেকে কনফিগার করুন:", {
        reply_markup: keyboard,
        parse_mode: "HTML"
    }).catch(()=>{});
});

bot.callbackQuery("adm_set_limit", async (ctx) => {
    adminState[ctx.from.id] = { step: "awaiting_number_limit" };
    await ctx.editMessageText("🔢 ইউজার এক ক্লিকে এক সাথে কয়টি নম্বর পাবে লিখুন:\n(যেমন: 1, 2, 3 বা 5)").catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery("adm_add_api", async (ctx) => {
    adminState[ctx.from.id] = { step: "awaiting_api_url" };
    await ctx.editMessageText("➕ নতুন API URL টি লিঙ্ক আকারে লিখে পাঠান:").catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery("adm_del_api", async (ctx) => {
    const dbData = readDb();
    const keyboard = new InlineKeyboard();
    dbData.apiUrls.forEach((url, idx) => {
        keyboard.text(`❌ Remove API #${idx + 1}`, `delapi_${idx}`).row();
    });
    await ctx.editMessageText("🗑️ যে API URL টি ডিলিট করতে চান তা বেছে নিন:", { reply_markup: keyboard }).catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery(/^delapi_/, async (ctx) => {
    const idx = parseInt(ctx.callbackQuery.data.split("_")[1]);
    let dbData = readDb();
    if (dbData.apiUrls[idx]) {
        const removed = dbData.apiUrls.splice(idx, 1);
        writeDb(dbData);
        await ctx.editMessageText(`✅ API URL ডিলিট করা হয়েছে:\n<code>${removed[0]}</code>`, { parse_mode: "HTML" }).catch(()=>{});
    }
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery("adm_set_delay", async (ctx) => {
    adminState[ctx.from.id] = { step: "awaiting_delay_ms" };
    await ctx.editMessageText("⏱️ API চেক করার ডিলে সময় (Millisecond) দিন:\n(যেমন: 2000 = 2s, 4000 = 4s)").catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery("adm_view_config", async (ctx) => {
    const dbData = readDb();
    let text = `⚙️ <b>বর্তমান সিস্টেম কনফিগারেশন</b>\n\n`;
    text += `⏱️ <b>Polling Delay:</b> <code>${dbData.checkDelay} ms</code>\n`;
    text += `🔢 <b>Per Order Number Limit:</b> <code>${dbData.numberLimit}</code> টি\n\n`;
    text += `🔗 <b>API URLs (${dbData.apiUrls.length}):</b>\n`;
    dbData.apiUrls.forEach((url, i) => {
        text += `${i + 1}. <code>${url}</code>\n`;
    });

    await ctx.editMessageText(text, { parse_mode: "HTML" }).catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

// --- Country Delivery Core Logic ---
async function showCountriesList(ctx, serviceName) {
    const dbData = readDb();
    const counts = {};
    dbData.numbers.forEach(n => {
        if (n.service === serviceName && n.status === "available" && n.country) {
            counts[n.country] = (counts[n.country] || 0) + 1;
        }
    });

    const countries = Object.keys(counts);
    if (countries.length === 0) {
        const text = `❌ দুঃখিত, এই মুহূর্তে ${serviceName} সার্ভিসের কোনো নম্বর খালি নেই।`;
        try { await ctx.editMessageText(text); } catch(e) { await ctx.reply(text).catch(()=>{}); }
        return;
    }

    const keyboard = new InlineKeyboard();
    countries.forEach((country, index) => {
        const flag = getCountryFlag(country);
        keyboard.text(`${flag} ${country} (${counts[country]})`, `getnum_${serviceName}_${encodeURIComponent(country)}`);
        if (index % 2 !== 0) keyboard.row();
    });

    const msg = `🌍 ${serviceName} সার্ভিসের জন্য একটি country সিলেক্ট করুন:`;
    try { await ctx.editMessageText(msg, { reply_markup: keyboard }); } catch(e) { await ctx.reply(msg, { reply_markup: keyboard }).catch(()=>{}); }
}

bot.callbackQuery(/^user_/, async (ctx) => {
    const serviceName = ctx.callbackQuery.data.split("_")[1];
    await showCountriesList(ctx, serviceName);
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery(/^getnum_/, async (ctx) => {
    const parts = ctx.callbackQuery.data.split("_");
    const service = parts[1];
    const country = decodeURIComponent(parts[2]);
    await deliverNumbers(ctx, service, country);
    ctx.answerCallbackQuery().catch(()=>{});
});

// 🎯 MULTI-NUMBER DELIVERY ENGINE (With Smart Refresh & Multiple OTP Handling)
async function deliverNumbers(ctx, service, country) {
    let dbData = readDb();
    const userId = ctx.from.id;
    const limit = dbData.numberLimit || 1; 

    // 🔄 Smart Refresh: যেগুলোতে OTP চলে এসেছে সেগুলো ডিলিট করা
    const userPreviousNumbers = dbData.numbers.filter(n => n.assigned_to === userId && n.service === service && n.country === country);
    
    userPreviousNumbers.forEach(num => {
        if (num.hasOtpReceived) {
            const cleanId = num.id.toString().trim();
            if (activeOtpCheckers[cleanId]) {
                clearInterval(activeOtpCheckers[cleanId]);
                delete activeOtpCheckers[cleanId];
            }
            dbData.numbers = dbData.numbers.filter(n => n.id !== num.id);
        }
    });

    writeDb(dbData);
    dbData = readDb();

    let activeUserNumbers = dbData.numbers.filter(n => n.assigned_to === userId && n.status === "used" && n.service === service && n.country === country && !n.hasOtpReceived);

    const neededCount = limit - activeUserNumbers.length;

    if (neededCount > 0) {
        const freshNumbers = dbData.numbers.filter(
            n => n.service === service && 
            n.country === country && 
            n.status === "available"
        ).slice(0, neededCount);

        freshNumbers.forEach(n => {
            n.status = "used";
            n.assigned_to = userId;
            n.hasOtpReceived = false;
            activeUserNumbers.push(n);
        });
        writeDb(dbData);
    }

    if (activeUserNumbers.length === 0) {
        const failText = `❌ দুঃখিত, এই মুহূর্তে ${service} (${country}) সার্ভিসের আর কোনো নতুন নম্বর খালি নেই।`;
        await ctx.reply(failText).catch(()=>{});
        return;
    }

    const countryFlag = getCountryFlag(country);
    let messageText = `${countryFlag} <b>Country:</b> ${escapeHtml(country)}\n`;
    messageText += `🛠️ <b>Service:</b> ${escapeHtml(service)}\n`;
    messageText += `🔢 <b>Active Numbers:</b> ${activeUserNumbers.length} টি\n\n`;
    messageText += `⏳ Waiting for OTP... (একটি নম্বরে একাধিক OTP আসলেও এখানে পাবেন)`;

    const actionKeyboard = new InlineKeyboard();

    activeUserNumbers.forEach((numObj, index) => {
        const info = parsePhoneNumberInfo(numObj.phone_number);
        
        actionKeyboard.copyText(`📋 Copy Num #${index + 1}: ${info.fullNumberWithPlus}`, `${info.fullNumberWithPlus}`).row();

        const cleanId = numObj.id.toString().trim();
        if (!activeOtpCheckers[cleanId]) {
            startLiveOtpCheck(numObj.id, info.fullNumberWithPlus, service, userId, country);
        }
    });

    actionKeyboard.text("🔄 Refresh (Clear Used & Get New)", `user_${service}`).row()
                  .url("🔑 Get OTP ↗️", OTP_GROUP_LINK);

    try {
        if (ctx.callbackQuery) {
            await ctx.editMessageText(messageText, { reply_markup: actionKeyboard, parse_mode: "HTML" });
        } else {
            await ctx.reply(messageText, { reply_markup: actionKeyboard, parse_mode: "HTML" });
        }
    } catch (err) {
        await ctx.reply(messageText, { reply_markup: actionKeyboard, parse_mode: "HTML" }).catch(()=>{});
    }
}

// 🎯 REAL-TIME MULTIPLE OTP LISTENER ENGINE
function startLiveOtpCheck(numberId, phoneNumber, serviceName, fallbackUserId, countryName) {
    const cleanId = numberId.toString().trim();
    const cleanUserPhone = phoneNumber.replace(/[^\d]/g, "");
    
    if (activeOtpCheckers[cleanId]) clearInterval(activeOtpCheckers[cleanId]);

    let initialDb = readDb();
    const delayTime = initialDb.checkDelay || 4000;

    const interval = setInterval(async () => {
        try {
            let dbData = readDb();
            const apiUrls = dbData.apiUrls || [];

            for (const baseUrl of apiUrls) {
                try {
                    const separator = baseUrl.includes("?") ? "&" : "?";
                    const apiUrl = `${baseUrl}${separator}_cb=${Date.now()}`;

                    const response = await fetch(apiUrl);
                    if (!response.ok) continue;
                    
                    const json = await response.json();
                    const recordList = (json && (json.records || json.data)) ? (json.records || json.data) : [];
                    
                    if (Array.isArray(recordList) && recordList.length > 0) {
                        const activation = recordList.find(item => {
                            const rawPhone = (item.number || item.num || item.phone || "").toString().replace(/[^\d]/g, "");
                            if (!rawPhone || cleanUserPhone.length < 7) return false;
                            return cleanUserPhone.endsWith(rawPhone.slice(-7));
                        });
                        
                        const rawMessage = activation ? (activation.content || activation.message || activation.sms) : null;

                        if (activation && rawMessage) {
                            const otpCode = extractOtp(rawMessage);
                            
                            if (otpCode) {
                                const uniqueKey = `${cleanUserPhone}_${otpCode}`;
                                
                                if (!userSentOtps.has(uniqueKey)) {
                                    userSentOtps.add(uniqueKey);
                                    globalSentOtps.add(uniqueKey);

                                    const foundNum = dbData.numbers.find(n => n.id.toString() === cleanId);
                                    const finalUserId = foundNum && foundNum.assigned_to ? foundNum.assigned_to : fallbackUserId;

                                    if (foundNum) {
                                        foundNum.hasOtpReceived = true;
                                    }

                                    const rateKey = `${serviceName}_${countryName}`;
                                    const otpReward = dbData.serviceRates[rateKey] || dbData.serviceRates[serviceName] || 5.00;

                                    if (!dbData.balances[finalUserId]) dbData.balances[finalUserId] = 0;
                                    dbData.balances[finalUserId] += otpReward;

                                    writeDb(dbData);

                                    const botUsername = botInfo ? botInfo.username : "Bot";
                                    const detectedService = escapeHtml(activation.cli || serviceName);
                                    const safeRawMessage = escapeHtml(rawMessage);
                                    const safeCountryName = escapeHtml(countryName);
                                    const flag = getCountryFlag(countryName);

                                    let userSuccessMessage = dbData.customOtpMsg || "🚀 <b>FAST OTP RECEIVED!</b>\n\n📱 <code>{service}</code> | {flag} <code>{country}</code> | 📞 <code>+{phone}</code>\n\n💬 <i>\"{message}\"</i>\n\n👉 <code>{code}</code> <i>(Tap to Copy)</i>\n\n💰 <b>+৳{reward} BDT added to your balance!</b>";
                                    
                                    userSuccessMessage = userSuccessMessage
                                        .replace(/{service}/g, detectedService)
                                        .replace(/{country}/g, safeCountryName)
                                        .replace(/{flag}/g, flag)
                                        .replace(/{phone}/g, cleanUserPhone)
                                        .replace(/{message}/g, safeRawMessage)
                                        .replace(/{code}/g, otpCode)
                                        .replace(/{reward}/g, otpReward.toFixed(2));
                                    
                                    const inlineKeyboardUser = new InlineKeyboard()
                                        .copyText(`${otpCode}`, `${otpCode}`).row()
                                        .url(`👀 Number Bot`, `https://t.me/${botUsername}`)
                                        .url(`✉️ Channel`, CHANNEL_CHAT_LINK);

                                    await bot.api.sendMessage(finalUserId, userSuccessMessage, { reply_markup: inlineKeyboardUser, parse_mode: "HTML" }).catch(()=>{});

                                    const maskedPhone = maskPhoneNumber(cleanUserPhone);
                                    const groupSuccessMessage = `🚀 <b>FAST OTP RECEIVED!</b>\n\n📱 <code>${detectedService}</code> | ${flag} <code>${safeCountryName}</code> | 📞 <code>${maskedPhone}</code>\n\n💬 <i>"${safeRawMessage}"</i>\n\n👉 <code>${otpCode}</code> <i>(Tap to Copy)</i>`;
                                    
                                    await bot.api.sendMessage(OTP_GROUP_ID, groupSuccessMessage, { reply_markup: inlineKeyboardUser, parse_mode: "HTML" }).catch(()=>{});
                                }
                            }
                        }
                    }
                } catch (e) {}
            }
        } catch (error) {}
    }, delayTime);

    activeOtpCheckers[cleanId] = interval;

    setTimeout(() => {
        if (activeOtpCheckers[cleanId]) {
            clearInterval(interval);
            delete activeOtpCheckers[cleanId];
        }
    }, 1200000);
}

// 🎯 GLOBAL PANEL LISTENER
function startGlobalPanelListener() {
    setInterval(async () => {
        try {
            const dbData = readDb();
            const globalApiUrls = dbData.apiUrls || [];

            for (const baseUrl of globalApiUrls) {
                try {
                    const separator = baseUrl.includes("?") ? "&" : "?";
                    const globalApiUrl = `${baseUrl}${separator}_cb=${Date.now()}`;

                    const response = await fetch(globalApiUrl);
                    if (!response.ok) continue;

                    const json = await response.json();
                    const recordList = (json && (json.records || json.data)) ? (json.records || json.data) : [];

                    if (Array.isArray(recordList) && recordList.length > 0) {
                        for (const activation of recordList) {
                            const rawMessage = activation.content || activation.message || activation.sms;
                            let rawPhone = (activation.number || activation.num || activation.phone || "").toString();
                            let phoneNumber = rawPhone.replace(/[^\d]/g, "");
                            
                            if (!rawMessage || phoneNumber.length < 7) continue;

                            const serviceName = activation.cli || activation.service || "Global";
                            const otpCode = extractOtp(rawMessage);

                            if (otpCode) {
                                const uniqueKey = `${phoneNumber}_${otpCode}`;

                                if (!globalSentOtps.has(uniqueKey)) {
                                    globalSentOtps.add(uniqueKey);
                                    
                                    setTimeout(() => globalSentOtps.delete(uniqueKey), 3600000);

                                    const maskedGlobalPhone = maskPhoneNumber(phoneNumber);
                                    const safeService = escapeHtml(serviceName.toUpperCase());
                                    const safeRawMsg = escapeHtml(rawMessage);

                                    const globalMessage = `📢 <b>প্যানেল ওটিপি নোটিফিকেশন!</b> (Global Alert)\n📦 সার্ভিস: ${safeService}\n📞 নম্বর: <code>${maskedGlobalPhone}</code>\n\n💬 মেসেজ: <i>${safeRawMsg}</i>`;
                                    
                                    const botUsername = botInfo ? botInfo.username : "Bot";
                                    
                                    const inlineKeyboard = new InlineKeyboard()
                                        .copyText(`${otpCode}`, `${otpCode}`).row()
                                        .url(`👀 Number Bot`, `https://t.me/${botUsername}`)
                                        .url(`✉️ Channel`, CHANNEL_CHAT_LINK);

                                    try {
                                        await bot.api.sendMessage(OTP_GROUP_ID, globalMessage, { reply_markup: inlineKeyboard, parse_mode: "HTML" });
                                        await sleep(1500); 
                                    } catch (e) {}
                                }
                            }
                        }
                    }
                } catch (err) {}
            }
        } catch (err) {}
    }, 15000); 
}

// --- ALL USER MENU HANDLERS ---
bot.hears("📱 Get Number", async (ctx) => {
    const dbData = readDb();
    const services = dbData.services || [];
    
    if (services.length === 0) {
        await ctx.reply("❌ কোনো সার্ভিস উপলব্ধ নেই।").catch(()=>{});
        return;
    }

    const keyboard = new InlineKeyboard();
    services.forEach((service, index) => {
        const availableCount = dbData.numbers.filter(n => n.service === service && n.status === "available").length;
        keyboard.text(`${service} (${availableCount})`, `user_${service}`);
        if (index % 2 !== 0) keyboard.row();
    });

    await ctx.reply("📱 আপনার পছন্দের সার্ভিস নির্বাচন করুন:", { reply_markup: keyboard }).catch(()=>{});
});

bot.hears("💰 Balance", async (ctx) => {
    const dbData = readDb();
    const userId = ctx.from.id;
    const balance = dbData.balances[userId] || 0.00;
    await ctx.reply(`💳 <b>আপনার বর্তমান ব্যালেন্স:</b> ৳${balance.toFixed(2)} BDT`, { parse_mode: "HTML" }).catch(()=>{});
});

bot.hears("💳 Withdraw", async (ctx) => {
    const dbData = readDb();
    const userId = ctx.from.id;
    const balance = dbData.balances[userId] || 0.00;

    if (balance < 50) {
        await ctx.reply(`❌ উইথড্র করার জন্য সর্বনিম্ন ৳50 BDT ব্যালেন্স লাগবে। আপনার আছে ৳${balance.toFixed(2)} BDT`).catch(()=>{});
        return;
    }

    userState[userId] = { step: "awaiting_withdraw_details" };
    await ctx.reply("💸 আপনার পেমেন্ট মাধ্যম এবং নম্বর লিখে পাঠান (যেমন: Bkash Personal: 01700000000):").catch(()=>{});
});

bot.hears("🚦 Live Traffic", async (ctx) => {
    const dbData = readDb();
    let text = `🚦 <b>Live Traffic Status</b>\n\n`;
    dbData.services.forEach(s => {
        const count = dbData.numbers.filter(n => n.service === s && n.status === "available").length;
        text += `• <b>${s}:</b> ${count} টি নম্বর প্রস্তুত\n`;
    });
    await ctx.reply(text, { parse_mode: "HTML" }).catch(()=>{});
});

bot.hears("📊 Status", async (ctx) => {
    const dbData = readDb();
    const totalNumbers = dbData.numbers.length;
    const availableNumbers = dbData.numbers.filter(n => n.status === "available").length;
    const totalUsers = dbData.users.length;

    let text = `📊 <b>বট তথ্য ও পরিসংখ্যান:</b>\n\n`;
    text += `👥 মোট ইউজার: ${totalUsers}\n`;
    text += `📱 মোট নম্বর: ${totalNumbers}\n`;
    text += `✅ খালি নম্বর: ${availableNumbers}\n`;
    
    await ctx.reply(text, { parse_mode: "HTML" }).catch(()=>{});
});

bot.hears("⚙️ Switch to Admin Menu", async (ctx) => {
    const dbData = readDb();
    if (dbData.admins.includes(ctx.from.id)) {
        await ctx.reply("⚙️ অ্যাডমিন মেনুতে সুইচ করা হয়েছে।", adminReplyMenu).catch(()=>{});
    } else {
        await ctx.reply("❌ আপনি এই বটের অ্যাডমিন নন।").catch(()=>{});
    }
});

bot.hears("👤 Switch to User Menu", async (ctx) => {
    await ctx.reply("📱 ইউজার মেনুতে সুইচ করা হয়েছে।", userReplyMenu).catch(()=>{});
});

// --- ALL ADMIN MENU HANDLERS ---
bot.hears("📱 Add Number", async (ctx) => {
    const dbData = readDb();
    if (!dbData.admins.includes(ctx.from.id)) return;

    adminState[ctx.from.id] = { step: "awaiting_numbers_input" };
    await ctx.reply("📱 একাধিক নম্বর একসাথে অ্যাড করতে নিচের ফরম্যাটে পাঠান:\n\n<code>Service|Country|01600000000\nService|Country|01700000000</code>", { parse_mode: "HTML" }).catch(()=>{});
});

bot.hears("❌ Delete Numbers", async (ctx) => {
    const dbData = readDb();
    if (!dbData.admins.includes(ctx.from.id)) return;

    const keyboard = new InlineKeyboard()
        .text("🗑️ Delete ALL Numbers", "del_all_nums").row()
        .text("🗑️ Delete Used Numbers", "del_used_nums");

    await ctx.reply("❌ কোনটি ডিলিট করতে চান নির্বাচন করুন:", { reply_markup: keyboard }).catch(()=>{});
});

bot.callbackQuery("del_all_nums", async (ctx) => {
    let dbData = readDb();
    dbData.numbers = [];
    writeDb(dbData);
    await ctx.editMessageText("✅ সমস্ত নম্বর ডাটাবেজ থেকে মুছে ফেলা হয়েছে।").catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery("del_used_nums", async (ctx) => {
    let dbData = readDb();
    dbData.numbers = dbData.numbers.filter(n => n.status === "available");
    writeDb(dbData);
    await ctx.editMessageText("✅ সকল ব্যবহৃত (Used) নম্বর ডিলিট করা হয়েছে।").catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.hears("🛠️ Service Settings", async (ctx) => {
    const dbData = readDb();
    if (!dbData.admins.includes(ctx.from.id)) return;

    const keyboard = new InlineKeyboard()
        .text("➕ Add Service", "srv_add").text("❌ Delete Service", "srv_del").row()
        .text("💵 Set Service Rate", "srv_rate");

    await ctx.reply("🛠️ <b>Service Management Panel</b>", { reply_markup: keyboard, parse_mode: "HTML" }).catch(()=>{});
});

bot.callbackQuery("srv_add", async (ctx) => {
    adminState[ctx.from.id] = { step: "awaiting_new_service_name" };
    await ctx.editMessageText("➕ নতুন সার্ভিসটির নাম লিখে পাঠান:").catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery("srv_del", async (ctx) => {
    const dbData = readDb();
    const keyboard = new InlineKeyboard();
    dbData.services.forEach(s => {
        keyboard.text(`❌ ${s}`, `delsrv_${s}`).row();
    });
    await ctx.editMessageText("🗑️ যে সার্ভিসটি ডিলিট করতে চান তা বেছে নিন:", { reply_markup: keyboard }).catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery(/^delsrv_/, async (ctx) => {
    const srvName = ctx.callbackQuery.data.split("_")[1];
    let dbData = readDb();
    dbData.services = dbData.services.filter(s => s !== srvName);
    writeDb(dbData);
    await ctx.editMessageText(`✅ সার্ভিস <b>${srvName}</b> ডিলিট করা হয়েছে।`, { parse_mode: "HTML" }).catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery("srv_rate", async (ctx) => {
    adminState[ctx.from.id] = { step: "awaiting_rate_setting" };
    await ctx.editMessageText("💵 রেট সেট করতে এই ফরম্যাটে লিখুন:\n<code>ServiceName_CountryName Rate</code>\n\nউদাহরণ:\n<code>Telegram_Bangladesh 5.50</code>\nঅথবা শুধু সার্ভিসের জন্য:\n<code>Telegram 5.00</code>", { parse_mode: "HTML" }).catch(()=>{});
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.hears("💸 Withdraw Requests", async (ctx) => {
    const dbData = readDb();
    if (!dbData.admins.includes(ctx.from.id)) return;

    const pending = dbData.withdrawals ? dbData.withdrawals.filter(w => w.status === "pending") : [];

    if (pending.length === 0) {
        await ctx.reply("✅ কোনো পেন্ডিং উইথড্র রিকোয়েস্ট নেই।").catch(()=>{});
        return;
    }

    for (const w of pending) {
        const text = `💸 <b>Withdrawal Request</b>\n\n👤 User ID: <code>${w.userId}</code>\n💰 Amount: ৳${w.amount}\n📝 Details: <code>${w.details}</code>`;
        const keyboard = new InlineKeyboard()
            .text("✅ Approve", `wapp_${w.id}`).text("❌ Reject", `wrej_${w.id}`);
        await ctx.reply(text, { reply_markup: keyboard, parse_mode: "HTML" }).catch(()=>{});
    }
});

bot.callbackQuery(/^wapp_/, async (ctx) => {
    const wId = ctx.callbackQuery.data.split("_")[1];
    let dbData = readDb();
    const req = dbData.withdrawals.find(w => w.id.toString() === wId);
    if (req) {
        req.status = "approved";
        writeDb(dbData);
        await ctx.editMessageText(`✅ Withdraw #${wId} অনুমোদিত হয়েছে।`).catch(()=>{});
        await bot.api.sendMessage(req.userId, `🎉 আপনার ৳${req.amount} BDT উইথড্র রিকোয়েস্ট সফলভাবে কমপ্লিট হয়েছে!`).catch(()=>{});
    }
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.callbackQuery(/^wrej_/, async (ctx) => {
    const wId = ctx.callbackQuery.data.split("_")[1];
    let dbData = readDb();
    const req = dbData.withdrawals.find(w => w.id.toString() === wId);
    if (req) {
        req.status = "rejected";
        dbData.balances[req.userId] = (dbData.balances[req.userId] || 0) + req.amount;
        writeDb(dbData);
        await ctx.editMessageText(`❌ Withdraw #${wId} রিজেক্ট করা হয়েছে এবং টাকা রিফান্ড করা হয়েছে।`).catch(()=>{});
        await bot.api.sendMessage(req.userId, `❌ আপনার ৳${req.amount} BDT উইথড্র রিকোয়েস্ট রিজেক্ট করা হয়েছে এবং ব্যালেন্স ফেরত দেওয়া হয়েছে।`).catch(()=>{});
    }
    ctx.answerCallbackQuery().catch(()=>{});
});

bot.hears("📢 Admin Control", async (ctx) => {
    const dbData = readDb();
    if (!dbData.admins.includes(ctx.from.id)) return;

    adminState[ctx.from.id] = { step: "awaiting_broadcast_msg" };
    await ctx.reply("📢 সকল ইউজারকে ব্রডকাস্ট মেসেজ পাঠাতে আপনার মেসেজটি লিখে পাঠান:").catch(()=>{});
});

// --- STATE LISTENERS (User & Admin Inputs) ---
bot.on("message:text", async (ctx) => {
    const userId = ctx.from.id;
    let dbData = readDb();

    // 1. User State Engine
    if (userState[userId]) {
        const state = userState[userId];
        if (state.step === "awaiting_withdraw_details") {
            const details = ctx.message.text.trim();
            const amount = dbData.balances[userId] || 0;

            if (!dbData.withdrawals) dbData.withdrawals = [];
            
            const reqId = Date.now();
            dbData.withdrawals.push({
                id: reqId,
                userId: userId,
                amount: amount,
                details: details,
                status: "pending"
            });

            dbData.balances[userId] = 0.00; // ব্যালেন্স জিরো করা
            writeDb(dbData);
            delete userState[userId];

            await ctx.reply("✅ আপনার উইথড্র রিকোয়েস্ট অ্যাডমিনের কাছে পাঠানো হয়েছে।").catch(()=>{});
            
            // অ্যাডমিনদের নোটিফিকেশন দেওয়া
            dbData.admins.forEach(adminId => {
                bot.api.sendMessage(adminId, `🔔 <b>নতুন Withdraw রিকোয়েস্ট!</b>\n\nUser: <code>${userId}</code>\nAmount: ৳${amount}\nDetails: ${escapeHtml(details)}`, { parse_mode: "HTML" }).catch(()=>{});
            });
            return;
        }
    }

    // 2. Admin State Engine
    const state = adminState[userId];
    if (!state) return;

    if (state.step === "awaiting_number_limit") {
        const limit = parseInt(ctx.message.text.trim());
        if (!isNaN(limit) && limit >= 1) {
            dbData.numberLimit = limit;
            writeDb(dbData);
            delete adminState[userId];
            await ctx.reply(`✅ <b>Multi-Number Limit সেট করা হয়েছে: ${limit} টি</b>`, { parse_mode: "HTML" }).catch(()=>{});
        } else {
            await ctx.reply("❌ সঠিক সংখ্যা দিন।").catch(()=>{});
        }
    } else if (state.step === "awaiting_api_url") {
        const url = ctx.message.text.trim();
        if (url.startsWith("http")) {
            if (!dbData.apiUrls) dbData.apiUrls = [];
            dbData.apiUrls.push(url);
            writeDb(dbData);
            delete adminState[userId];
            await ctx.reply(`✅ <b>নতুন API URL যুক্ত করা হয়েছে:</b>\n<code>${url}</code>`, { parse_mode: "HTML" }).catch(()=>{});
        } else {
            await ctx.reply("❌ সঠিক URL লিখুন।").catch(()=>{});
        }
    } else if (state.step === "awaiting_delay_ms") {
        const ms = parseInt(ctx.message.text.trim());
        if (!isNaN(ms) && ms >= 1000) {
            dbData.checkDelay = ms;
            writeDb(dbData);
            delete adminState[userId];
            await ctx.reply(`✅ <b>Polling Delay সেট করা হয়েছে: ${ms} ms</b>`, { parse_mode: "HTML" }).catch(()=>{});
        } else {
            await ctx.reply("❌ সঠিক Millisecond মান দিন।").catch(()=>{});
        }
    } else if (state.step === "awaiting_numbers_input") {
        const lines = ctx.message.text.trim().split("\n");
        let addedCount = 0;

        lines.forEach(line => {
            const parts = line.split("|");
            if (parts.length >= 3) {
                const srv = parts[0].trim();
                const cnt = parts[1].trim();
                const num = parts[2].trim();

                dbData.numbers.push({
                    id: Date.now() + Math.floor(Math.random() * 100000),
                    service: srv,
                    country: cnt,
                    phone_number: num,
                    status: "available",
                    assigned_to: null,
                    hasOtpReceived: false
                });
                addedCount++;
            }
        });

        writeDb(dbData);
        delete adminState[userId];
        await ctx.reply(`✅ <b>সফলভাবে ${addedCount} টি নম্বর ডাটাবেজে যুক্ত করা হয়েছে!</b>`, { parse_mode: "HTML" }).catch(()=>{});
    } else if (state.step === "awaiting_new_service_name") {
        const srvName = ctx.message.text.trim();
        if (!dbData.services.includes(srvName)) {
            dbData.services.push(srvName);
            writeDb(dbData);
            await ctx.reply(`✅ নতুন সার্ভিস <b>${srvName}</b> যুক্ত করা হয়েছে।`, { parse_mode: "HTML" }).catch(()=>{});
        }
        delete adminState[userId];
    } else if (state.step === "awaiting_rate_setting") {
        const text = ctx.message.text.trim();
        const spaceIdx = text.lastIndexOf(" ");
        if (spaceIdx !== -1) {
            const key = text.substring(0, spaceIdx).trim();
            const val = parseFloat(text.substring(spaceIdx + 1));
            if (!isNaN(val)) {
                if (!dbData.serviceRates) dbData.serviceRates = {};
                dbData.serviceRates[key] = val;
                writeDb(dbData);
                await ctx.reply(`✅ <b>${key}</b> এর রেট ৳${val.toFixed(2)} সেট করা হয়েছে।`, { parse_mode: "HTML" }).catch(()=>{});
            }
        }
        delete adminState[userId];
    } else if (state.step === "awaiting_broadcast_msg") {
        const msgText = ctx.message.text;
        delete adminState[userId];

        let sent = 0;
        for (const uId of dbData.users) {
            try {
                await bot.api.sendMessage(uId, `📢 <b>অ্যাডমিন নোটিশ:</b>\n\n${msgText}`, { parse_mode: "HTML" });
                sent++;
                await sleep(100);
            } catch(e) {}
        }
        await ctx.reply(`✅ ব্রডকাস্ট সম্পন্ন হয়েছে! মোট ${sent} জন ইউজারের কাছে পাঠানো হয়েছে।`).catch(()=>{});
    }
});

bot.catch((err) => {
    console.error("Grammy error:", err);
});

bot.start({
    onStart: (info) => {
        botInfo = info; 
        console.log(`🚀 Node.js Telegram OTP Bot Online (@${info.username})!`);
        startGlobalPanelListener(); 
    }
});