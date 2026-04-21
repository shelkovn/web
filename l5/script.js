//Задание 1.
//развернуть число
function reverse(n) {
    let a = String(n)
        .split('')   // to array
        .reverse()   // backward order
        .join('');   // to string
    
    return Number(a);
}
console.log(reverse(123));

//оставить только уникальные цифры
function unique(n) {
    let a = [...new Set(String(n))].join('');  
    return Number(a);
}
console.log(unique(111333456));

//посчитать вхождения цифры
function count(n, x) {
    let count = 0;

    for (let char of String(n)) {
        if (char === String(x)[0]) count++;
    }
    return count;
}
console.log(count(1355567, 5));

//Посчитать самую длинную последовательность нулей/единиц в двоичной записи данного числа.
function countbinary(n) {
    let binary = Number(n).toString(2);
    let c, maxcount = 0;
    let last = binary[0];

    for (let char of String(binary)) {
        if (char === last) {
            c++;
        }
        else {
            if (c > maxcount)
                maxcount = c;
            c = 1;
            last = char;
        }
    }
    if (c > maxcount)
        maxcount = c;
    return maxcount;
}
console.log(countbinary(101024)); //1 10001010 10100000 -> 5

//Задание 2
//Найти самый первый неповторяющийся символ в строке: 'фывфавыапрс' -> 'п'.
function firstunique(str)
{
    let counts = {};

    for (let char of str) {
        counts[char] = (counts[char] || 0) + 1;
    }

    return Object.keys(counts).find(key => counts[key] === 1);
}
console.log(firstunique('фывфавыапрс'))


//Cгенерировать строку заданной длины из случайных символов, взятых из набора английскийх букв и цифр: (5) -> '2fvg6'.
function random(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor((Math.random()) * chars.length);
        result += chars[randomIndex];
    }
    
    return result;
}
console.log(random(5))

//Вернуть только уникальные символы строки: 'позволяеткопироватьтекстиз' -> 'позвляеткираьс'.
function uniquestr(n) {
    let a = [...new Set(String(n))].join('');  
    return a;
}
console.log(uniquestr('позволяеткопироватьтекстиз'));