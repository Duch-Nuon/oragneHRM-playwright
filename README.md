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
pnpm exec playwright test e2e/smoke

# Debug mode (step-by-step)
pnpm exec playwright test --debug

# See browser
pnpm exec playwright test --headed

# View report
pnpm exec playwright show-report
```

## Project Structure

```
e2e/
├── auth.setup.ts              # Login & save session
└── smoke/
    ├── addEmployee.spec.ts    # Add/search employee
    └── logout.spec.ts         # Logout & dashboard

pages/
└── LoginPage.ts               # Page Object for login

helpers/
└── data.ts                    # Random employee generator

storage/
└── auth.json                  # Session storage (git-ignored)
```

## Tests Included

- **Dashboard** - Loads after login
- **Logout** - Returns to login page
- **Add Employee** - Create 3 random employees
- **Search Employee** - Find by ID

## Tips

- Tests run in parallel (faster)
- Session saved after login (no repeat logins)
- Random names prevent conflicts when running in parallel
- Use `--headed` to debug
- Use `--debug` for interactive debugging
- Use `-g "pattern"` to run specific tests

## Playwright Options

```bash
pnpm exec playwright test e2e/smoke                  # Specific folder
pnpm exec playwright test -g "add employee"         # Match pattern
pnpm exec playwright test --workers=1               # Sequential
pnpm exec playwright test --project=chromium        # One browser
pnpm exec playwright test --headed --slow-mo=1000   # Slow motion
```

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

**Need debug info:**
```bash
DEBUG=pw:api pnpm test
```

See [Playwright docs](https://playwright.dev) for more.
