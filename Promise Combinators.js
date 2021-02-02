const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then((response, reject) => {
    if (!response.ok) reject(new Error(errorMsg + response.status));
    return response.json();
  });
};

///COMBINATORS take aray of promises and acts accordingly
//Promise.all
//any
//race
//allSettled

//promise.race => first settled promise (reject or response , doesnt matter) wins the race

(async function () {
  const data = await Promise.race([
    getJSON(`https://restcountries.eu/rest/v2/name/italy`),
    getJSON(`https://restcountries.eu/rest/v2/name/belgium`),
    getJSON(`https://restcountries.eu/rest/v2/name/germany`),
  ]);
  console.log(
    'async call 1- promise.race => first settled promise (reject or response , doesnt matter) wins the race. Promice race result of 3 promises, winner response is: ' +
      data[0].name
  );
})();

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(() => reject('request took too long'), sec * 1000);
  });
};

// add timeOut promise so that in that time if you cannot consume any others timeout will consume a reject and timeout promise will win the race.

Promise.race([
  getJSON(`https://restcountries.eu/rest/v2/name/tanzania`),
  timeout(0.001),
])
  .then(res =>
    console.log(
      'async call 2- race againist 1 ms timeout promise: ' + res[0].name
    )
  )
  .catch(err =>
    console.error(
      'async call 2 (promise.race => first settled promise (reject or response , doesnt matter) wins the race)- race againist 1 ms timeout promise: ' +
        err
    )
  );

Promise.race([
  getJSON(`https://restcountries.eu/rest/v2/name/tanzania`),
  timeout(1),
])
  .then(res =>
    console.log(
      'async call 3- race againist 1sec timeout promise, we got response earlier: ' +
        res[0].name
    )
  )
  .catch(err => console.error(err));

///Promise.allSettled return all responses (Promise.all shortcircuits when one promise rejects)

Promise.allSettled([
  Promise.resolve('S'),
  Promise.resolve('S'),
  Promise.resolve('S'),
  Promise.reject('F'),
  Promise.resolve('S'),
]).then(r =>
  console.log(
    'async call 4- Promise.allSettled: ' +
      r.reduce((acc, cur, index) => acc + index + ': ' + cur.status + ' ', ''),
    r
  )
);

//Promise.any returns first fullfilled promise. Race between response of fullfilled promises
Promise.any([
  Promise.reject('1th Fail'),
  Promise.reject('2nd Fail'),
  Promise.reject('3rd Fail'),
  Promise.reject('4th Fail'),
  Promise.resolve('5th Success'),
])
  .then(r =>
    console.log(
      'async call 5- Promise.any returns first fullfilled promise: ' + r
    )
  )
  .catch(e => console.log(e));

Promise.any([
  Promise.reject('1th Fail'),
  Promise.reject('2nd Fail'),
  Promise.reject('3rd Fail'),
  Promise.reject('4th Fail'),
  Promise.reject('5th Fail'),
])
  .then(r =>
    console.log(
      'async call 6- Promise.any returns first fullfilled promise: ' + r
    )
  )
  .catch(e =>
    console.log(
      'async call 6- Promise.any, if all promises rejected then error: ' +
        e.message
    )
  );

Promise.any([
  Promise.reject('1th Fail'),
  Promise.resolve('2nd Success'),
  Promise.reject('3rd Fail'),
  Promise.resolve('4th Success'),
  Promise.reject('5th Fail'),
])
  .then(r =>
    console.log(
      'async call 7- Promise.any returns first fullfilled promise: ' + r
    )
  )
  .catch(e => console.log(e));

//Promise.all if one reject occurs returns that reject, you should catch it
Promise.all([
  Promise.resolve('S'),
  Promise.resolve('S'),
  Promise.resolve('S'),
  Promise.resolve('S'),
])
  .then(r =>
    console.log('async call 8- Promise.all returns all fullfilled promises.', r)
  )
  .catch(e => console.log(e));

Promise.all([
  Promise.resolve('S'),
  Promise.resolve('S'),
  Promise.resolve('S'),
  Promise.reject('Failed'),
  Promise.resolve('S'),
])
  .then(r => console.log(r))
  .catch(e =>
    console.log(
      'async call 9- Promise.all returns all promises. if there is rejected ones then returns first reject : ' +
        e
    )
  );
