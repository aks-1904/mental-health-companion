export const printError = async (str: any) => {
  if (process.env.NODE_ENV === "development") {
    console.log(str);
  }
};
