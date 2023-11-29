export default function generateArrayOfYears() {
  var max = 2050;
  var min = max - new Date().getFullYear();
  var years = [];

  for (var i = min; i >= 0; i--) {
    years.push(max - i);
  }
  return years;
}
