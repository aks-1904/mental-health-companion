// Regex Validator functions to check data
export const validateEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const validateName = (name: string) => {
  const regex = /^[a-zA-Z\s-']+$/;
  return regex.test(name);
};
