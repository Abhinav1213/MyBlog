# MyBlog

## Authentication APIs

### POST `/auth/signUp`
**Register a new user**

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123",
  "username": "johndoe"
}
```

**Responses:**
- `201 User Created` – Registration successful
- `400 User Already Exists` – Registration failed
- `500 Server Error`

---

### POST `/auth/login`
**Login as an existing user**

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Responses:**
- `200 OK` - Login successful, returns token
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error`

---


### DELETE `/auth/deleteAccount`
**Delete your account**  
⚠️ This API assumes that once the user is deleted, the token is also deleted from the cliend side code and the user is logged out, so the Auth token of the deleted user is not used again.

**Header**
- Bearer: Token

**Responses:**
- `201 User Deleted Successfully`
- `501 Server Error`

---

