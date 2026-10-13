![Bellwether Academy school office overview](./screenshot.png)

# Bellwether Academy | School Office

A frontend-only school information system demo for managing student records, daily attendance, classroom details, and term fee accounts. The interface uses seeded sample data and React state; it has no connected backend or payment service.

- **Live demo:** [https://a2rp.github.io/school-information-system/](https://a2rp.github.io/school-information-system/)
- **Source code:** [https://github.com/a2rp/school-information-system](https://github.com/a2rp/school-information-system)

## Pages and workflows

### Overview

- See enrollment, today's attendance, unfinished roll calls, and fee totals derived from the current sample records.
- Choose a class to review its morning register.
- Open attendance, fee records, student records, or class setup from the overview.
- Add a student from the page or the header.

### Student directory

- Search by student name, student ID, guardian, or email.
- Filter by class and sort by name or enrollment date.
- Add a student with a required class and validated family contact information, then edit, view, or remove the record.
- Class capacity is checked before saving. Removing a student requires a custom confirmation and removes that student's attendance marks and sample fee row too.

### Attendance register

- Choose a class and date, search within the roster, and record Present, Late, Absent, or Excused.
- Select an active status again to clear it. The totals update immediately.
- Mark all currently shown students present in one action.
- Attendance for a selected date stays consistent while navigating between pages during the current visit.

### Classes and timetable

- Create and edit grades, sections, teachers, rooms, seat capacity, and subjects.
- Review current class lists, seat availability, and a sample weekday schedule.
- A class with enrolled students cannot be removed. Empty class removal uses a custom confirmation dialog.

### Fee ledger

- Review billed, collected, and outstanding sample balances by student and term.
- Search accounts, filter by class and payment state, and download the visible records as CSV.
- Record full or partial sample payments up to the remaining balance. This updates the page's sample data only; it does not charge a family or contact a payment provider.

All visible forms validate their inputs and show inline errors. Successful actions use toast notifications, and destructive actions use custom confirmation dialogs. Navigation is responsive, scrolls to the top on route changes, and hides while scrolling down then reappears on scroll up. The interface keeps all visible text at 13px or larger.

## Data and demo limits

The app uses realistic sample records held in React state. Student edits, class changes, attendance marks, and sample payments stay in sync between pages for the current browser visit. Refreshing the page restores the original sample data. Nothing is saved to `localStorage`, `sessionStorage`, or a backend. Email and phone links open the visitor's configured mail or calling app; no message is sent by this demo.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check the code and production build:

```sh
npm run lint
npm run build
```

## Deployment

The public repository is [a2rp/school-information-system](https://github.com/a2rp/school-information-system). GitHub Pages is published from the `gh-pages` branch with the package script; no GitHub Actions workflow is used.

```sh
npm run deploy
```

The script builds the app, copies `dist/index.html` to `dist/404.html` for GitHub Pages route fallback, and publishes `dist`. The deployed app is [https://a2rp.github.io/school-information-system/](https://a2rp.github.io/school-information-system/).

## Screenshots

These screenshots were captured from the local production build using the app's real sample data.

### Pages

| Page | Screenshot |
| --- | --- |
| Overview and classroom register | ![School overview and morning register](./screenshots/pages/overview.png) |
| Student directory | ![Searchable student directory](./screenshots/pages/students.png) |
| Daily attendance register | ![Class attendance with status controls](./screenshots/pages/attendance.png) |
| Classes and timetable | ![Classroom cards, class list, and learning schedule](./screenshots/pages/classes.png) |
| Fee ledger | ![Student account balances and fee filters](./screenshots/pages/fees.png) |

### Forms and dialogs

| Dialog state | Screenshot |
| --- | --- |
| Create student | ![Create student form](./screenshots/modals/student-create.png) |
| Student form validation | ![Student form with required field errors](./screenshots/modals/student-create-validation.png) |
| Edit student | ![Edit student form](./screenshots/modals/student-edit.png) |
| Student details | ![Student contact and enrollment details](./screenshots/modals/student-details.png) |
| Remove student confirmation | ![Custom confirmation before removing a student](./screenshots/modals/student-remove-confirmation.png) |
| Create class | ![Create classroom form](./screenshots/modals/class-create.png) |
| Edit class | ![Edit classroom form](./screenshots/modals/class-edit.png) |
| Class form validation | ![Class capacity validation message](./screenshots/modals/class-edit-validation.png) |
| Remove class confirmation | ![Custom confirmation before removing an empty class](./screenshots/modals/class-remove-confirmation.png) |
| Record sample payment | ![Sample payment form](./screenshots/modals/payment-record.png) |
| Payment validation | ![Fee payment amount validation](./screenshots/modals/payment-validation.png) |

## Future improvements

These items are not implemented in this frontend demo:

- Connect records to a backend so authorized school staff can share updates across devices and accounts.
- Add role-based access for administrators, teachers, and finance staff, with server-side audit history.
- Integrate a payment provider and store verifiable receipts instead of recording sample payments in browser state.
- Add a family portal for announcements, attendance notices, report cards, and secure document access.
- Connect a real school calendar and provide server-backed backups and retention controls for student records.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
