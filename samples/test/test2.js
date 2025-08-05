var x = 10;
console.log(x);

const main_iteration = () => {
  //sciter.main_iteration();
};

const run = () => {
  //main_iteration();
  setTimeout(run, 1);
};

run();
