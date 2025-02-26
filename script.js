'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovement = function (movement, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort
    ? movement.slice().sort((cur, next) => next - cur)
    : movement;
  mov.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${new Intl.NumberFormat('en-UK').format(
        mov
      )}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const totalBalance = function (accs) {
  accs.balance = accs.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `${new Intl.NumberFormat('en-UK').format(
    accs.balance
  )}€`;
};
// const totalBalance = function (mov) {
//   const balance = mov.reduce((acc, cur) => acc + cur, 0);
//   labelBalance.textContent = `${balance}€`;
// };
const calcDisplaySummary = function (arr, currentAcc) {
  const deposte = arr.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0);
  const withdraw = arr
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  const interest = arr
    .filter(mov => mov > 0)
    .map(int => (int * currentAcc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${new Intl.NumberFormat('en-UK').format(deposte)}€`;
  labelSumOut.textContent = `${new Intl.NumberFormat('en-UK').format(
    Math.abs(withdraw)
  )}€`;
  labelSumInterest.textContent = `${new Intl.NumberFormat('en-UK').format(
    interest
  )}€`;
};
const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(val => val[0])
      .join('');
  });
};
creatUserNames(accounts);
let currentAcc, timer;
const updateUI = function (currentAcc) {
  displayMovement(currentAcc.movements);
  totalBalance(currentAcc);
  calcDisplaySummary(currentAcc.movements, currentAcc);
};
const formatTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get Started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 300;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); ///Prevent form from submitting
  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAcc);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    console.log('login');
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    updateUI(currentAcc);
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
  }
  if (timer) clearInterval(timer);
  timer = formatTimer();
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAccount &&
    currentAcc.balance >= amount &&
    receiverAccount?.username !== currentAcc.username
  ) {
    console.log('Transfer Valid');
    currentAcc.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUI(currentAcc);
    inputTransferAmount.value = inputTransferTo.value = '';
  } else console.log('Cheating! cheating!');
  if (timer) clearInterval(timer);
  timer = formatTimer();
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    currentAcc.movements.push(amount);
  }
  updateUI(currentAcc);
  if (timer) clearInterval(timer);
  timer = formatTimer();
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAcc.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAcc.movements, !sorted);
  sorted = !sorted;
});
