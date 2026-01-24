const NODE_ENV = process.env.NODE_ENV;

export const printError = (error: any) => {
  if (NODE_ENV === "production") {
    return;
  }
  console.log(error.message || error);
};
