import numeral from "numeral";

// Register a custom INR format
numeral.register("locale", "inr", {
  delimiters: {
    thousands: ",",
    decimal: ".",
  },
  abbreviations: {
    thousand: "k",
    million: "m",
    billion: "b",
    trillion: "t",
  },
  ordinal: function (number) {
    return number === 1
      ? "st"
      : number === 2
      ? "nd"
      : number === 3
      ? "rd"
      : "th";
  },
  currency: {
    symbol: "₹",
  },
});

// Switch to the custom INR locale
numeral.locale("inr");
// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  const format = numeral(number).format("$0,0.00");
  return format.replace("$", "₹");
}

export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format("0.0%") : "";

  return result(format, ".00");
}

export function fShortenNumber(number) {
  const format = number ? numeral(number).format("0.00a") : "";

  return result(format, ".00");
}

export function fData(number) {
  const format = number ? numeral(number).format("0.0 b") : "";

  return result(format, ".0");
}

function result(format, key = ".00") {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, "") : format;
}

export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): number {
  if (
    originalPrice <= 0 ||
    discountPercentage < 0 ||
    discountPercentage > 100
  ) {
    throw new Error(
      "Invalid input. Price must be positive and discount percentage must be between 0 and 100."
    );
  }

  const discountAmount = Math.round((originalPrice * discountPercentage) / 100);
  const discountedPrice = originalPrice - discountAmount;

  return discountedPrice; // Round to 2 decimal places
}
