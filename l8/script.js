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
