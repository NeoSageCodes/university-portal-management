# School Department & Course API

A REST API for a university portal that manages Departments and Courses. It demonstrates two-way referencing in MongoDB using Mongoose:

- **hasMany:** a Department has many Courses.
- **belongsTo:** each Course belongs to one Department.

You can fetch a department with all its courses, or a course with its parent department details.

## Author

**NeoSageCodes**
GitHub: [https://github.com/NeoSageCodes](https://github.com/NeoSageCodes)

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- Joi (request validation)
- dotenv

## Project Structure

```
.
├── controllers/
│   ├── course.js
│   └── department.js
├── database/
│   └── database.js
├── middleware/
│   └── validation.js
├── models/
│   ├── course.js
│   └── department.js
├── routes/
│   ├── course.js
│   └── department.js
├── .env
├── .gitignore
└── app.js
```

## Getting Started

### 1. Clone and install

```bash
git clone <your-repository-url>
cd <your-project-folder>
npm install
```

### 2. Create a `.env` file

```
PORT=2000
MONGODB_URI=your_mongodb_connection_string
```

### 3. Run the server

```bash
node app.js
```

The server runs on `http://localhost:2000` unless `PORT` is set.

## Data Models

### Department

| Field     | Type             | Notes                                   |
|-----------|------------------|-----------------------------------------|
| `name`    | String           | Required. Stored in lowercase.          |
| `faculty` | String           | Required.                               |
| `courses` | [ObjectId]       | References `Courses`. Filled automatically when courses are created. |

### Course

| Field          | Type     | Notes                              |
|----------------|----------|------------------------------------|
| `courseCode`   | String   | Required, unique.                  |
| `title`        | String   | Required.                          |
| `creditUnits`  | Number   | Required.                          |
| `department`   | ObjectId | References `Departments`.          |

## API Endpoints

### Departments

| Method | Endpoint            | Description                                          |
|--------|---------------------|------------------------------------------------------|
| POST   | `/departments`      | Create a department (validated).                     |
| GET    | `/departments`      | Get all departments with their courses populated.    |
| GET    | `/departments/:id`  | Get one department with its courses populated.       |
| PATCH  | `/departments/:id`  | Update a department's `name` and/or `faculty`.       |
| DELETE | `/departments/:id`  | Delete a department that has no courses.             |

### Courses

| Method | Endpoint         | Description                                             |
|--------|------------------|---------------------------------------------------------|
| POST   | `/courses`       | Create a course linked to a department (validated).     |
| GET    | `/courses`       | Get all courses with their department populated.        |
| GET    | `/courses/:id`   | Get one course with its department populated.            |
| PATCH  | `/courses/:id`   | Update a course. Can also move it to another department. |
| DELETE | `/courses/:id`   | Delete a course and remove it from its department.      |

## Request Examples

### Create a department

`POST /departments`

```json
{
  "name": "Computer Science",
  "faculty": "Faculty of Science"
}
```

### Create a course

`POST /courses`

```json
{
  "courseCode": "CSC 201",
  "title": "Intro to Databases",
  "creditUnits": 3,
  "department": "Computer Science"
}
```

The `department` field takes the **name** of an existing department. The API looks the department up by name, saves its `_id` on the course, and adds the course's `_id` to the department's `courses` array. Both sides of the relationship are updated together.

## Validation

Both `POST` requests are validated with Joi before the database is touched. A failed validation returns `400 Bad Request` with a clear message.

Example: `POST /courses` with `"creditUnits": "abc"`

```json
{
  "message": "Credit units must be a number."
}
```

| Field         | Rules                                      |
|---------------|--------------------------------------------|
| `name`        | Required text.                             |
| `faculty`     | Required text.                             |
| `courseCode`  | Required text.                             |
| `title`       | Required text.                             |
| `creditUnits` | Required whole number greater than zero.   |
| `department`  | Required text (the department's name).     |

Fields that are not part of the schema are rejected.

## Behaviour Notes

- Department names are stored in lowercase, and duplicate names are rejected.
- Course codes must be unique.
- A department's `courses` array cannot be edited directly. It changes only when courses are created, moved, or deleted, so both sides of the relationship never go out of sync.
- A department that still has courses cannot be deleted. Delete or move its courses first.
- Moving a course (`PATCH /courses/:id` with a new `department` name) adds the course to the new department and removes it from the old one.

## Status Codes

| Code | Meaning                                              |
|------|------------------------------------------------------|
| 200  | Success                                              |
| 201  | Resource created                                     |
| 400  | Validation failed, or the name or course code is already in use |
| 404  | Department or course not found                       |
| 500  | Server error                                         |
