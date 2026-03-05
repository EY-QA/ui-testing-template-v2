# Add to Cart Feature Test Plan

## Application Overview

This test plan covers the shopping cart management feature. Authenticated users can add products to their cart from the inventory page or product detail page, view cart contents, remove items, and proceed through a multi-step checkout process. Tests verify cart functionality including item addition/removal, cart persistence, cart display accuracy, and the complete checkout workflow.

## Test Scenarios

### 1. Add to Cart - Happy Path

**Seed:** `seed.spec.ts`

#### 1.1. User can add single product to cart from inventory page

**File:** `specs/add-to-cart/add-single-product-inventory.spec.ts`

**Steps:**
  1. Navigate to the inventory page (user is already authenticated from seed)
    - expect: Inventory page displays products
    - expect: Cart badge is not visible or shows no items
    - expect: Add to cart button is visible for all products
  2. Click the 'Add to cart' button for the first product (e.g., Sauce Labs Backpack)
    - expect: Add to cart button changes to 'Remove' button
    - expect: Cart badge appears and displays '1'
    - expect: Product details remain unchanged
  3. Click the shopping cart link to view the cart
    - expect: The added product is visible in the cart
    - expect: Quantity shows '1'
    - expect: Product price is displayed correctly
    - expect: Remove button is available for the product
