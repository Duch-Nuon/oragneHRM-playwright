export interface Employee {
  firstName: string;
  middleName: string;
  lastName: string;
  emailCompany: string;
  emailPersonal: string;
}

export interface Admin {
  username: string;
  password: string;
}

export interface EssUser {
  username: string;
  password: string;
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
  emailCompany: `${generateRandomString(5).toLowerCase()}@company.com`,
  emailPersonal: `${generateRandomString(5).toLowerCase()}@personal.com`,
});

// Generate random admin
const generateRandomAdmin = (): Admin => ({
  username: generateRandomString(8),
  password: `${generateRandomString(10)}!1`,
});

// Generate random ess user
const generateRandomEssUser = (): EssUser => ({
  username: generateRandomString(8),
  password: `${generateRandomString(10)}!1`,
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

// Individual random admin (for single admin tests)
export const getRandomAdmin = (): Admin => generateRandomAdmin();

// Individual random ess user (for single ess user tests)
export const getRandomEssUser = (): EssUser => generateRandomEssUser();
