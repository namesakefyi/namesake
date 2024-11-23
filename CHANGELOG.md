# namesake

## 0.11.0

### Minor Changes

- f2a5bc2: Display statuses in main navigation, improve nav display
- fa35737: Display estimated costs for each quest
- 824da1c: Redesign app layout for optimal line length and taller scroll area
- 03cc1ec: Display time required to complete a quest

### Patch Changes

- ccc1aee: Adjust responsive padding and margins
- e0d7266: Use Lucide icons

## 0.10.0

### Minor Changes

- ba1c5a9: Add additional statuses for tracking core quests and improve status selection for quests
- 061a174: Update sidebar with disclosure sections and section counts
- 9a7282a: Support grouping quests by category, status, and date added
- 8cfffcf: Display readability score alongside quest content editor

### Patch Changes

- 301c273: Fix bug that would prevent the quests sidebar from rendering if the same group by method was selected and the localStorage result set to undefined

## 0.9.0

### Minor Changes

- 7c317df: Support adding URLs to quests, combine questSteps into single markdown field

### Patch Changes

- 7c317df: Fix redirecting after sign in and sign out

## 0.8.0

### Minor Changes

- 20b2fc6: Add /browse route for browsing quests

### Patch Changes

- 106b38d: Display confirmation toasts on success actions throughout the app
- a50b65d: Add quest categories
- 8ff044b: Skip top-level redirects in main nav
- e77c33b: Improve login screen tab switching

## 0.7.0

### Minor Changes

- 6078c8a: Improve sidebar design
- b8f60bc: Update sidebar nav and add quest sorting
- d2eac45: Support hiding and showing completed quests

### Patch Changes

- 6078c8a: Fix user quest sorting
- 103e0d9: Display tooltip on reset password button

## 0.6.0

### Minor Changes

- 28d720f: Add quest completion meter

### Patch Changes

- f35921f: Update signin page design

## 0.5.0

### Minor Changes

- 39e80bc: Replace magic link signin with password form

## 0.4.0

### Minor Changes

- e93f7cc: Display icons for quests and improve quest step appearance
- 20f5f39: Support deleting fields, allow adding fields directly from quest steps, constrain width of app
- dc09f49: Support defining quest fields and displaying user data
- 64475c3: Display form fields within quest steps

### Patch Changes

- b57e265: Make header sticky, add backend support for defining fields within a quest

## 0.3.3

### Patch Changes

- 82b2055: Add banner component, display banners for login error and success messages
- 4f1b0b9: Improve auth redirect logic
- 82b2055: Fix login screen sizing and padding

## 0.3.2

### Patch Changes

- 53d4407: Consolidate icon libraries
- 53d4407: Fix broken component styles

## 0.3.1

### Patch Changes

- 6071539: Display support, system status, and home links on signin
- 6071539: Display closed signup notice while in beta

## 0.3.0

### Minor Changes

- 0c3a56e: Add quest detail routes, add the ability to mark quests complete/incomplete, and support adding new quests from the global quest list

### Patch Changes

- 32edce3: Fix secondary button text styles
- 375b2ad: Update sign-in screen design, display Namesake logo

## 0.2.1

### Patch Changes

- f22c6d8: Fix query error when checking for current user role

## 0.2.0

### Minor Changes

- 4acd9bd: Add user roles

### Patch Changes

- 0673382: Add support link to user dropdown menu and settings page

## 0.1.1

### Patch Changes

- 20f0624: Send login emails from no-reply@namesake.fyi
- 99aef0d: Add link to system status from settings page

## 0.1.0

### Minor Changes

- 6e3e40a: Allow users to toggle between system, light, and dark themes
- 6dbc67d: Add rich text editing of quest steps

### Patch Changes

- 01725ac: Display version number on the settings page
- e819e8a: Improve display of empty states
- c751fe2: Display "Page not found" message for 404 pages
- ab65749: Fix web manifest console error

## 0.0.1

### Patch Changes

- b1bc99c: Resolve query errors on /quests route for unauthenticated users
- d03457b: Fix tsc build errors
