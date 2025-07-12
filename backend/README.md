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

- `201` - User Created Successfully
- `400` - User Already Exists
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

---

### GET `/blogs/allBlogs`

**Get all blogs**

**Responses:**

- `200` - All Blogs
- `500` - Error Fetching Posts

---

### GET `/blogs?query`

**Get blogs by query**

**Query:**

- `username` - author of blog post
- `date` - date of blog post - YYYY-MM-DD formay **only**

**Responses:**

- `200` - All matching posts
- `400` - No query provided
- `500` - Error Fetching Posts

---

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

---

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

---

## Friend Request API

### POST `/fr/:username`

**Send Friend Request to another username**

**Header:**

- Bearer: Token

**Parameters:**

- `username` - usernae of friend request receiver user

**Responses:**

- `201` - Request Sent

```json
{
  message: "Request Sent" ,
  request: {
    id: <request_id>,
    sender: sender_name,
    receiver: receiver_name
  }
}
```

- `403` - Sender and Receiver are same
- `403` - Friend Request already exists
- `500` - Error Updating Post

---

### PUT `/fr/`

**Accept or Reject Friend Request**

**Header:**

- Bearer: Token

**Query:**

| query        | value            | function                         |
| ------------ | ---------------- | -------------------------------- |
| `action`     | `accept`         | accept friend request            |
|              | `reject`         | reject friend request            |
| `request_id` | positive integer | request id of the friend request |

**Responses:**

- `200` - Request Updated
- `400` - Invalid Request ID
- `403` - Request not meant for user
- `400` - Request already taken care of (request no longer pending)
- `500` - Error Updating Post

---

### GET `/fr/allRequests`

**Update Blog Post**

**Header:**

- Bearer: Token

**Query:**

| query    | value      | function                             | <id / username> in response |
| -------- | ---------- | ------------------------------------ | --------------------------- |
| `action` | `sent`     | friend requests sent by the user     | receiver                    |
|          | `received` | friend requests received by the user | sender                      |

**Responses:**

- `200`

```json
[
  {
    "user_id": <user_id of (sender / request_receiver>,
    "username": <username of sender / request_receiver>
  }
]
```

- `400` - No query received
- `500` - Server Error

---

### GET `/fr/`

**Get all friends list**

**Header:**

- Bearer: Token

**Responses:**

- `200`

```json
[
  {
    "user_id": <user_id of friend>,
    "username": <username of friend>
  }
]
```

- `500` - Server Error

---