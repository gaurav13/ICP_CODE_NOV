
export function decimalToFraction(decimal:number) {
  if (Number.isInteger(decimal)) {
      return `${decimal}:1`; // Return integer as numerator and 1 as denominator
  }

  const gcd = (a:number, b:number):number => (b ? gcd(b, a % b) : a);
  const [integerPart, fractionalPart = ''] = decimal.toString().split('.');
  const numerator = parseInt(integerPart) * Math.pow(10, fractionalPart.length) + parseInt(fractionalPart);
  const denominator = Math.pow(10, fractionalPart.length);
  const divisor = gcd(numerator, denominator);
  let imgWidth=numerator / divisor;
  let imgHeigth=denominator / divisor;

  return `${imgWidth.toString().length>4?imgWidth.toString().slice(0,3):imgWidth}:${imgHeigth.toString().length>4?imgHeigth.toString().slice(0,3):imgHeigth}`;
}