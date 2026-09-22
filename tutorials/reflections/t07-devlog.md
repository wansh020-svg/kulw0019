# Devlog – Tutorial 07: Introduction to MongoDB

## Task 1 – Environment setup
Set up `tutorials/t07` with `express`, `mongoose`, and `dotenv`, plus `nodemon` as a dev dependency. Created a `.env` file to hold `MONGO_URI` separately from the codebase, and a `.gitignore` excluding `.env` and `node_modules` so secrets and bulky dependencies never reach GitHub. This reinforced why environment variables matter: the connection string is treated as a secret, not something hardcoded into `server.js`.

## Task 2 – Async database connection
Wrote `connectDB` as an async function wrapping `mongoose.connect()` in a try/catch. The most important lesson here was *why* it needs to be async and awaited before the server starts handling requests — without it, the server could accept traffic before the database link exists, creating what the tutorial called a "zombie server" that can't actually save or retrieve anything. On failure, calling `process.exit(1)` intentionally crashes the server rather than leaving it silently broken, which was a different mindset than the defensive "never crash" approach from Tutorial 06's error handler — here, crashing loudly is the correct behaviour when a core dependency is missing.

The biggest real-world obstacle of the whole tutorial showed up here: the tutorial assumes a `mongo` hostname resolves automatically inside a preconfigured devcontainer, but this repo had no `.devcontainer` setup at all, so `mongo` couldn't be found (`ENOTFOUND mongo`). Fixed by manually running a MongoDB container with Docker (`docker run -d -p 27017:27017 --name mongo mongo:6`) and pointing `MONGO_URI` at `localhost:27017` instead of the `mongo` hostname. This was a good reminder that tutorial instructions assume an environment is already fully provisioned, and real setups often need adapting when that assumption doesn't hold.

## Task 3 & 4 – Schema, model, and first write
Built `User.js` with a Mongoose schema enforcing `username` and `email` as required with custom error messages, `email` as a unique index, and `role` defaulting to `"student"` when omitted. Compiled it into a model with `mongoose.model("User", userSchema)` and exported it. Added `timestamps: true` so every document automatically tracks `createdAt`/`updatedAt`.

Wired up a POST route (`/api/test-setup`) to create a user from the request body. Sending a request without a `role` field confirmed the default worked correctly, and the returned document included the auto-generated timestamps as expected. Verified the data existed in the actual database using `mongosh` directly inside the Docker container (`docker exec -it mongo mongosh tutorial_07 --eval "db.users.find().pretty()"`), rather than the MongoDB VS Code extension, which never successfully connected despite several attempts — a good fallback to know, since GUI tooling can fail in ways a database's own shell won't.

## Task 5 – Second schema and multi-model writes in one request
Built `Topic.js` with `title` (required, custom message), `isActive` (Boolean, defaults to `true`), `units` (Number, required), and `prerequisites` (array of Strings). Updated the POST route to destructure the extra fields from the request body and create both a `User` and a `Topic` from a single client request, returning both in the response. This was the first time in the module two separate collections were populated from one endpoint, which highlighted how a single route can coordinate multiple models rather than being tied to just one.

One practical snag: since `email` is unique, resending the same test payload after already creating "jane@uni.edu.au" would fail with a duplicate-key error rather than actually testing the new Topic logic — solved by using a new email rather than dropping the whole database.

## Challenges
Lost time when `server.js` was accidentally reduced to only the route handler (missing all imports and `app.listen`), likely from an incomplete paste/save — a reminder to periodically `cat` a file back out to confirm what's actually saved rather than assuming an edit landed. Also had the MongoDB Docker container stop silently between sessions (likely from Codespace idling), which surfaced as `ECONNREFUSED` on reconnect — resolved with `docker start mongo` rather than recreating the container, which preserved the existing data.
