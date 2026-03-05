# Menu Navigation Test Plan

## Application Overview

# Menu Navigation Test Plan

## Kratak opis feature-a
Testiranje funkcionalnosti menu button-a na inventory stranici Swag Labs aplikacije, koji omogućava pristup navigacionim opcijama kao što su All Items, About, Logout i Reset App State.

## Pretpostavke
- Korisnik je ulogovan na inventory stranicu (https://www.saucedemo.com/inventory.html).
- Menu button je vidljiv u header-u stranice.
- Test podaci: Nisu potrebni specifični podaci.
- Konfiguracija: Koristi se Playwright sa Chromium browserom.

## Pozitivne scenarije (happy path)
1. Otvaranje menija klikom na menu button - menu se prikazuje sa navigacionim linkovima.
2. Zatvaranje menija klikom na close button - menu se sakriva.
3. Navigacija na All Items - vraća na inventory stranicu.
4. Navigacija na About - otvara novu karticu sa Sauce Labs sajtom.
5. Logout - vraća na login stranicu.
6. Reset App State - resetuje stanje aplikacije (npr. prazni korpu).

## Negativne scenarije
Nema negativnih scenarija jer menu button je uvek dostupan nakon logina, a funkcionalnost ne zavisi od korisničkog unosa.

## Edge case-ovi
- Klik na menu button kada je menu već otvoren - menu ostaje otvoren ili se ponaša konzistentno (nema duplog otvaranja).
- Navigacija kroz menu stavke bez zatvaranja menija - menu se zatvara automatski nakon klika na link.

## Predloge za @smoke i @regression tagove
- @smoke: Otvaranje i zatvaranje menija (osnovna funkcionalnost).
- @regression: Svi scenariji navigacije i resetovanja.

## Mapiranje Gherkin koraka na Page Object odgovornosti
- "I click on the menu button" -> menu-navigation.page.js: clickMenuButton()
- "I click on the close menu button" -> menu-navigation.page.js: clickCloseMenuButton()
- "I click on All Items link" -> menu-navigation.page.js: clickAllItemsLink()
- "I click on About link" -> menu-navigation.page.js: clickAboutLink()
- "I click on Logout link" -> menu-navigation.page.js: clickLogoutLink()
- "I click on Reset App State link" -> menu-navigation.page.js: clickResetAppStateLink()
- "Menu sidebar should be visible" -> menu-navigation.page.js: isMenuVisible()
- "Menu should display [options]" -> menu-navigation.page.js: verifyMenuContent()
- "Page should remain on inventory" -> menu-navigation.page.js: verifyOnInventoryPage()
- "New tab should open to Sauce Labs" -> menu-navigation.page.js: verifyAboutPageOpened()
- "Page should redirect to login" -> menu-navigation.page.js: verifyOnLoginPage()
- "App state should be reset" -> menu-navigation.page.js: verifyAppStateReset()

## Napomene o stabilnim lokatorima
- Preferirati `getByRole('button', { name: 'Open Menu' })` za menu button.
- Za close button: `getByRole('button', { name: 'Close Menu' })`.
- Za linkove u meniju: `getByRole('link', { name: 'All Items' })`, itd.
- Izbegavati CSS selektore kao `.menu-button` ili XPath; koristiti aria-label ili data-testid ako dostupni (u ovom slučaju, role i name su stabilni).

## Test Scenarios

### 1. Menu Navigation Suite

**Seed:** `seed.spec.ts`

#### 1.1. Open Menu

**File:** `tests/menu-navigation/open-menu.spec.ts`

**Steps:**
  1. Click on the menu button
    - expect: Menu sidebar should be visible with navigation options
  2. Verify menu content
    - expect: Menu should display All Items, About, Logout, and Reset App State links

#### 1.2. Close Menu

**File:** `tests/menu-navigation/close-menu.spec.ts`

**Steps:**
  1. Click on the menu button to open menu
    - expect: Menu sidebar should be visible
  2. Click on the close menu button
    - expect: Menu sidebar should be hidden

#### 1.3. Navigate to All Items

**File:** `tests/menu-navigation/navigate-all-items.spec.ts`

**Steps:**
  1. Click on the menu button to open menu
    - expect: Menu sidebar should be visible
  2. Click on All Items link
    - expect: Page should remain on inventory with products displayed

#### 1.4. Navigate to About

**File:** `tests/menu-navigation/navigate-about.spec.ts`

**Steps:**
  1. Click on the menu button to open menu
    - expect: Menu sidebar should be visible
  2. Click on About link
    - expect: New tab or window should open to Sauce Labs website

#### 1.5. Logout

**File:** `tests/menu-navigation/logout.spec.ts`

**Steps:**
  1. Click on the menu button to open menu
    - expect: Menu sidebar should be visible
  2. Click on Logout link
    - expect: Page should redirect to login page

#### 1.6. Reset App State

**File:** `tests/menu-navigation/reset-app-state.spec.ts`

**Steps:**
  1. Click on the menu button to open menu
    - expect: Menu sidebar should be visible
  2. Click on Reset App State link
    - expect: App state should be reset, cart emptied if applicable
