(function () {
    'use strict';

    const COMMON_PASSWORDS = new Set([
        '123456','password','12345678','qwerty','123456789','12345','1234','111111',
        '1234567','sunshine','qwerty123','iloveyou','princess','admin','welcome',
        '666666','abc123','football','123123','monkey','654321','!@#$%^&*',
        'charlie','aa123456','donald','password1','qwerty1234','trustno1',
        'letmein','dragon','baseball','adobe123','master','login','hello',
        'passw0rd','shadow','michael','superman','ashley','batman','starwars',
        'jordan','andrew','mustang','thomas','soccer','access','flower','hunter',
        'lovely','robert','jennifer','passwd','11111111','0123456789','qwertyuiop',
        'asdfghjkl','zxcvbnm','qwerty1','1q2w3e4r','qazwsx','password123',
        '1qaz2wsx','qwerty12345','pass','pass123','admin123','letmein123',
        'welcome1','iloveyou123','test123','test','guest','root','toor',
        'anything','nothing','whatever','blah','default','changeme','temp',
        'pass1234','p@ssw0rd','P@ssw0rd','P@$$w0rd','passw0rd!','Passw0rd',
        'trustno1!','Trustin0us','1111111111','000000','121212','112233',
        '987654321','555555','777777','888888','999999','147258','159357',
        'qwerty12','123qwe','qwe123','1q2w3e','rtyu','asd','zxc','xcvbnm',
        'password!','password123!','passw0rd123','Pass@123','Pass@1234',
        'Passw0rd123','Password123!','admin@123','Admin@123','root123',
        'toor123','changeme123','summer','winter','spring','autumn','october',
        'november','december','january','february','march','april','may','june',
        'july','august','september','chocolate','tigger','pepper','thomas',
        'george','jessica','joshua','matthew','daniel','andrew','william',
        'joseph','christopher','oliver','jack','harry','james','noah','liam',
        'mason','ethan','logan','lucas','jackson','aiden','jacob','elijah',
        'sebastian','david','samuel','john','nathan','carter','henry','owen',
        'gabriel','wyatt','julian','isaac','levi','aaron','connor','luke',
        'jaxon','ezekiel','grayson','jose','carson','landon','caleb','hudson',
        'ryan','nolan','evan','brayden','nicholas','lincoln','adrian','colton',
        'jordan','jace','cooper','emmett','tucker','kayden','damian','xavier',
        'brooks','declan','camden','robert','asher','parker','jeremiah','miles',
        'ian','ryder','sawyer','jason','roman','leonardo','maxwell','kingston',
        'silas','bentley','jaxson','jameson','micah','everett','brian','greyson',
        'axel','wesley','jonah','max','jake','chance','hayden','carson',
        'emma','olivia','ava','isabella','sophia','mia','charlotte','amelia',
        'harper','evelyn','abigail','emily','ella','avery','sofia','camila',
        'aria','scarlett','victoria','madison','luna','grace','chloe','penelope',
        'layla','riley','zoey','nora','lily','eleanor','hannah','lillian',
        'addison','aubrey','ellie','stella','natalie','zoe','leah','hazel',
        'violet','aurora','savannah','audrey','brooklyn','bella','claire',
        'skylar','lucy','paisley','everly','anna','caroline','nova','genesis',
        'emilia','kennedy','samantha','maya','willow','kylie','naomi','kehlani'
    ]);

    const KEYBOARD_PATTERNS = [
        'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
        'qwertzuiop', 'asdfghjkl', 'yxcvbnm',
        'azertyuiop', 'qsdfghjklm', 'wxcvbn',
        'qwertyuiop[]', 'asdfghjkl;\'', 'zxcvbnm,./',
        '1234567890', '1234567890-=', 'qwerty', 'asdfgh', 'zxcvbn',
        '!@#$%^&*()', '~!@#$%^&*()_+'
    ];

    const SEQUENTIAL_PATTERNS = [
        'abcdefghijklmnopqrstuvwxyz',
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '0123456789',
        'abcdefghijklmnopqrstuvwxyz0123456789'
    ];

    const KEYBOARD_ROWS = [
        'qwertyuiop[]\\', 'asdfghjkl;\'', 'zxcvbnm,./',
        'QWERTYUIOP{}|', 'ASDFGHJKL:"', 'ZXCVBNM<>?',
        '`1234567890-=', '~!@#$%^&*()_+'
    ];

    const N_GRAM = 3;

    function buildNGramSet(patterns, n) {
        const s = new Set();
        for (const p of patterns) {
            for (let i = 0; i <= p.length - n; i++) {
                s.add(p.substring(i, i + n));
            }
        }
        return s;
    }

    const keyboardNGrams = buildNGramSet(KEYBOARD_ROWS, N_GRAM);
    const sequentialNGrams = buildNGramSet(SEQUENTIAL_PATTERNS, N_GRAM);

    function isCommonPassword(pw) {
        return COMMON_PASSWORDS.has(pw.toLowerCase());
    }

    function containsKeyboardPattern(pw) {
        const lower = pw.toLowerCase();
        for (let i = 0; i <= lower.length - N_GRAM; i++) {
            const gram = lower.substring(i, i + N_GRAM);
            if (keyboardNGrams.has(gram)) return true;
        }
        return false;
    }

    function containsSequentialPattern(pw) {
        for (let i = 0; i <= pw.length - N_GRAM; i++) {
            const gram = pw.substring(i, i + N_GRAM);
            if (sequentialNGrams.has(gram)) return true;
        }
        return false;
    }

    function containsRepeatedPattern(pw) {
        return /(.)\1{2,}/.test(pw) || /(.{2,})\1{2,}/.test(pw);
    }

    function containsDatePattern(pw) {
        return /(19|20)\d{2}/.test(pw) ||
               /\b(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\b/.test(pw) ||
               /\b(0?[1-9]|[12]\d|3[01])[-/](0?[1-9]|1[0-2])\b/.test(pw);
    }

    function containsCommonSubstitutions(pw) {
        const subs = [
            { from: /0/g, to: 'o' }, { from: /1/g, to: 'l' },
            { from: /3/g, to: 'e' }, { from: /4/g, to: 'a' },
            { from: /5/g, to: 's' }, { from: /7/g, to: 't' },
            { from: /8/g, to: 'b' }, { from: /@/g, to: 'a' },
            { from: /\$/g, to: 's' }, { from: /!/g, to: 'i' },
            { from: /\(/g, to: 'c' }, { from: /\+/g, to: 't' },
        ];
        let normalized = pw.toLowerCase();
        for (const s of subs) {
            normalized = normalized.replace(s.from, s.to);
        }
        if (normalized !== pw.toLowerCase()) {
            return COMMON_PASSWORDS.has(normalized);
        }
        return false;
    }

    function calculateShannonEntropy(pw) {
        if (!pw) return 0;
        const len = pw.length;
        const freq = {};
        for (const ch of pw) {
            freq[ch] = (freq[ch] || 0) + 1;
        }
        let entropy = 0;
        for (const ch in freq) {
            const p = freq[ch] / len;
            entropy -= p * (Math.log2(p));
        }
        return entropy;
    }

    function calculateKeyspace(pw) {
        if (!pw) return 0n;
        let pool = 0n;
        if (/[a-z]/.test(pw)) pool += 26n;
        if (/[A-Z]/.test(pw)) pool += 26n;
        if (/[0-9]/.test(pw)) pool += 10n;
        if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw)) pool += 33n;
        if (/[\x80-\xFF]/.test(pw)) pool += 128n;
        if (pool === 0n) pool = 26n;
        return pool ** BigInt(pw.length);
    }

    function calculateCrackTime(entropy, guessesPerSec) {
        const combinations = Math.pow(2, entropy);
        const seconds = combinations / guessesPerSec;

        if (seconds < 1) return { value: 'Instant', numeric: 0 };
        if (seconds < 60) return { value: `${Math.round(seconds)}s`, numeric: seconds };
        if (seconds < 3600) return { value: `${Math.round(seconds / 60)}min`, numeric: seconds };
        if (seconds < 86400) return { value: `${Math.round(seconds / 3600)}hr`, numeric: seconds };
        if (seconds < 31536000) return { value: `${Math.round(seconds / 86400)}d`, numeric: seconds };
        if (seconds < 31536000000) return { value: `${(seconds / 31536000).toFixed(1)}yr`, numeric: seconds };
        if (seconds < 3.1536e15) return { value: `${(seconds / 3.1536e10).toFixed(1)}centuries`, numeric: seconds };
        return { value: 'Centuries+', numeric: seconds };
    }

    function calculateNistEntropy(pw) {
        if (!pw) return 0;
        let entropy = 0;
        const len = pw.length;

        if (len <= 1) return 0;
        entropy += len * 4;

        let bonus = 0;
        if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) bonus += 12;
        else if (/[A-Z]/.test(pw) || /[a-z]/.test(pw)) bonus += 6;
        if (/[0-9]/.test(pw)) bonus += 6;
        if (/[^a-zA-Z0-9]/.test(pw)) bonus += 12;
        if (/(.)\1{2,}/.test(pw)) bonus -= 6;
        if (containsKeyboardPattern(pw)) bonus -= 4;
        if (containsSequentialPattern(pw)) bonus -= 4;

        entropy += Math.max(0, bonus);
        if (len >= 20) entropy += 6;
        else if (len >= 16) entropy += 4;
        else if (len >= 12) entropy += 2;

        return Math.max(0, entropy);
    }

    function analyzePassword(pw) {
        if (!pw) return null;

        const lower = pw.toLowerCase();
        const len = pw.length;
        const hasUpper = /[A-Z]/.test(pw);
        const hasLower = /[a-z]/.test(pw);
        const hasDigits = /[0-9]/.test(pw);
        const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw);
        const hasOther = /[\x80-\xFF]/.test(pw);

        const upperCount = (pw.match(/[A-Z]/g) || []).length;
        const lowerCount = (pw.match(/[a-z]/g) || []).length;
        const digitCount = (pw.match(/[0-9]/g) || []).length;
        const specialCount = (pw.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/g) || []).length;
        const otherCount = len - upperCount - lowerCount - digitCount - specialCount;

        const common = isCommonPassword(pw) || containsCommonSubstitutions(pw);
        const keyboardPattern = containsKeyboardPattern(pw);
        const sequentialPattern = containsSequentialPattern(pw);
        const repeatedPattern = containsRepeatedPattern(pw);
        const datePattern = containsDatePattern(pw);

        const shannon = calculateShannonEntropy(pw);
        const nist = calculateNistEntropy(pw);
        const finalEntropy = Math.max(shannon * 2, nist);

        const keyspace = calculateKeyspace(pw);
        const crackTimeOnline = calculateCrackTime(Math.min(finalEntropy, 128), 1e10);
        const crackTimeOffline = calculateCrackTime(Math.min(finalEntropy, 128), 1e16);

        let score = 0;
        score += Math.min(len * 8, 20);
        if (len >= 8) score += 5;
        if (len >= 12) score += 5;
        if (len >= 16) score += 5;
        if (len >= 20) score += 5;
        if (hasUpper) score += 5;
        if (hasLower) score += 5;
        if (hasDigits) score += 5;
        if (hasSpecial) score += 10;
        if (hasOther) score += 5;
        if (hasUpper && hasLower && hasDigits) score += 5;
        if (hasUpper && hasLower && hasDigits && hasSpecial) score += 10;

        if (common) score -= 30;
        if (keyboardPattern) score -= 10;
        if (sequentialPattern) score -= 10;
        if (repeatedPattern) score -= 10;
        if (datePattern) score -= 5;

        if (upperCount > len * 0.8 && len > 3) score -= 5;
        if (lowerCount > len * 0.8 && len > 3) score -= 5;
        if (digitCount > len * 0.6 && len > 3 && !hasUpper && !hasLower) score -= 10;

        score = Math.max(0, Math.min(100, Math.round(score)));

        let strength, color;
        if (score >= 80) { strength = 'Very Strong'; color = '#22c55e'; }
        else if (score >= 60) { strength = 'Strong'; color = '#06b6d4'; }
        else if (score >= 40) { strength = 'Fair'; color = '#eab308'; }
        else if (score >= 20) { strength = 'Weak'; color = '#f97316'; }
        else { strength = 'Very Weak'; color = '#ef4444'; }

        const criteria = {
            length: len >= 12,
            uppercase: hasUpper,
            lowercase: hasLower,
            digits: hasDigits,
            special: hasSpecial,
            noCommon: !common,
            noPattern: !keyboardPattern && !sequentialPattern && !repeatedPattern && !datePattern,
            entropy: finalEntropy >= 60
        };

        const feedback = [];
        if (len < 8) feedback.push({ type: 'error', msg: 'Too short — minimum 8 characters, recommend 12+' });
        else if (len < 12) feedback.push({ type: 'warning', msg: 'Consider at least 12 characters for better security' });
        if (len >= 20) feedback.push({ type: 'success', msg: 'Excellent length (20+ characters)' });
        if (!hasUpper) feedback.push({ type: 'error', msg: 'Add uppercase letters (A-Z)' });
        if (!hasLower) feedback.push({ type: 'error', msg: 'Add lowercase letters (a-z)' });
        if (!hasDigits) feedback.push({ type: 'warning', msg: 'Include digits (0-9)' });
        if (!hasSpecial) feedback.push({ type: 'warning', msg: 'Include special characters (!@#$%^&*)' });
        if (common) feedback.push({ type: 'error', msg: 'This is a very common password — easily guessed' });
        if (containsCommonSubstitutions(pw)) {
            feedback.push({ type: 'error', msg: 'Common leet-speak substitution detected — still guessable' });
        }
        if (keyboardPattern) feedback.push({ type: 'warning', msg: 'Contains keyboard pattern (e.g., qwerty, asdf)' });
        if (sequentialPattern) feedback.push({ type: 'warning', msg: 'Contains sequential characters (e.g., abc, 123)' });
        if (repeatedPattern) feedback.push({ type: 'warning', msg: 'Contains repeated characters or patterns' });
        if (datePattern) feedback.push({ type: 'warning', msg: 'Contains a date pattern — easily guessed' });
        if (len >= 8 && !common && !keyboardPattern && !sequentialPattern) {
            feedback.push({ type: 'success', msg: 'No common patterns detected — good' });
        }
        if (score >= 80) feedback.push({ type: 'info', msg: 'This password is very strong against brute force attacks' });

        return {
            score,
            strength,
            color,
            len,
            hasUpper, hasLower, hasDigits, hasSpecial, hasOther,
            upperCount, lowerCount, digitCount, specialCount, otherCount,
            common, keyboardPattern, sequentialPattern, repeatedPattern, datePattern,
            shannon, nist, finalEntropy,
            keyspace: keyspace.toString(),
            crackTimeOnline, crackTimeOffline,
            criteria, feedback
        };
    }

    function generatePassword(length, useUpper, useLower, useDigits, useSpecial) {
        let chars = '';
        if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (useDigits) chars += '0123456789';
        if (useSpecial) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!chars) return 'Select at least one character set';

        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        let pw = '';
        for (let i = 0; i < length; i++) {
            pw += chars[array[i] % chars.length];
        }

        let needsShuffle = false;
        if (useUpper && !/[A-Z]/.test(pw)) needsShuffle = true;
        if (useLower && !/[a-z]/.test(pw)) needsShuffle = true;
        if (useDigits && !/[0-9]/.test(pw)) needsShuffle = true;
        if (useSpecial && !/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(pw)) needsShuffle = true;

        if (needsShuffle) {
            const guaranteed = [];
            if (useUpper) guaranteed.push('A' + String.fromCharCode(66 + (array[0] % 25)));
            if (useLower) guaranteed.push('m' + String.fromCharCode(110 + (array[1] % 12)));
            if (useDigits) guaranteed.push(String.fromCharCode(48 + (array[2] % 10)));
            if (useSpecial) guaranteed.push('!@#$%^&*' [array[3] % 8]);

            pw = pw.substring(0, pw.length - guaranteed.length) + guaranteed.join('');
            const arr = pw.split('');
            for (let i = arr.length - 1; i > 0; i--) {
                const j = array[i % array.length] % (i + 1);
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            pw = arr.join('');
        }

        return pw;
    }

    const DOM = {
        input: document.getElementById('passwordInput'),
        toggleBtn: document.getElementById('toggleVisibility'),
        clearBtn: document.getElementById('clearBtn'),
        strengthBar: document.getElementById('strengthBar'),
        strengthLabel: document.getElementById('strengthLabel'),
        scoreDisplay: document.getElementById('scoreDisplay'),
        entropyValue: document.getElementById('entropyValue'),
        entropyLabel: document.getElementById('entropyLabel'),
        crackTimeValue: document.getElementById('crackTimeValue'),
        crackTimeLabel: document.getElementById('crackTimeLabel'),
        keySpaceValue: document.getElementById('keySpaceValue'),
        keySpaceLabel: document.getElementById('keySpaceLabel'),
        complexityValue: document.getElementById('complexityValue'),
        complexityLabel: document.getElementById('complexityLabel'),
        criteriaList: document.getElementById('criteriaList'),
        feedbackList: document.getElementById('feedbackList'),
        upperBar: document.getElementById('upperBar'),
        lowerBar: document.getElementById('lowerBar'),
        digitBar: document.getElementById('digitBar'),
        specialBar: document.getElementById('specialBar'),
        otherBar: document.getElementById('otherBar'),
        upperCount: document.getElementById('upperCount'),
        lowerCount: document.getElementById('lowerCount'),
        digitCount: document.getElementById('digitCount'),
        specialCount: document.getElementById('specialCount'),
        otherCount: document.getElementById('otherCount'),
        genUpper: document.getElementById('genUpper'),
        genLower: document.getElementById('genLower'),
        genDigits: document.getElementById('genDigits'),
        genSpecial: document.getElementById('genSpecial'),
        genLength: document.getElementById('genLength'),
        generateBtn: document.getElementById('generateBtn'),
        copyBtn: document.getElementById('copyBtn'),
        generatedPassword: document.getElementById('generatedPassword'),
        historyList: document.getElementById('historyList'),
        clearHistoryBtn: document.getElementById('clearHistoryBtn')
    };

    function updateStrengthBar(score, color) {
        DOM.strengthBar.style.width = score + '%';
        DOM.strengthBar.style.background = color;
        DOM.strengthBar.style.boxShadow = `0 0 10px ${color}44`;
    }

    function updateCriteria(criteria) {
        const items = DOM.criteriaList.querySelectorAll('.criteria-item');
        const map = {
            length: criteria.length,
            uppercase: criteria.uppercase,
            lowercase: criteria.lowercase,
            digits: criteria.digits,
            special: criteria.special,
            noCommon: criteria.noCommon,
            noPattern: criteria.noPattern,
            entropy: criteria.entropy
        };
        items.forEach(item => {
            const key = item.dataset.criteria;
            if (map[key]) {
                item.classList.add('met');
                item.querySelector('.criteria-icon').textContent = '\u25C9';
            } else {
                item.classList.remove('met');
                item.querySelector('.criteria-icon').textContent = '\u25CB';
            }
        });
    }

    function updateFeedback(feedback) {
        DOM.feedbackList.innerHTML = '';
        if (!feedback || feedback.length === 0) {
            DOM.feedbackList.innerHTML = '<span class="empty-history" style="font-style:italic">No issues detected</span>';
            return;
        }
        const icons = { error: '\u2716', warning: '\u26A0', success: '\u2714', info: '\u2139' };
        feedback.forEach(fb => {
            const div = document.createElement('div');
            div.className = `feedback-item ${fb.type}`;
            div.innerHTML = `<span class="fb-icon">${icons[fb.type] || '\u2022'}</span> ${fb.msg}`;
            DOM.feedbackList.appendChild(div);
        });
    }

    function updateCharBars(analysis) {
        const total = analysis.len || 1;
        const sets = [
            { bar: DOM.upperBar, count: DOM.upperCount, val: analysis.upperCount, cls: 'upper' },
            { bar: DOM.lowerBar, count: DOM.lowerCount, val: analysis.lowerCount, cls: 'lower' },
            { bar: DOM.digitBar, count: DOM.digitCount, val: analysis.digitCount, cls: 'digit' },
            { bar: DOM.specialBar, count: DOM.specialCount, val: analysis.specialCount, cls: 'special' },
            { bar: DOM.otherBar, count: DOM.otherCount, val: analysis.otherCount, cls: 'other' }
        ];
        sets.forEach(s => {
            s.bar.style.width = ((s.val / total) * 100) + '%';
            s.bar.className = 'char-bar-fill ' + s.cls;
            s.count.textContent = s.val;
        });
    }

    function formatKeyspace(ks) {
        if (ks === '0') return '0';
        if (ks.length > 12) return ks.substring(0, 4) + '...\u00D710^' + (ks.length - 1);
        return ks.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function resetDisplay() {
        DOM.strengthBar.style.width = '0%';
        DOM.strengthBar.style.background = '#64748b';
        DOM.strengthBar.style.boxShadow = 'none';
        DOM.strengthLabel.textContent = 'No Password';
        DOM.strengthLabel.style.color = '#64748b';
        DOM.scoreDisplay.textContent = '0/100';
        DOM.entropyValue.textContent = '0.00';
        DOM.entropyLabel.textContent = 'bits';
        DOM.crackTimeValue.textContent = 'Instant';
        DOM.crackTimeLabel.textContent = 'at 10B/s';
        DOM.keySpaceValue.textContent = '0';
        DOM.complexityValue.textContent = 'Very Weak';
        DOM.complexityValue.style.color = '#64748b';
        DOM.complexityLabel.textContent = 'risk level';
        updateCriteria({
            length: false, uppercase: false, lowercase: false,
            digits: false, special: false, noCommon: false,
            noPattern: false, entropy: false
        });
        updateFeedback([]);
        const zeros = [DOM.upperCount, DOM.lowerCount, DOM.digitCount, DOM.specialCount, DOM.otherCount];
        const bars = [DOM.upperBar, DOM.lowerBar, DOM.digitBar, DOM.specialBar, DOM.otherBar];
        zeros.forEach(el => el.textContent = '0');
        bars.forEach(el => { el.style.width = '0%'; });
    }

    function updateDisplay(analysis) {
        if (!analysis) { resetDisplay(); return; }

        updateStrengthBar(analysis.score, analysis.color);

        DOM.strengthLabel.textContent = analysis.strength;
        DOM.strengthLabel.style.color = analysis.color;
        DOM.scoreDisplay.textContent = analysis.score + '/100';

        DOM.entropyValue.textContent = analysis.finalEntropy.toFixed(2);
        DOM.entropyLabel.textContent = `bits (Shannon: ${analysis.shannon.toFixed(2)}, NIST: ${analysis.nist.toFixed(2)})`;

        DOM.crackTimeValue.textContent = analysis.crackTimeOnline.value;
        DOM.crackTimeLabel.textContent = `online (10B/s) | offline: ${analysis.crackTimeOffline.value}`;

        DOM.keySpaceValue.textContent = formatKeyspace(analysis.keyspace);
        DOM.keySpaceLabel.textContent = `possible combinations (${analysis.len} chars)`;

        DOM.complexityValue.textContent = analysis.strength;
        DOM.complexityValue.style.color = analysis.color;
        DOM.complexityLabel.textContent = 'risk level';

        updateCriteria(analysis.criteria);
        updateFeedback(analysis.feedback);
        updateCharBars(analysis);
    }

    function handleInput() {
        const pw = DOM.input.value;
        const analysis = analyzePassword(pw);
        updateDisplay(analysis);
        saveToHistory(pw, analysis);
    }

    const HISTORY_KEY = 'psc_history';
    const MAX_HISTORY = 20;

    function saveToHistory(pw, analysis) {
        if (!pw || !analysis) return;
        if (pw.length > 50) return;
        if (analysis.score < 1) return;

        let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        history = history.filter(h => h.password !== pw);
        history.unshift({
            password: pw,
            score: analysis.score,
            strength: analysis.strength,
            timestamp: Date.now()
        });
        if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        DOM.historyList.innerHTML = '';
        if (history.length === 0) {
            DOM.historyList.innerHTML = '<span class="empty-history">No history yet</span>';
            return;
        }
        history.forEach(h => {
            const div = document.createElement('div');
            div.className = 'history-item';
            const passDisplay = h.password.substring(0, 10) + (h.password.length > 10 ? '...' : '');
            const colors = { 'Very Weak': '#ef4444', 'Weak': '#f97316', 'Fair': '#eab308', 'Strong': '#06b6d4', 'Very Strong': '#22c55e' };
            div.innerHTML = `
                <span class="h-pass" title="${h.password.replace(/"/g, '&quot;')}">${passDisplay}</span>
                <span class="h-score" style="color:${colors[h.strength] || '#64748b'}">${h.score}/100 ${h.strength}</span>
            `;
            div.addEventListener('click', () => {
                DOM.input.value = h.password;
                handleInput();
            });
            div.style.cursor = 'pointer';
            DOM.historyList.appendChild(div);
        });
    }

    function toggleVisibility() {
        const type = DOM.input.type;
        DOM.input.type = type === 'password' ? 'text' : 'password';
    }

    function clearInput() {
        DOM.input.value = '';
        DOM.input.type = 'text';
        resetDisplay();
    }

    function generateAndShow() {
        const len = parseInt(DOM.genLength.value) || 20;
        const upper = DOM.genUpper.checked;
        const lower = DOM.genLower.checked;
        const digits = DOM.genDigits.checked;
        const special = DOM.genSpecial.checked;
        const pw = generatePassword(len, upper, lower, digits, special);
        DOM.generatedPassword.textContent = pw;
    }

    function copyGenerated() {
        const text = DOM.generatedPassword.textContent;
        if (!text || text === 'Click Generate' || text === 'Select at least one character set') return;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).catch(() => {});
        }
        const orig = DOM.generatedPassword.textContent;
        DOM.generatedPassword.textContent = 'Copied!';
        DOM.generatedPassword.style.color = '#22c55e';
        setTimeout(() => {
            DOM.generatedPassword.textContent = orig;
            DOM.generatedPassword.style.color = '';
        }, 1200);
    }

    DOM.input.addEventListener('input', handleInput);
    DOM.toggleBtn.addEventListener('click', toggleVisibility);
    DOM.clearBtn.addEventListener('click', clearInput);
    DOM.generateBtn.addEventListener('click', generateAndShow);
    DOM.copyBtn.addEventListener('click', copyGenerated);
    DOM.clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    });

    DOM.genLength.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') generateAndShow();
    });

    renderHistory();

    const demoPasswords = [
        { pw: 'password123', delay: 300 },
        { pw: 'MyS3cur3P@ss!', delay: 800 },
        { pw: 'kX9#mP2$vL5@nQ8&jR1!wT4', delay: 1500 }
    ];
    let demoIdx = 0;
    DOM.input.addEventListener('focus', function onFirstFocus() {
        DOM.input.removeEventListener('focus', onFirstFocus);
        let i = 0;
        function typeNext() {
            if (i >= demoPasswords.length) return;
            const entry = demoPasswords[i];
            const pw = entry.pw;
            let ci = 0;
            DOM.input.value = '';
            resetDisplay();
            function typeChar() {
                if (ci < pw.length) {
                    DOM.input.value += pw[ci];
                    ci++;
                    setTimeout(typeChar, 40);
                } else {
                    handleInput();
                    i++;
                    setTimeout(typeNext, entry.delay);
                }
            }
            typeChar();
        }
        typeNext();
    });

    console.log('%c Advanced Password Strength Checker ',
        'background:#0a0e17;color:#06b6d4;font-size:16px;font-weight:bold;padding:8px 12px;border-radius:4px;');
    console.log('%c Cybersecurity Project — Built with advanced entropy analysis, pattern detection, and crack-time estimation',
        'color:#94a3b8;font-size:12px;');
})();
