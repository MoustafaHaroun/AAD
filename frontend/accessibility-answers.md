# Information needed for accessibility

**Do you use `accessibilityLabel`, `accessibilityRole`, `accessibilityState`, or `accessibilityHint` in your components already?**
Partially. `accessibilityLabel`/`accessibilityRole` are used across 13 files. `accessibilityState` is used once (bottom-nav active tab). `accessibilityHint` is not used anywhere yet.

**Do icon-only controls have labels?**
- Bottom-navigation icons: Yes.
- Notification bell: Yes.
- Favourite button: Yes (both the listing grid card and the listing detail page).
- Edit/delete controls: Yes.
- Image gallery controls: Yes (thumbnails, add/remove photo, fullscreen close).
- Close/back buttons: Yes.

**Does `FormField` show a visible label and an error message?**
Yes — a `Label` above the field when one is given, and error text below it when validation fails.

**Does the delete-listing dialog require explicit confirmation?**
Yes — an `AlertDialog` with separate Cancel/Delete actions; nothing deletes on a single tap.

**Do you have any fixed heights on text containers that could clip larger font sizes?**
Yes, found three: the listing title wrapper on grid cards (`h-10` around a 2-line title), the description textarea on the create/edit-listing form (fixed `height: 191`), and the search-input wrappers on Home/Listings/Chats (`h-6`).

**Will you verify colour contrast before submission?**
Not yet done — will check before submission.

**Does `offline-banner.tsx` expose an accessible label or `accessibilityLiveRegion` equivalent?**
Yes — the banner now has `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, and an `accessibilityLabel`; its decorative icon is hidden from the accessibility tree.

**Are you using English only, Dutch only, or both through the i18n module?**
Both — `react-i18next` with `en.json` and `nl.json` locale files.
