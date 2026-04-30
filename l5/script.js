// ФУНКЦИИ

function reverse(n) {
    return Number(String(n).split('').reverse().join(''));
}

function unique(n) {
    return Number([...new Set(String(n))].join(''));
}

function count(n, x) {
    let count = 0;
    let target = String(x)[0];
    for (let char of String(n)) {
        if (char === target) count++;
    }
    return count;
}

function countbinary(n) {
    let binary = Number(n).toString(2);
    let c = 0, maxcount = 0; 
    let last = binary[0];

    for (let char of binary) {
        if (char === last) {
            c++;
        } else {
            if (c > maxcount) maxcount = c;
            c = 1;
            last = char;
        }
    }
    return Math.max(c, maxcount);
}

function firstunique(str) {
    let counts = {};
    for (let char of str) {
        counts[char] = (counts[char] || 0) + 1;
    }
    return Object.keys(counts).find(key => counts[key] === 1) || 'Нет таких';
}

function random(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

function uniquestr(n) {
    return [...new Set(String(n))].join('');
}

// UI

function uiReverse() {
    const val = document.getElementById('inputReverse').value;
    document.getElementById('resReverse').innerText = reverse(val);
}

function uiUnique() {
    const val = document.getElementById('inputUnique').value;
    document.getElementById('resUnique').innerText = unique(val);
}

function uiCount() {
    const n = document.getElementById('inputCountN').value;
    const x = document.getElementById('inputCountX').value;
    document.getElementById('resCount').innerText = count(n, x);
}

function uiBinary() {
    const val = document.getElementById('inputBin').value;
    document.getElementById('resBin').innerText = `${countbinary(val)} (for ${Number(val).toString(2)})`;
}

function uiFirstUnique() {
    const val = document.getElementById('inputFirstUnique').value;
    document.getElementById('resFirstUnique').innerText = firstunique(val);
}

function uiRandom() {
    const val = document.getElementById('inputRandLen').value;
    document.getElementById('resRandom').innerText = random(val);
}

function uiUniqueStr() {
    const val = document.getElementById('inputUniqueStr').value;
    document.getElementById('resUniqueStr').innerText = uniquestr(val);
}
