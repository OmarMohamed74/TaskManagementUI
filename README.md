# Task Management System (Full-Stack)

## Description
A full-stack Task Management application designed to streamline team operations and task assignments. Built with an **Angular** frontend and a **.NET 9 API** backend, it facilitates end-to-end task and team management, real-time live chat via SignalR, organized architectural design, and modern user-centric interfaces. 

## Features
- **Task Management**: Full CRUD capabilities to create, assign, and track task progression tracking status (To-Do, In-Progress, Done) while capturing detailed logs and statuses.
- **Team Management**: Organizes users into specific teams, enabling admins and team members to isolate functionality strictly to their scopes.
- **Real-Time Communication**: Implements a live floating chat and member communication tool using **SignalR**. Provides real-time event pushing, message previews, and instant updates without reloading.
- **User Authentication**: Secure JWT-based access for different roles (Admin vs Member).
- **Global Error Handling & Logging**: Fully structured backend error mapping and daily rotating JSON logs with Serilog for fast debugging.

## Tech Stack
### Backend
- **Framework**: .NET 9.0 (ASP.NET Core Web API)
- **Database**: SQLite (Development) using Entity Framework Core
- **Real-Time**: SignalR
- **Testing**: xUnit, Moq (mocking the data), FluentAssertions (the code to be readable)
- **Logging**: Serilog (Compact JSON Formatter)

### Frontend
- **Framework**: Angular ( V20 )
- **UI Library**: PrimeNG
- **Styling**: Bootstrap & SCSS 

## Project Architecture & Design Decisions
### Backend Architecture
The backend strictly adheres to multi-layered design principles (SRP) enforcing a clear boundary between presentation (API), business logic (Application), and data layers (Infrastrucutre):
- **Presentation (TaskManagement.API)**: Exposes secure REST endpoints, manages HTTP pipelines, Global Exception Handling, and SignalR Hub routing.
- **Application Flow (TaskManagement.Application)**: The business logic core. Implements services (`TaskService`, `TeamService`, `ChatService`) safely mapping data via internal DTO models keeping logic clean and fully encapsulated.
- **Data Access (TaskManagement.Infrastructure)**: Handles Entity Framework interactions, seeding strategies, and the repository pattern to manage `User`, `Task`, `Team`, and `ChatMessage` models.
- **Real-time Logic**: A centralized `ChatHub` collaborates intelligently with a `ChatService` to enable persistent message transmission, establishing lightweight WebSocket-based real-time state for connected clients.

### Frontend Architecture
Organized using modern feature-based routing and modular layouts. Separates operations logically by roles (Admin modules vs Member modules) and leverages real-time reactivity utilizing Angular Signals and RxJS to listen for SignalR events continuously across the framework.

## Getting Started

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (Version 20.X  or above recommended)
- Angular CLI (`npm i -g @angular/cli`)

### Installation & Running the App

#### 1. Backend API
Open a terminal in your workspace and run:
```bash
cd TaskManagementAPI
dotnet restore
cd TaskManagement.API
dotnet run
```
> The API will automatically create and seed the SQLite database (`taskmanagement.db`) on its first run.

#### 2. Frontend UI
Open a separate terminal and initialize the user interface:
```bash
cd TaskManagementUI
npm install
ng serve
```
> Navigate to `http://localhost:4200` to utilize the full web application.

## API Documentation
The API adheres strictly to generic REST practices. Detailed evaluation of available endpoints and requests can be navigated gracefully through OpenAPI/Swagger definitions.

When the backend API is running locally via `Development` configuration, open:
**`http://localhost:<PORT>/swagger/index.html`** or **`https://localhost:<PORT>/swagger/index.html`**

**Vital Endpoints context:**
- `POST /api/auth/login` - Exchange valid system credentials for your JWT.
- `GET /api/tasks` & `POST /api/tasks` - Unified routing for filtered tasks management workflows.
- `GET /api/teams` & `POST /api/teams`
- `GET /api/users` & `POST /api/users`
- `/hubs/chat` - The WebSocket pipeline configured to receive remote interactions natively formatted.

## Running Tests
We enforce rigorous Unit Testing focused around core business logic properties and Edge Case simulations using the **AAA Pattern** (Arrange, Act, Assert). Application Layer methods are isolated preventing cross-contamination of dependencies.

To execute tests on the backend locally:
```bash
cd TaskManagementAPI
dotnet test
```

## User Guide
### Creating a Task
1. Sign in safely and navigate to the overarching Task table.
2. Select the **Create Task** button to summon the centralized form input dialog.
3. Configure your Task Name, specify Dates, and bind a **Assignee** natively populating users within your accessibility.

### Assigning to a User
Based autonomously on your authorization scope (Admin vs Member), assigning rules filter out invalid members automatically.

### Opening the Chat Window
Use the **Floating Chat** toggle situated elegantly out-of-flow to initiate real-time instant messaging protocols. Selecting online or offline members.

---
**Authors:**
Omar Abdelraouf
