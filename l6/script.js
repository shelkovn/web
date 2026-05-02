//вспомогательные функции
function randarray(n = 10, a = 0, b = 10) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push((Math.floor((Math.random()) * Math.abs(b - a)) + a));
    }
    return arr;
}

function parseArr(id) {
    return document.getElementById(id).value.split(', ').map(Number);
}

// Задачи
function randarray(n = 10, a = 0, b = 10) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * (b - a)) + a);
    }
    return arr;
}

function getMaxDiff(a) {
    let max = a[0], min = a[0];
    for (let i = 1; i < a.length; i++) {
        if (a[i] > max) max = a[i];
        if (a[i] < min) min = a[i];
    }
    return max - min;
}

function morethan(arr, x) {
    return arr.filter(n => n > x);
}

function flatten(arr) {
    return arr.reduce((acc, item) =>
        acc.concat(Array.isArray(item) ? flatten(item) : item), []);
}

function pairzero(arr) {
    let buff = arr.filter(n => n !== 0); 
    let c = Math.floor((arr.length - buff.length) / 2);
    
    // Используем while, так как splice меняет длину массива во время цикла
    let i = 0;
    while (i < buff.length) {
        let n = buff[i];
        let pairIndex = buff.indexOf(-n, i + 1);
        if (pairIndex !== -1) {
            buff.splice(pairIndex, 1);
            buff.splice(i, 1);
            c++;
        } else {
            i++;
        }
    }
    return c;
}

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

    // собираем результат
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

// --- ФУНКЦИИ ИНТЕРФЕЙСА ---

function uiMaxDiff() {
    const a = randarray(10, 1, 100);
    document.getElementById('arrMaxDiff').innerText = `[${a.join(', ')}]`;
    document.getElementById('resMaxDiff').innerText = getMaxDiff(a);
}

function uiMoreThan() {
    const arr = parseArr('inputMoreArr');
    const x = Number(document.getElementById('inputMoreX').value);
    document.getElementById('resMoreThan').innerText = JSON.stringify(morethan(arr, x));
}

function uiFlatten() {
    const complex = [1, 4, [34, 1, 20], [6, [6, 12, 8], 6]];
    document.getElementById('resFlatten').innerText = JSON.stringify(flatten(complex));
}

function uiPairZero() {
    const arr = parseArr('inputPairArr');
    document.getElementById('resPairZero').innerText = pairzero(arr);
}

function uiFindTrios() {
    const arr = parseArr('inputTrioArr');
    const result = findTrios(arr);
    document.getElementById('resTrios').innerText = result.map(t => `[${t}]`).join(' ');
}