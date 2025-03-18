function validationEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

function validationPhoneNumber(phone_number) {
  const phonePattern = /^[0-9]{10,13}$/;
  return phonePattern.test(phone_number);
}

function validationPassword(password) {
  const passwordPattern = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  // const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return passwordPattern.test(password);
}

export {
  validationEmail,
  validationPhoneNumber,
  validationPassword
}