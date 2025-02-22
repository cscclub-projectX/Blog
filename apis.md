### **📌 Appwrite Database Schema for Your Blog MVP**  

In **Appwrite**, we need to create **three collections**:  
1. **Users** → Stores user details.  
2. **Posts** → Stores blog articles.  
3. **Comments** (Optional for later) → Stores comments on posts.  

---

## **1️⃣ Users Collection (`users`)**  
**Purpose:** Stores user profile details.  

| **Field**        | **Type**       | **Required** | **Description** |
|-----------------|---------------|-------------|----------------|
| `id`            | String (Auto)  | ✅ Yes       | Unique user ID (Appwrite’s default). |
| `name`          | String         | ✅ Yes       | Full name of the user. |
| `username`      | String         | ✅ Yes       | Unique username (for profile URL). |
| `email`         | Email          | ✅ Yes       | User’s email (unique). |
| `bio`           | String         | ❌ No       | Short user bio. |
| `profileImage`  | File (Appwrite Storage) | ❌ No | Profile picture URL. |
| `createdAt`     | Date (Auto)    | ✅ Yes       | User registration date. |

---

## **2️⃣ Posts Collection (`posts`)**  
**Purpose:** Stores blog posts.  

| **Field**      | **Type**         | **Required** | **Description** |
|--------------|----------------|-------------|----------------|
| `id`        | String (Auto)   | ✅ Yes       | Unique post ID (Appwrite auto-generates). |
| `title`     | String          | ✅ Yes       | Blog post title. |
| `content`   | Rich Text (Markdown) | ✅ Yes       | Blog post content. |
| `coverImage` | File (Appwrite Storage) | ❌ No | Featured image for the post. |
| `authorId`  | String (Relation → Users) | ✅ Yes       | Links post to its author. |
| `tags`      | Array of Strings | ❌ No       | List of post tags/categories. |
| `views`     | Integer         | ✅ Yes (default 0) | Tracks post views. |
| `likes`     | Integer         | ✅ Yes (default 0) | Tracks likes. |
| `status`    | Enum (`draft` / `published`) | ✅ Yes | Post status (draft or published). |
| `createdAt` | Date (Auto)      | ✅ Yes       | Date of creation. |

---

## **3️⃣ Comments Collection (`comments`)** (Optional)  
**Purpose:** Stores user comments on blog posts.  

| **Field**    | **Type**         | **Required** | **Description** |
|------------|----------------|-------------|----------------|
| `id`      | String (Auto)   | ✅ Yes       | Unique comment ID. |
| `postId`  | String (Relation → Posts) | ✅ Yes       | Links comment to a post. |
| `authorId` | String (Relation → Users) | ✅ Yes       | Links comment to user. |
| `content` | String          | ✅ Yes       | Comment text. |
| `createdAt` | Date (Auto)    | ✅ Yes       | Timestamp of comment. |

---

## **📌 Additional Configurations**
### **Permissions:**
- **Users**: Can update their profile but not delete it.  
- **Posts**:  
  - Only the **author** can edit or delete their post.  
  - Everyone can read published posts.  
- **Comments**:  
  - Users can add/delete their own comments.  
  - Admins can delete any comment.  

---

## **📌 Summary**
✅ `users` → Stores user details.  
✅ `posts` → Stores blog articles.  
✅ `comments` → (Optional) Stores comments on posts.  

---

🚀 **Would you like me to generate Appwrite JSON import files for easy setup?** 😊