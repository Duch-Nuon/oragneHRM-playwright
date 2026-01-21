export interface Employee {
  firstName: string;
  middleName: string;
  lastName: string;
}

// Generate random string
const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate random employee
const generateRandomEmployee = (): Employee => ({
  firstName: generateRandomString(6).charAt(0).toUpperCase() + generateRandomString(5).toLowerCase(),
  middleName: generateRandomString(6).charAt(0).toUpperCase() + generateRandomString(5).toLowerCase(),
  lastName: generateRandomString(7).charAt(0).toUpperCase() + generateRandomString(6).toLowerCase(),
});

// Generate 3 random employees
export const getRandomEmployees = (): Employee[] => {
  return [
    generateRandomEmployee(),
    generateRandomEmployee(),
    generateRandomEmployee(),
  ];
};

// Individual random employees (for single employee tests)
export const getRandomEmployee = (): Employee => generateRandomEmployee();
