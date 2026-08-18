# Security Specification

## Data Invariants
1. Users can only read and write their own profile data, except admins who can read/write all. Users cannot escalate their own role to "admin".
2. Products and Categories can be read by anyone, but only created, updated, or deleted by admins.
3. Orders can be created by authenticated users. Users can only read their own orders. Admins can read and update all orders. Orders cannot be deleted, only their status can be updated.
4. Reviews can be created by authenticated users. Anyone can read approved reviews, admins can read all reviews. Users can only delete their own reviews. Admins can update review status (Approve/Pending) and delete any review.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: User A tries to create an order where `userId` is User B's ID.
2. **Role Escalation**: User A tries to update their own profile to set `role: "admin"`.
3. **Ghost Fields**: User A tries to create a product with an extra field `isVerified: true`.
4. **Denial of Wallet**: User A tries to submit a review with a 1MB comment string.
5. **Unauthorized Product Edit**: User A tries to change the price of a product.
6. **State Shortcutting**: User A tries to create an order directly with `status: "Delivered"`.
7. **Cross-User Order Access**: User A tries to fetch an order belonging to User B.
8. **Orphaned Write**: User A tries to submit a review for a non-existent productId.
9. **Missing Required Fields**: User A tries to create an order without `paymentMethod`.
10. **Admin Bypass**: User A tries to approve their own review by updating `status: "Approved"`.
11. **Type Mismatch**: User A tries to set product `price` to a string instead of a number.
12. **PII Blanket Read**: Anonymous user tries to list all users to scrape emails.
