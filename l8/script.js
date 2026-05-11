//ПЕРЕХВАТ КОНСОЛИ
(function() {
    const oldLog = console.log;
    console.log = function(...args) {
        oldLog.apply(console, args);
        const output = document.getElementById('console-output');
        if (output) {
            const line = document.createElement('div');
            line.style.marginBottom = '4px';
            line.innerText = `> ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}`;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        }
    };
})();

//STORED COUNTER
let activeCounter = null;

//UI
function uiStart() {
    if (!activeCounter) {
        const n = document.getElementById('nCreateCounter').value;
        activeCounter = createCounter(Number(n));
    }
    activeCounter.start();
}

function uiPause() {
    if (activeCounter) activeCounter.pause();
}

function uiStop() {
    if (activeCounter) {
        activeCounter.stop();
        activeCounter = null;
    }
}

async function uiDelay() {
    const n = Number(document.getElementById('delaySeconds').value);
    console.log(`awaiting promise ${n} s...`);
    const result = await delay(n);
    console.log(`result: ${result}`);
}

async function uiCounterDelay() {
    const n = Number(document.getElementById('nDelayCounter').value);
    console.log(`delay based counter started (${n} s)`);
    counterDelay(n); 
}

async function uiGetGithubUser() {
    console.log("awaiting user input...");
    try {
        const user = await getGithubUser();
        if (user) {
            console.log("github username fetched!");
            //console.log(user); // Выведет весь объект в консоль
        } else {
            console.log("getgithubuser canceled by user");
        }
    } catch (err) {
        console.log("an error occured: ", err.message);
    }
}

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
    }, 1000*(Number(n)+1)+50); //небольшой запас 50ms чтобы 0 успел вывестись
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
        }, Number(n)*1000);
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
    p = delay(Number(n)+1); // +1 потому что ноль
    p.then(() => {clearInterval(counterTimer)});
}
// возможно ожидался такой вариант?
async function trueCounterDelay(n) {
    for (let i = n; i >= 0; i--) {
        console.log(i);
        await delay(1); // Ждем 1 секунду перед следующей цифрой
    }
}
 //counterDelay(10)

//Написать функцию, возвращающую название первого репозитория на github.com по имени
//пользователя (2 последовательных запроса: https://api.github.com/users/%USERNAME%).
async function checkUserAndGetRepo(username) {
  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    
    if (userResponse.status === 404) {
      console.log("Пользователь не найден");
      return `user ${username} is not found`;
    }
    
    const userData = await userResponse.json();
    console.log("found user:", userData.login);

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=1`);
    const repos = await reposResponse.json();

    if (repos.length > 0) {
      console.log("repo hit")
      return `found repo ${repos[0].name} by ${username}`;
    } else {
      console.log("no public repo found");
      return `user ${username} has no public repos`
    }
  } catch (error) {
    console.error("an error occured:", error);
    return null;
  }
}

// checkUserAndGetRepo("dmitryweiner").then(x => {
//   console.log(x);
// });

//Задача 3 (на async/await)
//Перепишите, используя async/await вместо .then/catch.
class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

async function loadJson(url) {
  const response = await fetch(url)
  if (response.status == 200) {
    return await response.json();
  } else {
    throw new HttpError(response);
  }
}

// Запрашивается логин, пока github не вернёт существующего пользователя.
async function getGithubUser() {
  let user;

  while (true) {
    let name = prompt("Введите логин?", "iliakan");

    if (name === null) {
      console.log("canceled by user");
      return null;
    }

    try {
      user = await loadJson(`https://api.github.com/users/${name}`)
      break;
    } catch (err) {
      if (err instanceof HttpError && err.response.status == 404) {
        console.log("Такого пользователя не существует, пожалуйста, повторите ввод.");
      } else {
        throw err;
      }
    }
  }

  console.log(`Полное имя: ${user.name}.`);
  return user;
}

//getGithubUser().catch(err => console.error("error:", err));;