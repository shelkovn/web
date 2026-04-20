//Задание 1.
function reverse(n) {
    let a = String(n)
        .split('')   // to array
        .reverse()   // backward order
        .join('');   // to string
    
    return Number(a);
}

console.log(reverse(123));

function unique(n) {
    let a = [...new Set(String(n))].join('');  
    return Number(a);
}
console.log(unique(111333456));

function count(n, x) {
    let count = 0;

    for (let char of String(n)) {
        if (char === String(x)[0]) count++;
    }
    return count;
}
console.log(count(1355567, 5));

//TODO Посчитать самую длинную последовательность нулей/единиц в двоичной записи данного числа.

//Задание 2
//TODO Найти самый первый неповторяющийся символ в строке: 'фывфавыапрс' -> 'п'.
//TODO Cгенерировать строку заданной длины из случайных символов, взятых из набора английскийх букв и цифр: (5) -> '2fvg6'.
//TODO Вернуть только уникальные символы строки: 'позволяеткопироватьтекстиз' -> 'позвляеткираьс'.