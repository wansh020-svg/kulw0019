# Devlog – Tutorial 06: Middleware Assembly Line

## Task 1 – Setup
Set up the Express server in `tutorials/t06`, initialised with `npm init -y`, and installed `express` and `nodemon`. One issue I ran into: my `package.json` didn't have the `dev` script or `"type": "module"` set correctly at first, which caused `npm run dev` to fail with "Missing script: dev". Fixing the scripts block and adding `"type": "module"` (required since `server.js` uses ES module `import` syntax rather than `require`) resolved it.

## Task 2 – GET routes
Built `/api/students` (with optional `?major=` filtering via `.filter()`) and `/api/students/:id` (using `.find()` and `parseInt()` on the URL param). Tested both the found and not-found cases — requesting id `1` returned Ada Lovelace correctly, and changing it to a non-existent id returned a clean 404 JSON error instead of crashing the server.

## Task 3 – POST/PUT/DELETE
Added creation, update, and deletion logic. The PUT route uses the `||` fallback pattern so a partial update (e.g. only sending `major`) doesn't wipe out the existing `name`. Verified with requests.http that a new student (Grace Hopper) was correctly added with status 201, and that updating Ada Lovelace's major returned 200 with the new value.

## Task 4 – Middleware and error handling
This was the core concept of the activity. The `logger` middleware confirmed how Express processes requests in order — every route hit printed a `[LOG]` line to the console before the response was sent, making the request lifecycle visible for the first time. The four-parameter error handler was the trickiest concept: Express only recognises it as an error handler because it has exactly four arguments `(err, req, res, next)`, not because of where it's placed syntactically — though it still needs to go after all the routes. Testing `/api/test-error` correctly returned a 500 to the client while logging the full stack trace server-side, showing the intended split between what a client and a developer should each see.

## Task 5 – Authentication gatekeeper
Built `checkAuth` as standalone middleware and injected it into the DELETE route between the URL and the handler. Testing without the `Authorization` header correctly returned 401 Unauthorized; testing with `admin123` passed through and returned 204 No Content. This showed how middleware can be selectively applied to just one route rather than globally with `app.use()`.

## Challenges
The most time was lost on Git, not Express — running `git add` with no path staged nothing, so an early commit appeared to succeed but never actually included the new files. Running `git status` was what revealed the files were still untracked. Also worth noting: `node_modules` got committed initially because there was no `.gitignore` in place at the time.
