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

- `201` -  User Created Successfully
- `400` -  User Already Exists
- `500` - Server Error

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

- `200` - Login successful, returns token
- `401` - Invalid credentials
- `500` - Internal Server Error

---

### DELETE `/auth/deleteAccount`

**Delete your account**  
⚠️ This API assumes that once the user is deleted, the token is also deleted from the cliend side code and the user is logged out, so the Auth token of the deleted user is not used again.

**Header:**

- Bearer: Token

**Responses:**

- `201` - User Deleted Successfully
- `500` - Server Error

---

## Blogs APIs

### POST `/blogs/createBlog`

**Create Blog Post**

**Header:**

- Bearer: Token

**Request Body:**

```json
{
  "title": "Whatever title you like",
  "des": "Description"
}
```

**Responses:**

- `201` - Post Created
- `500` - Server Error

### GET `/blogs/allBlogs`

**Get all blogs**

**Responses:**

- `200` - All Blogs
- `500` - Error Fetching Posts

### GET `/blogs?query`

**Get blogs by query**

**Query:**

- `username` - author of blog post
- `date` - date of blog post - YYYY-MM-DD formay **only**

**Responses:**

- `200` - All matching posts
- `400` - No query provided
- `500` - Error Fetching Posts

### PUT `/blogs/updateBlog/:id`

**Update Blog Post**

**Header:**

- Bearer: Token

**Parameters:**

- `id` - id of the post to be updated

**Request Body:**

```json
{
  "title": "New Title",
  "des": "New Description"
}
```

**Responses:**

- `201` - Post updated successfully
- `404` - Post does not exist
- `403` - Post does not belong to the author
- `500` - Error Updating Post

### DELETE `/blogs/deleteBlog/:id`

**Delete Blog Post**

**Header:**

- Bearer: Token

**Parameters:**

- `id` - id of the post to be updated

**Responses:**

- `200` - Post deleted successfully
- `404` - Post does not exist
- `403` - Post does not belong to the author
- `500` - Error Deleting Post
