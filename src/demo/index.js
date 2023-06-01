let obj = {
  name: 'karl',
  age: 26,
  sex: 'boy',
};

function update(params) {
  let temp = params;
  temp.name = 'karl Li';
}

update(obj);

console.log('obj', obj);
