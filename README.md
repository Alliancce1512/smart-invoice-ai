# 🧾 SmartInvoice AI

SmartInvoice AI is an AI-powered invoice processing platform that enables companies to streamline invoice submissions, reviews, and approvals.

**Live App**: [invoice-ai.presiyangeorgiev.eu](https://invoice-ai.presiyangeorgiev.eu)

---

## 🚀 Features

- ✅ **AI Invoice Extraction** — Automatically extracts relevant fields (vendor, amount, IBAN, date, etc.) from PDF invoices using OCR and LLM.
- 🧠 **Intelligent Categorization** — Classifies invoices into predefined categories like "Cloud Services", "Travel", "Legal & Accounting", etc.
- 🔒 **JWT Authentication** — Role-based login (Employee / Reviewer / Approver) using secure JSON Web Tokens.
- 🧑‍💼 **Role Management** — Access and actions are restricted based on user roles:
  - **Employee** – Upload invoices
  - **Reviewer** – Review and forward invoices for approval
  - **Approver** – Final approval/rejection
- ✍️ **Edit Invoice Data** — Users can manually review/edit extracted data before submission.
- 💬 **Comments** — Reviewers and approvers can leave comments during their stages.
- 📊 **Dashboard** — Role-specific tabs (My Requests, Review Invoices, Approve Invoices, Approved Requests).
- 📤 **Multi-Step Invoice Flow** — Invoice goes through `For Review → For Approval → Approved / Declined`
- 📱 **Responsive UI** — Clean and responsive design optimized for both desktop and mobile.

---

## 👤 Demo Accounts

Use the following accounts to explore the platform:

| Role              |  Username  |  Password  |
|-------------------|------------|------------|
| Standard Employee | `user`     | `admin123` |
| Reviewer          | `reviewer` | `admin123` |
| Approver          | `approver` | `admin123` |
| Admin             | `admin`    | `admin123` |

Note: The `admin` account has access to all the platform features (Upload, Review, Approve, etc).

---

## 🛠 Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | [TypeScript](https://www.typescriptlang.org/), [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| Backend    | [n8n](https://n8n.io/) — No-code backend logic with PostgreSQL integration |
| AI Agent   | [Lovable.dev](https://lovable.dev/) — LLM prompt-based frontend logic |
| Database   | [PostgreSQL](https://www.postgresql.org/) |
| Hosting    | VPS on Ubuntu 22.04 via Contabo |
| CI/CD      | GitHub Actions (automatic build & deploy on push) |
| Auth       | JWT-based authentication, role-based access |
| OCR        | PDF text extraction using n8n + PyPDF |
| Domain     | [`invoice-ai.presiyangeorgiev.eu`](https://invoice-ai.presiyangeorgiev.eu) |

---

## 🧠 Future Plans

- Add file storage for original invoices
- Add search/filtering for tables
- Notifications for status updates
- Multi-language support for the platform
- Explore embedding-based retrieval techniques to support future document search and classification features.
- Integrate an AI-powered chatbot that can assist users with:
  - Explaining invoice statuses and actions
  - Guiding new users through the platform
  - Answering questions related to invoice categories, approval flows, and user roles
  - Providing basic statistics (e.g. number of approved invoices this month, top vendors, average invoice amount)

---

## 🧑‍💻 Author

Made by [Presiyan Georgiev](https://www.linkedin.com/in/presiyan-georgiev/)
