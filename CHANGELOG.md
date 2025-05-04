# namesake

## 0.27.1

### Patch Changes

- f225cbb: Fix alignment of disclosures and keep disclosues closed by default when viewing quests

## 0.27.0

### Minor Changes

- 7fe61d0: Integrate quest questions directly into the content instead of separating section
- 5703bde: Display optional costs within cost breakdown
- 9f6d86d: Support displaying frequently asked questions as details elements within the content of a quest

### Patch Changes

- 5703bde: Fix cost and time tooltips not displaying on mobile devices

## 0.26.3

### Patch Changes

- 24a1539: Update guidance for listing reason to change name, update other content

## 0.26.2

### Patch Changes

- d7bb027: Fix display of form titles and include jurisdiction badge alongside name

## 0.26.1

### Patch Changes

- ec1d042: Include Motion to Impound in final court order PDF when required, provide guidance for filling out fields

## 0.26.0

### Minor Changes

- d30cbca: Download required PDFs after form completion
- d30cbca: See all your documents and download PDFs in one place

## 0.25.3

### Patch Changes

- dd10168: Improve repository organization and enforce field name type checking
- fb4c533: Improve error boundary handling and prevent the entire app from crashing if one component fails

## 0.25.2

### Patch Changes

- fd59698: Fix signin and signout redirects

## 0.25.1

### Patch Changes

- e8edd2f: Fix visual bugs with nav headers, quest steps, and other small things

## 0.25.0

### Minor Changes

- bbad47c: Improve navigation within forms
- dffdf23: Improve display of key information within quest header and simplify editing experience for key quest details

## 0.24.2

### Patch Changes

- 34b6519: Add save changes button to editor

## 0.24.1

### Patch Changes

- 1a788d8: Fix quest editor interactions

## 0.24.0

### Minor Changes

- 8c16c07: Improve rich text editor with new features for steps, buttons, and other types of content

### Patch Changes

- 69636db: Fix console warning about Posthog loading more than once
- 2a78b32: Add support for selecting a county of residence
- 9d4c63c: Fix autofill form field styles
- a6824e3: Add loading indicators to buttons during form submission

## 0.23.0

### Minor Changes

- d0ddd4e: Make app mobile-responsive

### Patch Changes

- 7d89099: Fix popover handling

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
