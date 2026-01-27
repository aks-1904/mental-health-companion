import bcyrpt from "bcryptjs";

// Hashes given text using bcyrpt
export const hashText = async (text: string) => {
  const hashedString = await bcyrpt.hash(text, 10);
  return hashedString;
};

// Checks if the hashed string and given string are same
export const compareHashedString = async (
  text: string,
  hashedString: string
) => {
  return bcyrpt.compare(text, hashedString);
};

// Generate future date according to the time given and given date
export const generateDate = (date: Date, minutes: number) => {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};
