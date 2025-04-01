# namesake

## 0.22.0

### Minor Changes

- 2607812: Map form responses to PDFs
- 9497bf5: Pre-fill form values when existing responses exist for a user

### Patch Changes

- 9914faa: Fix duplicate focus rings

## 0.21.0

### Minor Changes

- 8c9e04c: Update form page design and validate form responses
- 376da9c: Show the quest completion date in the footer
- 011570b: Upgrade to Tailwind v4
- 2be3a05: Save and encrypt all form submissions
- 980fba1: Allow deleting user data from within settings
- 2cdb562: Add spoiler component for hiding and showing text such as old names

### Patch Changes

- 615ce5e: Display form response values in a Select element instead of a text input
- 9921164: Fix React console errors about invalid props
- dc38141: Fix theme switcher submenu
- f18cb1b: Reorder Social Security before State ID
- ac248e0: Add animation to tab indicator

## 0.20.0

### Minor Changes

- 76e55f5: Add navigation controls for form questions
- cdcf7d5: Set up migrations for future database updates
- 3f68a59: Shows the date quests were last updated
- 0882e88: Add end-to-end encryption of user form data
- f329558: Add pasword strength meter and enforce minimum password strength for new registrations

### Patch Changes

- 0d77597: Fix error borders for invalid fields
- 297b320: Patch esbuild security advisory
- eed5d89: Fixes layout issues with long questions
- a73cf1f: Fix a bug where a focus ring would display on non-editable rich text fields

## 0.19.3

### Patch Changes

- 4fafdc2: Fix broken images in quest headers
- b00d80a: Patch Vitest vulnerability

## 0.19.2

### Patch Changes

- ca58bb2: Reconfigure app layout for mobile support

## 0.19.1

### Patch Changes

- ecb4f87: Fix deploy workflow and PostHog env variables

## 0.19.0

### Minor Changes

- c11f544: Track web vitals and performance analytics with PostHog

### Patch Changes

- 6b25e40: Support selecting a birthplace outside the US

## 0.18.0

### Minor Changes

- 0e9f77a: Enable early access codes for beta testing
- 6a2bc7b: Refine design for quest documents and references
- 7e28449: Allow editing user settings inline instead of opening a dialog window
- fb4f688: Support adding, editing, and deleting frequently asked questions for each quest

### Patch Changes

- fb82f83: Improve loading state of quests with skeleton loader component

## 0.17.0

### Minor Changes

- e50f02a: Display structured steps for all quests and improve admin editing experience
- 56a570c: Display statuses for all core quests
- 24464bb: Display core quests by default and redirect user to appropriate state documentation

### Patch Changes

- d07a946: Truncate long usernames and emails within settings and the sidebar

## 0.16.0

### Minor Changes

- 189df29: Improve design of browse page and allow previewing quests before addition
- e4a7813: fix: Show error when signing in with unregistered email
- d362596: Allow editing all quest details directly from quest page
- 5133df0: Migrate from SurveyJS to a custom implementation for forms

### Patch Changes

- 1bccc82: Refine password strength transitions

## 0.15.0

### Minor Changes

- 6e76b6f: Added email display in account settings page.
- cf18a88: Add links to terms of service and privacy policy

### Patch Changes

- 3192f7e: Ensure that accessible titles are available for all dialogs
- 2dcace8: Ensure automatic tests run when upgrading packages

## 0.14.0

### Minor Changes

- bdc6e19: Add end-to-end form creation and form filling with SurveyJS

### Patch Changes

- 872064c: Default the user role to admin during signup when the environment is set to development.
- f0e6afe: Upgrade to React 19
