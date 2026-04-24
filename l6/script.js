function randarray(n = 10, a = 0, b = 10) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push((Math.floor((Math.random()) * Math.abs(b - a)) + a));
    }
    return arr;
}

// Задача 1
// Найти максимальную разницу между элементами массива.
a = randarray();
console.log(a)
let max = a[0], min = a[0];
for (let i = 1; i < a.length; i++) {
    if (a[i] > max) max = a[i];
    if (a[i] < min) min = a[i];
}
console.log((max - min));

// Вернуть массив без повторяющихся элементов.
a = randarray(10, 1, 5);
console.log(a)
let b = [...new Set(a)]
console.log(b)

// Дан массив объектов, вернуть только те, у которых isDone: true.
a = [
    { id: 1, isDone: true },
    { id: 2, isDone: false },
    { id: 3, isDone: true }
]
console.log(a)
b = a.filter(i => i.isDone === true)
console.log(b)

// Задача 2
// Найти элементы массива, которые больше указанного числа:
function morethan(arr, x) {
    let a = arr.filter(n => n > x);
    return a
}
console.log(morethan([1, 4, 6, 3, 2], 2))

// Дан многомерный массив произвольной вложенности. Написать функцию, делающую из него "плоский" массив:
function flatten(arr) {
    return arr.reduce((acc, item) =>
        acc.concat(Array.isArray(item) ? flatten(item) : item), []);
}
console.log(flatten([1, 4, [34, 1, 20], [6, [6, 12, 8], 6]]))

// Задача 3
// Найти, сколько есть в массиве пар чисел, дающих в сумме 0:
// f([-7, 12, 4, 6, -4, -12, 0]) -> 2 
// f([-1, 2, 4, 7, -4, 1, -2]) -> 3
// f([-1, 1, 0, 1]) -> 1
// f([-1, 1, -1, 1]) -> 2
// f([1, 1, 1, 0, -1]) -> 1
// f([0, 0]) -> 1 
// f([]) -> 0 
function pairzero(arr) {
    let buff = arr.filter(n => n !== 0); // убираем нули
    let c = 0;
    c += Math.floor((arr.length - buff.length) / 2) //сразу вносим количество парных нулей
    for (n of buff) {
        if (buff.indexOf(-n) !== -1) //если имеется отрицательная пара текущему числу
        {
            buff.splice(a.indexOf(n), 1); //удаляем их обоих чтобы не считать дважды
            buff.splice(a.indexOf(-n), 1);
            c++; // обновляем счетчик
        }
    }
    return c
}
console.log(pairzero([0, 0]))

// То же самое, но найти количество троек таких чисел.
function getUniqueTrios(nums) {
    const counts = {};
    // считаем количества каждого числа
    nums.forEach(n => counts[n] = (counts[n] || 0) + 1);

    // сортируем уникальные ключи
    const uniqueNums = Object.keys(counts).map(Number).sort((a, b) => a - b);
    const trios = [];

    for (let i = 0; i < uniqueNums.length; i++) { // перебираем все возможные пары и ищем, есть ли к ним закрывающий третий
        for (let j = i; j < uniqueNums.length; j++) {
            const a = uniqueNums[i];
            const b = uniqueNums[j];
            const c = -(a + b);

            if (c < b) continue; //берем только тройки в неубывающем порядке

            if (counts[c] !== undefined) { //если закрывающий нашелся
                // проверяем, хватает ли чисел 
                const needed = {};
                [a, b, c].forEach(n => needed[n] = (needed[n] || 0) + 1);

                const hasEnough = Object.keys(needed).every(n => counts[n] >= needed[n]);

                if (hasEnough) {
                    trios.push([a, b, c]);
                }
            }
        }
    }
    return trios;
}
function findTrios(nums) {
    const counts = {};
    nums.forEach(n => counts[n] = (counts[n] || 0) + 1);

    let uniqueNums = Object.keys(counts).map(Number).sort((a, b) => a - b);
    let possibleTrios = getUniqueTrios(nums);

    // считаем, насколько редко используется число
    const rarity = {};
    possibleTrios.flat().forEach(num => rarity[num] = (rarity[num] || 0) + 1);

    // берем первыми тройки с самыми редкими числами
    possibleTrios.sort((t1, t2) => {
        const minRarity1 = Math.min(...t1.map(n => rarity[n]));
        const minRarity2 = Math.min(...t2.map(n => rarity[n]));
        return minRarity1 - minRarity2;
    });

    // 4. Собираем результат
    const result = [];
    for (let trio of possibleTrios) {
        const [a, b, c] = trio;

        // пытаемся набрать максимальное число этой тройки
        const neededInTrio = {};
        trio.forEach(num => neededInTrio[num] = (neededInTrio[num] || 0) + 1);

        // сколько таких троек мы можем собрать максимум
        let maxPossible = Infinity;
        for (let num in neededInTrio) {
            const available = counts[num] || 0;
            const perTrio = neededInTrio[num];
            const canBuild = Math.floor(available / perTrio);

            maxPossible = Math.min(maxPossible, canBuild);
        }

        // если можем построить хотя бы одну
        if (maxPossible > 0) {
            for (let i = 0; i < maxPossible; i++) {
                result.push([...trio]); 
            }
            // вычитаем все использованные числа
            for (let num in neededInTrio) {
                counts[num] -= neededInTrio[num] * maxPossible;
            }
        }
    }
    return result;
}

const myNums = [-5, -4, -1, 2, 3, 5, 0, 0, 0, -1, 1, 0]; // это жадный алгоритм, и возможно ответ не оптимальный
console.log(findTrios(myNums));