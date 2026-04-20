//Задание 1.
let admin, namevar; // name - зарезервированное слово
namevar = "john";
admin = namevar;
console.log(admin) //console log потому что браузер не любит множество всплывающих окон 

//Задание 2
let a = Number(prompt("Первое число?", 1));
let b = Number(prompt("Второе число?", 2));

console.log(a + b); 

//Задание 3
for (let i = 2; i <= 10; i+=2) {
    console.log( `number ${i}!` );
}

//Задание 4
let i=0;
while (i < 3){
    console.log( `number ${i}!` );
    i++;
}

//Задание 5
let inp;
while (true){
    inp = prompt("Введите число более 100");

    if (inp === null) break; 
    
    if (Number(inp > 100)) break;
}

//Задание 6
let n=10;
let denoms = [];
for (let i=2; i <= n; i++)
{
    if (denoms.every(x => i % x !== 0))
    {
        console.log(i);
        denoms.push(i);
    }
}