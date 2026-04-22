function randarray(n = 10, a=0, b=10)
{
    let arr = [];
    for (let i = 0; i < n; i++){
        arr.push((Math.floor((Math.random()) * Math.abs(b-a)) + a));
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
    {id: 1, isDone: true}, 
    {id: 2, isDone: false},
    {id: 3, isDone: true}
]
console.log(a)
b = a.filter(i => i.isDone === true)
console.log(b)

// Задача 2
// Найти элементы массива, которые больше указанного числа:
function morethan(arr, x){
    let a = arr.filter(n => n>x);
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
// То же самое, но найти количество троек таких чисел.