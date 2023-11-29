export default function getTotalDays(date1: number, date2: number) {
  return +((date1 - date2) / (1000 * 60 * 60 * 24)).toFixed();
}
