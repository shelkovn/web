// ФУНКЦИИ

//Задача 1 (на таймеры)
//Написать функцию counter(n), которая выводит в консоль раз в секунду числа 
// n, n-1 ... 2, 1, 0 и останавливается.
function counter(n)
{
    let i = Number(n);
    let counterTimer = setInterval(() => {
        console.log(i--);
    }, 1000);
    setTimeout(() => {
        clearInterval(counterTimer)
    }, 1000*(n+1)+50); //небольшой запас 50ms чтобы 0 успел вывестись
}
//counter(10);

//Написать функцию createCounter(n), возвращающую объект с методами:
//start() -- запускает (или возобновляет) счётчик c интервалом 1 секунда: N, N-1.
//pause() -- приостанавливает счёт, но не сбрасывает счётчик.
//stop() -- останавливает счёт, сбрасывает счётчик.
function createCounter(n) {
  let initialValue = n;
  let current = n;
  let timerId = null;

  return {
    start() {
      // "singleton"
      if (timerId) return;
      
      timerId = setInterval(() => {
        if (current >= 0) {
          console.log(current--);
        } else {
          this.stop();
        }
      }, 1000);
    },

    pause() {
      clearInterval(timerId);
      timerId = null;
    },

    stop() {
      this.pause();
      current = initialValue;
      console.log("Счётчик сброшен");
    }
  };
}
//let test = createCounter(5);
//test.start();

//Задача 2 (на промисы)
//Написать функцию delay(N), возвращающую промис, который сделает resolve() через N секунд.
function delay(n)
{
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(`fulfilled in ${n}s`);
        }, n*1000);
    });
}
//p = delay(10);
//p.then(result => {console.log(result);})

//Решить задачу со счётчиком N, N-1 ... 2, 1, 0 через функцию delay.
function counterDelay(n)
{
    let i = Number(n);
    let counterTimer = setInterval(() => {
        console.log(i--);
    }, 1000);
    p = delay(n+1); // +1 потому что ноль
    p.then(() => {clearInterval(counterTimer)});
}
 //counterDelay(10)

//TODO Написать функцию, возвращающую название первого репозитория на github.com по имени
//пользователя (2 последовательных запроса: https://api.github.com/users/%USERNAME%).


//Задача 3 (на async/await)
//Перепишите, используя async/await вместо .then/catch.

//TODO В функции getGithubUser замените рекурсию на цикл, используя async/await.

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

function loadJson(url) {
  return fetch(url)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new HttpError(response);
      }
    })
}

// Запрашивается логин, пока github не вернёт существующего пользователя.
function getGithubUser() {
  let name = prompt("Введите логин?", "iliakan");

  return loadJson(`https://api.github.com/users/${name}`)
    .then(user => {
      alert(`Полное имя: ${user.name}.`);
      return user;
    })
    .catch(err => {
      if (err instanceof HttpError && err.response.status == 404) {
        alert("Такого пользователя не существует, пожалуйста, повторите ввод.");
        return demoGithubUser();
      } else {
        throw err;
      }
    });
}

getGithubUser();

//TODO UI