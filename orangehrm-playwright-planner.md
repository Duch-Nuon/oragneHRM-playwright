# OrangeHRM Playwright Testing Planner (TODO)

Target app: **OrangeHRM demo**  
URL: https://opensource-demo.orangehrmlive.com/  
Login: `Admin / admin123`

---

## Goal (keep it simple)

- ✅ Build a **Smoke suite** (fast, always runs)
- ✅ Build a **Regression suite** (bigger flows, run in CI/nightly)
- ✅ Learn **stable locators** + **non-flaky waits** on a real app

---

## 1) One-time setup

- [ ] Create project  
  - [ ] `pnpm create playwright` *(or npm/yarn equivalent)*
- [ ] Configure `baseURL`  
  - [ ] `https://opensource-demo.orangehrmlive.com`
- [ ] Turn on debugging artifacts  
  - [ ] `trace: 'on-first-retry'`  
  - [ ] screenshot on failure  
  - [ ] video on failure (optional)
- [ ] Add sensible retries (demo sites can be slow)  
  - [ ] `retries: 1` or `2`
- [ ] Store credentials in `.env` (don’t hardcode in tests)  
  - [ ] `ORANGEHRM_USER=Admin`  
  - [ ] `ORANGEHRM_PASS=admin123`

---

## 2) Recommended folder structure

- [ ] `tests/`
  - [ ] `smoke/` *(critical, fast)*
  - [ ] `regression/` *(full flows)*
- [ ] `pages/` *(Page Objects)*
  - [ ] `LoginPage`
  - [ ] `DashboardPage`
  - [ ] `PimPage` *(Employee list + add/edit)*
- [ ] `helpers/`
  - [ ] `auth.ts` *(login + save storageState)*
  - [ ] `data.ts` *(unique names/ids generator)*
- [ ] `storage/`
  - [ ] `auth.json` *(saved login session)*

---

## 3) Choose “flows” (what you will automate)

### A) Smoke flows (start here)

- [ ] **Login success** → Dashboard visible
- [ ] **Logout** → back to login screen
- [ ] **Main menu loads** (Admin / PIM / Leave visible)

### B) Regression flows (real complex)

- [ ] **PIM: Add Employee** (create new employee with unique name)
- [ ] **PIM: Search Employee** (find the one you created)
- [ ] **PIM: Edit Employee** (update a field, verify saved)
- [ ] **Admin: System Users Search/Filter** (filter by role/status, assert results change)
- [ ] **Leave: Apply Leave** *(only if stable; demos sometimes vary)*

> Tip: Avoid destructive actions (like delete) at first because demo data is shared.

---

## 4) Write in the safest order (important)

### Step 1 — Login foundation

- [ ] Create `LoginPage.login(username, password)`
- [ ] Add reliable assertions after login  
  - [ ] Dashboard element visible **or** URL contains `/dashboard`
- [ ] Save auth state once  
  - [ ] Login → `storageState({ path: 'storage/auth.json' })`
- [ ] Create a fixture that loads `storageState`  
  - [ ] Most tests run without logging in again

### Step 2 — Smoke suite (3 tests only)

- [ ] `tests/smoke/login.spec.ts`
- [ ] `tests/smoke/navigation.spec.ts`
- [ ] `tests/smoke/logout.spec.ts`

### Step 3 — First real CRUD (PIM Add Employee)

- [ ] Add employee with unique name (timestamp/random suffix)
- [ ] After save, assert success signal  
  - [ ] toast/notification **or** profile header shows correct name
- [ ] Capture a stable identifier for later  
  - [ ] employee id **or** unique full name

### Step 4 — Search + Edit (real QA feeling)

- [ ] Go to Employee List
- [ ] Search by your unique name/id
- [ ] Assert results are correct  
  - [ ] exactly 1 row **or** table contains your employee
- [ ] Open employee → edit a small field → save → verify persisted

---

## 5) Stability rules (to avoid flaky tests)

### Locators

- [ ] Prefer:
  - [ ] `getByRole(...)`
  - [ ] `getByLabel(...)`
  - [ ] `getByPlaceholder(...)`
  - [ ] `getByText(...)` *(carefully; use exact when possible)*
- [ ] Avoid:
  - [ ] `.nth()` for critical actions (breaks easily)
  - [ ] long XPath unless there’s no alternative

### Waiting strategy

- [ ] Always assert visibility before clicking/typing  
  - [ ] `await expect(locator).toBeVisible()`
- [ ] Wait for outcomes, not time  
  - [ ] URL change after login  
  - [ ] table update after search (assert row changes)
- [ ] Use `expect.poll` or UI-state checks if data loads slowly

---

## 6) Data strategy (so tests don’t collide)

- [ ] Use a unique prefix for created records  
  - [ ] Example: `PW_YYYYMMDD_HHMM_<rand>`
- [ ] Don’t depend on existing demo records (they can change)
- [ ] Keep created data minimal (only fields required)
- [ ] If you must delete later  
  - [ ] delete only the record you created (search by your unique prefix)

---

## 7) Reporting + CI (portfolio-ready)

- [ ] Enable HTML report
- [ ] Add scripts
  - [ ] `test:smoke` (only smoke folder)
  - [ ] `test:regression` (all tests)
- [ ] Add GitHub Actions workflow  
  - [ ] run smoke on every push/PR  
  - [ ] upload report artifacts (trace + screenshots)

---

## 8) First week checklist (recommended pace)

- **Day 1**
  - [ ] setup + login + storageState
  - [ ] 3 smoke tests
- **Day 2**
  - [ ] PIM add employee
  - [ ] PIM search employee
- **Day 3**
  - [ ] PIM edit employee
  - [ ] improve locators + reduce flakiness
- **Day 4**
  - [ ] Admin user search/filter test
- **Day 5**
  - [ ] CI + clean README + report screenshots

---

## Suggested “Done” definition

You’re in good shape when:

- [ ] Smoke suite runs in **< 2 minutes**
- [ ] Tests pass **2 runs in a row** without flakes
- [ ] Reports/trace artifacts help debug failures quickly
- [ ] README explains how to run smoke vs regression
