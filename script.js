'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
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
let currentAcc;
const updateUI = function (currentAcc) {
  displayMovement(currentAcc.movements);
  totalBalance(currentAcc);
  calcDisplaySummary(currentAcc.movements, currentAcc);
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
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    currentAcc.movements.push(amount);
  }
  updateUI(currentAcc);
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
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log("---FOREACH ON MAP---");

currencies.forEach(function(mov,key,map){
console.log(`${key} stands for ${mov}`)
console.log(map)
});
console.log("---FOREACH ON SET---");
const currenciesUnique= new Set(["USD","GBP","USD","EUR","EUR"]);
currenciesUnique.forEach(function(value,_,set){
  console.log(`${value}: ${_}`)
})
/*console.log("---FOREACH---")
movements.forEach(function(movement){
  if(movement>0){
    console.log(`You Deposite ${movement}`)
  }else{
    console.log(`You Withdrew ${Math.abs(movement)}`)
  }
})
console.log("---FOREACH indexing---")
movements.forEach(function(mov,i,arr){
  if(mov>0){
    console.log(`Movement ${i+1}: You Deposit ${mov}`);
  }else{
    console.log(`Movement ${i+1}: You withdrew ${Math.abs(mov)}`)
  }
  
})
console.log("---FOROFF---")
for(const [i,movement] of movements.entries()){
  if(movement>0){
    console.log(`Movement ${i+1}: You Deposite ${movement}`)
  }else{
    console.log(`Movement ${i+1}: You Withdrew ${Math.abs(movement)}`)
  }
}
/////////////////////////////////////////////////
/*let arr=["a","b","c","d","e","f"];
console.log(arr.slice(2));
console.log(arr);

//splice
console.log(arr.splice(2,2));
console.log(arr);*/

/*
///challenge 1

const checkDog=function(juliaArr,kateArr){
  const juliaCorrected=juliaArr;
  juliaCorrected.splice(0,1) ;
  juliaCorrected.splice(-2,2);

 
  const bothArr=[...juliaCorrected,...kateArr];
  console.log(bothArr)
  bothArr.forEach(function(val,i){
    if(val>=3){
      console.log(`Dog number ${i+1} is an adult, and is ${val} Years old`);
    }else{
      console.log(`Dog number ${i+1} is still a puppy`)
    }
      });
}
checkDog([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);


////MAP METHODS
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurtoUsd=1.1;
// const movementsUsd= movements.map(function(mov){
//   return  (mov*eurtoUsd).toFixed(2);
// })
const movementsUsd= movements.map(mov=>
    (mov*eurtoUsd).toFixed(2));

console.log(movements);
console.log(movementsUsd)

const arrowMovementMap=movements.map((mov,i,arr)=>
`Movement ${i+1}: You ${mov>0?"deposit":"withdrew"} ${Math.abs(mov)}`);
console.log(arrowMovementMap)
*/
//////FILTER
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposites = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposites);
const withdraws = movements.filter(mov => {
  return mov < 0;
});
console.log(withdraws);
//// challenge 2
const calcAvg = function (arr) {
  const humanAge = arr
    .map(age => (age > 2 ? 16 + age * 4 : age * 2))
    .filter(age => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  return humanAge;
  // const humanAges = arr.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  // const adults = humanAges.filter(age => age >= 18);
  // console.log(humanAges);
  // console.log(adults);
  // const avg = adults.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  // return avg;
};
console.log(calcAvg([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAvg([16, 6, 10, 5, 6, 1, 4]));
const r = Array.from({ length: 100 }, () => Math.floor(Math.random() * 6) + 1);
console.log(r);
labelBalance.addEventListener('click', function () {
  const movementsUi = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUi);
});
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
console.log(dogs);
dogs.forEach(dog => (dog.recomendedFood = Math.trunc(dog.weight ** 0.75 * 28)));
const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating ${
    sarahsDog.recomendedFood < sarahsDog.curFood ? 'Too much' : 'OK'
  }`
);
const excessFood = dogs
  .filter(dog => dog.curFood > dog.recomendedFood)
  .flatMap(dog => dog.owners);
const okFood = dogs
  .filter(dog => dog.curFood < dog.recomendedFood)
  .flatMap(dog => dog.owners);
console.log(excessFood);

console.log(dogs.some(dog => dog.curFood === dog.recomendedFood));
//current > (recommended * 0.90) && current < (recommended * 1.10)
const checkOk = dog =>
  dog.curFood > dog.recomendedFood * 0.9 &&
  dog.curFood < dog.recomendedFood * 1.1;
console.log(dogs.some(checkOk));
console.log(dogs.filter(checkOk));
const dogsCopy = dogs
  .slice()
  .sort((a, b) => a.recomendedFood - b.recomendedFood);
console.log(dogsCopy);

const bankDeposite = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDeposite);
// const numDeposites1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
const numDeposites1000 = accounts.reduce((acc, cur) => {
  cur.movements.forEach(mov => (mov >= 1000 ? ++acc : acc));
  return acc;
}, 0);
console.log(numDeposites1000);
// const ar = [1, 3, 2, 6, 1, 2];
// const p = ar.reduce((acc, cur, m, arr) => {
//   arr.forEach((el, i, b) => (m < i && (el + cur) % 5 === 0 ? ++acc : acc));
//   return acc;
// }, 0);
// console.log(p);
