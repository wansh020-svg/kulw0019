# Devlog – Tutorial 08: MVC with Express and Mongoose

## Task 1 – Project setup
Created `tutorials/t08` with `express`, `mongoose`, and `dotenv`, plus `nodemon` as a dev dependency. Added a `.env` holding `MONGO_URI` (pointing at the `tutorial_08` database) and a `.gitignore` excluding `.env` and `node_modules`. Set `"type": "module"` and the `start`/`dev` scripts in `package.json`, and created the `controllers`, `models`, and `routes` folders that the rest of the tutorial builds into. Wrote `requests.http` up front so every route could be tested the moment it existed.

## Task 2 – Model and first controller functions
Built `models/User.js` with a schema requiring `name` and `email` (email unique, lowercased and trimmed) and `timestamps: true`. In `controllers/userController.js`, wrote `createUser` and `getUsers` using async/await inside try/catch. The main design decision was the status codes: `createUser` returns 201 on success and 400 in the catch (bad client data, such as a validation error), while `getUsers` returns 500 in the catch because a failure to read is a server problem.

## Task 3 – Targeted operations and the null check
Added `getUserByEmail`, `updateUser`, and `deleteUser`, all driven by `req.params.email`. The key lesson of the module is that `findOne`, `findOneAndUpdate`, and `findOneAndDelete` do **not** throw when nothing matches. They quietly return `null`, so the catch block never runs. Each function therefore needs an explicit `if (!user)` check returning a 404, otherwise the client would get a misleading 200 with an empty body. For updates I passed `{ returnDocument: 'after', runValidators: true }` so the response shows the new data rather than the old document, and so the schema rules still apply to updates, which Mongoose skips by default.

## Task 4 – Routers and server.js
Created `routes/userRoutes.js` using `express.Router()` and mapped the five controller functions to the correct verbs. Reduced `server.js` to its entry-point job: load `.env`, connect to the database, apply `express.json()`, and mount the router with `app.use('/api/users', userRoutes)`. Because the base path is set at the mount point, the router only defines `/` and `/:email`, which keeps each file small and easy to read compared with t07's single-file approach.

## Task 5 – Extension: Posts
Applied the full MVC pattern to a second resource. `models/Post.js` has `title` (String, required), `content` (String, required), and `postID` (Number, required, unique). `controllers/postController.js` has all five CRUD operations with try/catch, explicit 404s for missing posts on read, update, and delete, and the same `returnDocument`/`runValidators` options on update. `routes/postRoutes.js` maps them, and `server.js` mounts the router at `/api/posts`. Since `postID` is a Number but `req.params` values are always strings, I convert with `Number(req.params.postID)` before querying. `requests.http` was extended with create/read/update/delete requests for posts, 404 checks, a missing-title validation failure, and a duplicate-`postID` case.

## Challenges
The tutorial instructions contained a few typos that would have caused bugs if followed literally: the PUT and DELETE routes were written as `'/:email '` with a trailing space (the route would never match), the model file was named `js` instead of `User.js`, and the Post controller was named `postRoutes.js` in the instructions although the folder structure shows `postController.js`. Spotting these early was a good reminder to cross-check written steps against the intended structure rather than copying blindly.

I checked all files with a syntax check and confirmed the routers load. I have not recorded a full run of `requests.http` against a live MongoDB here, so that end-to-end test is still to be confirmed in the Codespace.
