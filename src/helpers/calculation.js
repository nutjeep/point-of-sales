function calculateDiscount(price, discount){
  let finalPrice = 0;

  const discountFactor = 1 - (discount / 100);
  finalPrice = price * discountFactor;

  return finalPrice;
}

export {
  calculateDiscount
}