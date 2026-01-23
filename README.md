# OrangeHRM Playwright Tests

Automated tests for OrangeHRM (https://opensource-demo.orangehrmlive.com/) using Playwright & TypeScript.

## Setup

### Install
```bash
pnpm install
pnpm exec playwright install
```

### Configure
```bash
cp .env.example .env
```

Edit `.env`:
```
ORANGEHRM_USER=Admin
ORANGEHRM_PASS=admin123
BASE_URL=https://opensource-demo.orangehrmlive.com
```

## Running Tests

```bash
# Run all tests
pnpm test

# Smoke tests only
pnpm test:smoke

# Debug mode (step-by-step)
pnpm test:debug

# See browser
pnpm test:headed

# View report
pnpm report
```

## Project Structure

```
e2e/
├── auth.setup.ts              # Login & save session
└── smoke/
    ├── addAdmin.spec.ts       # Add Admin and ESS users
    ├── addEmployee.spec.ts    # Add/search employee
    ├── editEmployee.spec.ts   # Edit employee
    └── logout.spec.ts         # Logout & dashboard
└── otp/
    └── forgetPassword.spec.ts # Forget Password

pages/
└── LoginPage.ts               # Page Object for login

helpers/
└── data.ts                    # Random employee generator

storage/
└── auth.json                  # Session storage (git-ignored)
```

## Tests Included

- **Login and Logout**: Authenticates a user and logs them out.
- **Add Admin and ESS users**: Creates new users with Admin and ESS roles.
- **Add and Search Employee**: Adds new employees and searches for them by ID.
- **Edit Employee**: Edits personal and contact details of an employee.
- **Forget Password**: Resets the password for a user.

## Scripts

- `pnpm test`: Run all tests.
- `pnpm test:smoke`: Run smoke tests only.
- `pnpm test:debug`: Run tests in debug mode.
- `pnpm test:headed`: Run tests with browser visible.
- `pnpm report`: View test report.
- `pnpm exec playwright test --project=chromium`: Run tests in Chromium.
- `pnpm exec playwright test --project=otp`: Run OTP tests.
## Tips

- Tests run in parallel (faster)
- Session saved after login (no repeat logins)
- Random names prevent conflicts when running in parallel
- Use `--headed` to debug
- Use `--debug` for interactive debugging
- Use `-g "pattern"` to run specific tests

## Troubleshooting

**Browser not found:**
```bash
pnpm exec playwright install
```

**Can't reach site:**
- Check `.env` BASE_URL
- Check internet connection

**Auth failed:**
```bash
rm -rf storage/auth.json
pnpm exec playwright test e2e/auth.setup.ts
```
See [Playwright docs](https://playwright.dev) for more.
