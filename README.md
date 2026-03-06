# Employee & Family Registry System

Full-Stack .NET Technical Assessment  
Fionetix Solutions

---

# Project Overview

This project is a _Full-Stack Employee Management System_ built for the Bangladesh context.

The system manages:

- Employee profiles
- Family relationships (Spouse and Children)
- Global search
- PDF reporting
- Role-based access (Admin / Viewer)

The application is built using a _React frontend_ and _ASP.NET Core Web API backend_ with _PostgreSQL database_.

---

# Technology Stack

## Backend

- ASP.NET Core Web API (.NET)
- Entity Framework Core
- PostgreSQL
- QuestPDF (PDF generation)

## Frontend

- React (Vite)
- Tailwind CSS
- Axios

---

# Core Features

## Employee Management

Employees can be created, updated, deleted, and viewed.

Employee fields:

- Name
- NID (10 or 17 digits)
- Phone (Bangladesh format)
- Department
- Basic Salary

---

## Family Relationships

Each employee may have:

### Spouse

- Name
- NID
- Only _one spouse per employee_

### Children

- Name
- Date of Birth
- One employee may have _multiple children_

---

## Global Search

The application contains a _single search input_ that filters employees by:

- Name
- NID
- Department

Features:

- Case-insensitive search
- Debounced search (400ms) to reduce API calls

---

## PDF Export

The system supports two PDF export options.

### Employee Table Export

Exports the _currently filtered employee list_ as a PDF table.

### Employee CV Export

Exports a _single employee CV PDF_ including:

- Employee information
- Spouse information
- Children information

---

## Role System

Two roles exist in the system.

### Admin

Admin users can:

- Create employees
- Update employees
- Delete employees
- Manage spouse and children

### Viewer

Viewer users can:

- View employees
- Search employees
- Export PDFs

Viewer mode is _read-only_.

---

# Database Design

The system contains three main entities.

## Employee

Fields:

- Id
- Name
- NID
- Phone
- Department
- BasicSalary

Relationships:

- One-to-One with Spouse
- One-to-Many with Children

---

## Spouse

Fields:

- Id
- Name
- NID
- EmployeeId (Foreign Key)

Relationship:

- Each employee can have _only one spouse_

---

## Child

Fields:

- Id
- Name
- DateOfBirth
- EmployeeId (Foreign Key)

Relationship:

- One employee can have _multiple children_

---

# Project Structure

```text
employee-family-registry
│
├── backend (ASP.NET Core API)
│   ├── Controllers
│   ├── Data
│   ├── Entities
│   ├── Services
│
├── frontend (React UI)
│   ├── components
│   ├── pages
│   ├── services
│
├── SRS_Document.md
└── README.md
```

---

# Database Setup (PostgreSQL)

Install PostgreSQL locally.

Create a database:

employee_registry

Update the connection string in:

appsettings.json

Example:

"ConnectionStrings": {
"DefaultConnection": "Host=localhost;Database=employee_registry;Username=postgres;Password=yourpassword"
}

---

# Run Migrations

Inside the backend project folder run:

dotnet ef database update

This command will create the database tables.

---

# Seed Data

The application automatically seeds the database with _10 initial employees_ on the first run.

Example seeded employees include Bangladeshi names such as:

- Tanvir Hasan
- Rahim Uddin
- Karim Ahmed
- Sadia Akter
- Moushumi Khan
- Arif Rahman
- Nusrat Jahan
- Hasan Mahmud
- Shakil Ahmed
- Farhana Islam

---

# Running the Backend

Navigate to the backend project folder and run:

dotnet run

The backend API will run at:

https://localhost:5026

Swagger API documentation:

https://localhost:5026/swagger

---

# Running the Frontend

Navigate to the frontend project folder.

Install dependencies:

npm install

Start the development server:

npm run dev

The frontend will run at:

http://localhost:5173

---

# API Endpoints

## Employee Endpoints

GET /api/Employee  
POST /api/Employee  
PUT /api/Employee/{id}  
DELETE /api/Employee/{id}

---

## Search Endpoint

GET /api/Employee/search?query=

Search filters employees by:

- Name
- NID
- Department

The search is _case-insensitive_ and _debounced (400ms)_.

---

## Family Endpoints

Add spouse:

POST /api/Employee/{id}/spouse

Add child:

POST /api/Employee/{id}/children

---

## PDF Export

Export filtered employee list:

GET /api/Employee/export/pdf

Export employee CV:

GET /api/Employee/{id}/export/cv

---

# Validation Rules

The system implements several validation rules:

- Employee NID must be unique
- Spouse NID must also be unique
- NID must be 10 or 17 digits
- Phone must follow Bangladesh format (start with +880 or 01)
- Only one spouse is allowed per employee
- Child requires both name and date of birth
- Salary defaults to 0 if not provided

---

# Documentation

The repository also includes an SRS document describing the system design.

File name:

SRS_Document.md

Contents include:

- System Scope
- Entity Relationship Diagram (ERD)
- Edge Cases
- Assumptions

---

# Author

Technical Assessment Submission

Candidate: _Sajidur Rahman SAjid_

For:

Fionetix Solutions
