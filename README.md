# Initial Structure

Standardized template for Node.js backend projects based on Clean Architecture.

## Directory structure

Based on [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

```
src/
│
├── application/                        # Application layer (business logic)
│   └── usecase/
│       └── <module>/
│           ├── get-<module>/           # Use case for GET APIs
│           │   ├── get-<module>.usecase.ts
│           │   ├── get-<module>.usecase.test.ts
│           │   └── get-<module>.usecase.fixture.ts
│           └── insert-<module>/        # Use case for INSERT APIs
│               ├── insert-<module>.usecase.ts
│               ├── insert-<module>.usecase.test.ts
│               └── insert-<module>.usecase.fixture.ts
│
├── domain/                             # Domain layer (entities, types)
│   └── entities/
│       └── <module>/
│           ├── <module>.interface.ts
│           ├── <module>-get.interface.ts
│           └── <module>-insert.interface.ts
│
├── infrastructure/                     # Infrastructure layer (database, configs)
│   └── orm/
│       └── repositories/
│           └── mysql-repositories/
│               └── <module>/
│                   ├── <module>.repo.ts
│                   ├── <module>-repo.interface.ts
│                   └── <module>.repo.test.ts
│   ├── configs/
│   │   └── constants/
│   │       ├── application-tag.ts
│   │       └── statusCodes.ts
│   └── helpers/
│       ├── res.ts                      # Response helper
│       ├── fm-ts.ts                    # Functional utilities
│       └── pagination.ts               # Pagination utilities
│
├── interface/                          # Interface layer (HTTP, validation)
│   ├── controller/
│   │   └── <module>/
│   │       ├── get-<module>/           # Controller for GET APIs
│   │       │   ├── get-<module>.controller.ts
│   │       │   ├── get-<module>.controller.test.ts
│   │       │   └── get-<module>.controller.fixture.ts
│   │       └── insert-<module>/        # Controller for INSERT APIs
│   │           ├── insert-<module>.controller.ts
│   │           ├── insert-<module>.controller.test.ts
│   │           └── insert-<module>.controller.fixture.ts
│   │
│   ├── router/
│   │   └── <module>.route.ts           # Routes for the module
│   │
│   └── validation/
│       └── <module>/                   # Validation schemas
│           ├── get-<module>.validation.ts
│           └── insert-<module>.validation.ts
│
└── script/                             # Automation scripts
    ├── api-schema.sh                   # Swagger schema generation
    ├── get-api-gen.sh                  # GET API generation
    └── insert-api-gen.sh               # INSERT API generation
```

## Project Setup

### 1. Install Dependencies

Install project dependencies using Yarn:

```bash
yarn
```

### 2. Environment Setup

- Create a `.env` file from `.env.example`.
- Add necessary database and application environment variables.

---

## Development Workflow

### 1. Starting the Application with Docker

You can run the project using Docker containers. Choose one of the following options:

```bash
# Start existing containers
yarn container:start

# Build containers before starting
yarn container:start --build

# Remove images, rebuild, and start
yarn container:start:rebuild
```

---

## How to Develop

### Steps to Create a New API Module

Follow these steps to generate a new API module:

#### **Step 1**: Define API in Swagger

1. Add your API definition in the Swagger YAML files located at `api-docs/`.
2. Define types for **request** and **response** as per your API.

Example Swagger Path:

```yaml
paths:
  /api/v1/<module>:
    get:
      summary: Get <module> data
      responses:
        '200':
          description: Successful response
```

---

#### **Step 2**: Generate Swagger Schema

Run the following script to generate API types from Swagger:

```bash
bash script/api-schema.sh
```

- The generated types will be located in `src/domain/swagger/`.

---

#### **Step 3**: Copy API Types to Entities

Copy the relevant API types to the **domain/entities** folder for your module:

```plaintext
src/domain/entities/<module>/<module>-get.interface.ts
src/domain/entities/<module>/<module>-insert.interface.ts
```

---

#### **Step 4**: Generate GET API

Run the script to generate the GET API boilerplate:

```bash
bash script/get-api-gen.sh <module-name>
```

**What this does**:

- Creates controller, use case, repository, validation, and entity files for the GET API.
- Implements:
  - Pagination
  - Filtering
  - Count queries

---

#### **Step 5**: Generate INSERT API

Run the script to generate the INSERT API boilerplate:

```bash
bash script/insert-api-gen.sh <module-name>
```

**What this does**:

- Creates controller, use case, repository, validation, and entity files for the INSERT API.
- Implements:
  - Primary key existence check.
  - Record insertion logic.

---

#### **Step 6**: Update Routes

Add the generated routes to the main router:

```typescript
import express from 'express';
import <module>Routes from '../router/<module>.route';

const router = express.Router();

router.use('/<module>', <module>Routes);

export default router;
```

---

## Testing

### Running Unit Tests

Run unit tests using Jest:

```bash
yarn test
```

The tests use an ephemeral Docker database that is provisioned and torn down automatically.

---

## Package Management

### Adding a Runtime Package

Install a package as a dependency:

```bash
yarn add --exact PACKAGE_NAME
```

### Adding a Development Package

Install a package as a dev dependency:

```bash
yarn add --dev --exact PACKAGE_NAME
```

---

## Summary

This project follows **Clean Architecture** principles with modular components. The automated scripts streamline API generation for consistency across modules. Use the workflow above to create GET and INSERT APIs efficiently.
