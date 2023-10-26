# The-Howling-Infinite.com
The-Howling-Infinite.com is a recent project I was commissioned to create by a retired clinical psychologist with 30+ years of experience. Since retiring in 2020, my client has been creating a screenplay about Lee Harvey Oswald, his underlying psychology, his childhood, and the experiences that led up to him assassinating JFK. The name is a reference to a quote from *Moby Dick*.

I handled the project from start to finish, doing everything from wireframing, API/backend development, frontend development, styling, testing, domain and DNS management, hosting, and deploying.

# Project Constraints

 The client: 
  - is a retiree with limited technical know-how, and is only comfortable using Microsoft Word for text editing.
 - wants to be able to edit the paper after it is posted.
 - wants the ability to insert images into his Word documents and have them appear in the correct place on the web version of the essay.
 - wants to be able to publish some shorter essays, but does not yet have any written.
 - is interested in writing blog posts to the niche audience that is interested in his work.
 - is eager to receive feedback from readers in the form of comments. However, due to the association between the topic and conspiracy theorists, he wanted to be able to moderate comments before they are visible to the public.
 - wants to protect his work from unauthorized use.

# Features 
-   **Secure Author Login**: Enables the author to securely log in to make changes or approve comments.
- **Email Verification and Password Reset**: All users must verify their email before logging in, and may reset their passwords at any time.
-   **Dynamic Essay Updates**: Allows the author to update essays by simply uploading a Word-exported HTML and the associated image folder, preserving the structure and inline images.
- **Basic Content Protection**: CSS's user-select feature is used to prevent unsophisticated users copying the written material, and S3 files are accessed via dynamically generated pre-signed URLs. Inline images have their `src` attribute changed to an API endpoint, which redirects the request to a freshly generated pre-signed URL. 
-   **Comments and Moderation**: Users can submit comments, but they are only displayed after being moderated by the author.
- **Blog Posts**: The author can create new blog posts with moveable and resizable inline images.

# Stack

 - The backend API is built with JavaScript, Express.js, and Node.js.
 - The database is MongoDB, running on their Atlas cloud DB service, with Mongoose ODM for schemas. 
 - The file storage for the articles and images is an AWS S3 bucket. 
 - The front end is in React, largely using MaterialUI.
 - Styling is split between CSS and the MUI `sx` prop.
 - The API is hosted on a Heroku basic dyno, and the domain is on SquareSpace.

# Key Packages

 - `bcrypt`, `jsonwebtoken`, and `express-validator` are used for security and login purposes.
 - `postmark` is used to send email verification and password reset emails.
 
 - `cheerio` and `downsize` are used to manipulate and extract elements from the uploaded HTML.
 
 - `html-react-parser` allows the uploaded HTML to be displayed as a React component.

 - `multer`, `multer-s3`,  and `quill-image-uploader` are used to handle the uploading of multipart/form-data  and inline images. 
 - `react-quill` and `quill-image-resize-module-react` are used to create a rich text editor for the blog posts. This feature may be replaced, if the client finds it unwieldy. 
