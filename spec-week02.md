# Books API Week 02 Specification

# Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 Books API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Custom ID, such as `b1` |
| `authorId` | String | Yes | References the custom ID of an existing author |
| `title` | String | Yes | Book title |
| `publicationDate` | String | Yes | Book publication date |

Books will continue to use custom string IDs instead of MongoDB `_id` values for API route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field.

The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400 Bad Request` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books

**Purpose:** Return all books.

**Success:**
- Status code: `200 OK`
- Response body: An array of book objects.

**Errors:**
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### GET /books/:id

**Purpose:** Return one book by its custom ID.

**Success:**
- Status code: `200 OK`
- Response body: The matching book object.

**Errors:**
- `404 Not Found` if no book exists with that ID.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### POST /books

**Purpose:** Create a new book.

**Request body:**

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

**Success:**
- Status code: `201 Created`
- Response body: The newly created book object.

**Errors:**
- `400 Bad Request` if a required field is missing.
- `400 Bad Request` if the book ID already exists.
- `400 Bad Request` if the author ID does not match an existing author.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### PUT /books/:id

**Purpose:** Update an existing book.

**Request body:**

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

**Success:**
- Status code: `200 OK`
- Response body: The updated book object.

**Errors:**
- `400 Bad Request` if a required field is missing.
- `400 Bad Request` if the author ID does not match an existing author.
- `404 Not Found` if no book exists with that ID.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### DELETE /books/:id

**Purpose:** Delete an existing book.

**Success:**
- Status code: `204 No Content`
- Response body: None.

**Errors:**
- `404 Not Found` if no book exists with that ID.
- `500 Internal Server Error` if an unexpected server or database error occurs.

### Swagger Documentation

Swagger must document every book route.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application.

The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Feature 2: Author CRUD Operations

### Goal

Create an Authors API that supports all CRUD operations for author records. The API must allow users to create, retrieve, update, and delete authors.

Every author route must be documented and testable in Swagger.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Custom ID, such as `a1` |
| `name` | String | Yes | Author's name |
| `birthYear` | Number | Yes | Author's year of birth |

Authors will use custom string IDs instead of MongoDB `_id` values for API route parameters.

### Routes

#### GET /authors

**Purpose:** Return all authors.

**Success:**
- Status code: `200 OK`
- Response body: An array of author objects.

**Errors:**
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### GET /authors/:id

**Purpose:** Return one author by their custom ID.

**Success:**
- Status code: `200 OK`
- Response body: The matching author object.

**Errors:**
- `404 Not Found` if no author exists with that ID.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### POST /authors

**Purpose:** Create a new author.

**Request body:**

```json
{
  "id": "a1",
  "name": "Chinua Achebe",
  "birthYear": 1930
}
```

**Success:**
- Status code: `201 Created`
- Response body: The newly created author object.

**Errors:**
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the author ID already exists.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### PUT /authors/:id

**Purpose:** Update an existing author.

**Request body:**

```json
{
  "name": "Chinua Achebe",
  "birthYear": 1931
}
```

**Success:**
- Status code: `200 OK`
- Response body: The updated author object.

**Errors:**
- `400 Bad Request` if a required field is missing or invalid.
- `404 Not Found` if no author exists with that ID.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### DELETE /authors/:id

**Purpose:** Delete an existing author.

**Success:**
- Status code: `204 No Content`
- Response body: None.

**Errors:**
- `404 Not Found` if no author exists with that ID.
- `409 Conflict` if the author still has books associated with them.
- `500 Internal Server Error` if an unexpected server or database error occurs.

### Relationship to Books

Each author may be associated with multiple books.

The `id` field of an author must match the `authorId` field stored in related book documents.

An author cannot be deleted while one or more books reference that author. The API must return `409 Conflict` in that situation.

### Swagger Documentation

Swagger must document every author route, including request bodies, successful responses, and possible error responses.

### Deployment Expectations

After implementation, all author routes must work locally and from the deployed Render application.

The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

# Version 2: Revised Specification

Version 2 incorporates improvements following an evaluation of the initial specification. It provides more precise data validation, request and response expectations, error handling, relationship protection, and implementation considerations.

## Feature 1: Book CRUD Operations and Author References

### Goal

Extend the existing Week 01 Books API to support complete CRUD operations and establish a relationship between books and authors.

All routes must validate incoming data, return consistent responses, and be documented and testable through Swagger.

### Data Model

Book documents will be stored in the MongoDB `books` collection.

Each book must contain:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique custom identifier, e.g. `b1` |
| `authorId` | String | Yes | Custom ID of an existing author |
| `title` | String | Yes | Book title |
| `publicationDate` | String | Yes | Valid date in `YYYY-MM-DD` format |

The custom `id` field will be used for API route parameters. MongoDB `_id` will remain an internal database identifier.

### Data Validation

The API must enforce the following validation rules:

1. All required fields must be present.
2. `id`, `authorId`, and `title` must be non-empty strings.
3. `publicationDate` must be a valid calendar date in `YYYY-MM-DD` format.
4. Duplicate book IDs must not be accepted.
5. The `authorId` must match an existing author's custom ID.
6. Unexpected properties must be rejected with a `400 Bad Request` response.
7. The book's custom ID cannot be changed through an update request.

### Relationship to Authors

Every book must reference an existing author through its `authorId` field.

Before creating or updating a book, the API must verify that the specified author exists in the `authors` collection.

If the author does not exist, the API must return `400 Bad Request` with a clear error message.

### Routes

#### GET /books

**Purpose:** Retrieve all books.

**Success:**
- Status code: `200 OK`
- Response body: An array of book objects.
- If there are no books, return an empty array: `[]`.

**Errors:**
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### GET /books/:id

**Purpose:** Retrieve one book using its custom ID.

**Success:**
- Status code: `200 OK`
- Response body: The matching book object.

**Errors:**
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### POST /books

**Purpose:** Create a new book.

**Request body:**

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

**Success:**
- Status code: `201 Created`
- Response body: The newly created book object.

**Errors:**
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the book ID already exists.
- `400 Bad Request` if the author ID does not match an existing author.
- `400 Bad Request` if unexpected properties are supplied.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### PUT /books/:id

**Purpose:** Replace the editable information of an existing book.

All editable fields must be supplied in the request body.

**Request body:**

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

**Success:**
- Status code: `200 OK`
- Response body: The updated book object.
- The book's custom ID must remain unchanged and must be taken from the URL parameter.

**Errors:**
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the specified author does not exist.
- `400 Bad Request` if unexpected properties are supplied.
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### DELETE /books/:id

**Purpose:** Delete an existing book using its custom ID.

**Success:**
- Status code: `204 No Content`
- Response body: None.

**Errors:**
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected server or database error occurs.

### Error Response Format

All error responses must use a consistent JSON structure.

**Example:**

```json
{
  "message": "A clear description of the error"
}
```

The API must not expose database credentials, internal database errors, stack traces, or other sensitive implementation details in client-facing error responses.

### Database Efficiency Considerations

To support efficient data retrieval and relationship checks:

1. The `id` field in the `books` collection should have a unique database index.
2. The `authorId` field in the `books` collection should have an index to improve searches for books belonging to a particular author.
3. Database queries should retrieve only the records required by the requested operation.

### Swagger Documentation

Swagger must document all five book routes.

Documentation must include:

- Route descriptions.
- Path parameters.
- Request body schemas where applicable.
- Required fields and their data types.
- Successful response codes and examples.
- Error response codes and examples.

Every book route must be testable through Swagger at `/api-docs`.

### Deployment Expectations

All book routes must work locally and on the deployed Render application.

The deployed Swagger documentation must correctly display the production server URL and allow users to test the available book operations.

---

## Feature 2: Author CRUD Operations

### Goal

Create a complete Authors API that supports creating, retrieving, updating, and deleting author records.

The API must validate incoming data, prevent duplicate author IDs, protect relationships with existing books, and provide complete Swagger documentation.

### Data Model

Author documents will be stored in the MongoDB `authors` collection.

Each author must contain:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique custom identifier, e.g. `a1` |
| `name` | String | Yes | Author's full name |
| `birthYear` | Number | Yes | Author's year of birth |

The custom `id` field will be used for API route parameters. MongoDB `_id` will remain an internal database identifier.

### Data Validation

The API must enforce the following validation rules:

1. All required fields must be supplied.
2. `id` must be a non-empty string.
3. `name` must be a non-empty string after trimming whitespace.
4. `birthYear` must be an integer.
5. `birthYear` must not be a future year.
6. Duplicate author IDs must not be accepted.
7. Unexpected properties must be rejected with a `400 Bad Request` response.
8. An author's custom ID cannot be changed through an update request.

### Routes

#### GET /authors

**Purpose:** Retrieve all authors.

**Success:**
- Status code: `200 OK`
- Response body: An array of author objects.
- If there are no authors, return an empty array: `[]`.

**Errors:**
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### GET /authors/:id

**Purpose:** Retrieve one author using their custom ID.

**Success:**
- Status code: `200 OK`
- Response body: The matching author object.

**Errors:**
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### POST /authors

**Purpose:** Create a new author.

**Request body:**

```json
{
  "id": "a1",
  "name": "Chinua Achebe",
  "birthYear": 1930
}
```

**Success:**
- Status code: `201 Created`
- Response body: The newly created author object.

**Errors:**
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the author ID already exists.
- `400 Bad Request` if unexpected properties are supplied.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### PUT /authors/:id

**Purpose:** Replace the editable information of an existing author.

All editable fields must be supplied in the request body.

**Request body:**

```json
{
  "name": "Chinua Achebe",
  "birthYear": 1931
}
```

**Success:**
- Status code: `200 OK`
- Response body: The updated author object.
- The author's custom ID must remain unchanged and must be taken from the URL parameter.

**Errors:**
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if unexpected properties are supplied.
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### DELETE /authors/:id

**Purpose:** Delete an existing author using their custom ID.

Before deleting an author, the API must check whether any book documents reference the author's ID through their `authorId` field.

**Success:**
- Status code: `204 No Content`
- Response body: None.

**Errors:**
- `404 Not Found` if the author does not exist.
- `409 Conflict` if one or more books reference the author.
- `500 Internal Server Error` if an unexpected server or database error occurs.

### Relationship to Books

An author may be associated with multiple books.

The `id` field in an author document must match the `authorId` field in related book documents.

The API must protect referential integrity:

1. A book cannot be created with an author ID that does not exist.
2. A book cannot be updated to reference a nonexistent author.
3. An author cannot be deleted while one or more books reference that author.
4. The API must return `409 Conflict` when deletion is blocked by existing book references.

### Database Efficiency Considerations

To support efficient author retrieval and relationship checks:

1. The `id` field in the `authors` collection should have a unique database index.
2. The `books.authorId` index specified in the Books feature should be used when checking whether an author has associated books.
3. Database queries should retrieve only the records required by the requested operation.

### Error Response Format

All error responses must use a consistent JSON structure.

**Example:**

```json
{
  "message": "A clear description of the error"
}
```

The API must not expose database credentials, internal database errors, stack traces, or other sensitive implementation details in client-facing error responses.

### Swagger Documentation

Swagger must document all five author routes.

Documentation must include:

- Route descriptions.
- Path parameters.
- Request body schemas where applicable.
- Required fields and their data types.
- Successful response codes and examples.
- Error response codes and examples.
- The relationship between authors and books.

Every author route must be testable through Swagger at `/api-docs`.

### Deployment Expectations

All author routes must work locally and on the deployed Render application.

The deployed Swagger documentation must correctly display the production server URL and allow users to test the available author operations.

---

# Specification Evaluation and Design Decisions

The following questions were used to evaluate the initial specification and guide the improvements made in Version 2.

### 1. Are there any bugs or short-sighted decisions in this specification?

The initial specification did not fully define validation rules for every field. Version 2 clarifies the required fields, date format, integer requirement for birth year, duplicate ID prevention, and the immutability of custom IDs during updates.

It also clarifies that a book must reference an existing author.

### 2. Are there any security considerations that are missing?

Version 2 requires the API to reject unexpected properties and avoid exposing database credentials, internal database errors, or stack traces in client-facing error responses.

Authentication and authorization are not included because they are outside the defined scope of this assignment.

### 3. Are there any efficiency concerns with the current endpoint design?

Version 2 includes database indexing considerations. Unique indexes on custom IDs help prevent duplicate records, while an index on `books.authorId` supports efficient checks for books associated with an author.

The API should also retrieve only the records required by each operation.

### 4. Are any response examples or error behaviors unclear?

Version 2 clarifies successful response codes, error response codes, empty collection responses, request body requirements, and the response returned when an author cannot be deleted because books still reference them.

A consistent JSON error structure is also defined.

### Final Design Decisions

The API will continue using custom string IDs for books and authors rather than exposing MongoDB `_id` values as route parameters.

Books will reference authors through `authorId`.

The API will prevent the creation of books with nonexistent authors and prevent deletion of authors who still have associated books.

All routes will be documented and tested through Swagger locally and after deployment to Render.

Version 2 will serve as the implementation specification for the Week 02 assignment.
