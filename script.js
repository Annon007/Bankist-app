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

const displayMovement = function (movement) {
  containerMovements.innerHTML = '';
  movement.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// const totalBalance = function (accs) {
//   accs.forEach(acc => {
//     acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
//   });
// };
const totalBalance = function (mov) {
  const balance = mov.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${balance}€`;
};
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
  labelSumIn.textContent = `${deposte}€`;
  labelSumOut.textContent = `${Math.abs(withdraw)}€`;
  labelSumInterest.textContent = `${interest}€`;
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
    displayMovement(currentAcc.movements);
    totalBalance(currentAcc.movements);
    calcDisplaySummary(currentAcc.movements, currentAcc);
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
  }
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
