# Devlog – Tutorial 09: The Bridge (React frontend + Express backend)

## Task 1 – Two separate environments
Created `tutorials/t09` with a `backend` (Express, CORS, Mongoose, dotenv, nodemon) and a `frontend` scaffolded with Vite's React template. A single `.gitignore` at the `t09` root covers `node_modules` and `.env` for both apps. On the frontend I removed `App.css` and `index.css`, added a `components` folder, and replaced the default styling with `styles.css`, updating the imports in `main.jsx` and `App.jsx`. Keeping the two apps in separate folders with their own `package.json` mirrors a real deployment where the API and the browser client run in different places.

## Task 2 – Model, controller, and route
Built `models/User.js` with `userId` (Number, required, unique), `name`, and `role` (Strings, required) and `timestamps: true`. `getUsers` in `controllers/userController.js` fetches every user, then responds through `setTimeout(..., 2000)` so the 2-second delay simulates real network latency. Without it, a local request is so fast that the loading state could never be seen. `routes/userRoutes.js` maps `GET /` to the controller.

## Task 3 – Database config, server, and seeding
Moved the database connection into `config/db.js` as `connectDB`, which logs success or logs the error and exits the process, the same approach as earlier modules but now reusable by both the server and the seed script. `server.js` loads `.env` first, calls `connectDB()`, applies `cors()` and `express.json()`, and mounts the router at `/api/users` on port 5000. `cors()` is needed because the browser's Same-Origin Policy blocks the frontend (a different origin) from reading the API's responses by default. Without it the request reaches the server but the browser refuses to expose the result. Added `scripts/seed.js` to clear and refill the collection with five users so each test starts from a known state, and `requests.http` to check the API on its own before involving React.

## Task 4 – Defensive UI in React
`UserDashboard.jsx` uses three pieces of state, `data`, `loading`, and `error`, so the component always renders one of three states: waiting, failed, or loaded. A `useEffect` with an empty dependency array fetches once on mount. The fetch checks `response.ok` and throws on a bad status, because `fetch` only rejects on network failure, not on 404 or 500. The `finally` block clears the loading flag whether the request succeeded or failed. The API address comes from `import.meta.env.VITE_API_URL` in `frontend/.env`, so no URL is hardcoded in components.

## Task 5 – Extension: user lookup
Added `getUserById` to the controller. It converts `req.params.id` to a number, returns 400 for a non-numeric ID, and uses `findOne({ userId })` with an explicit 404 when it returns `null`, since Mongoose does not throw for a missing document. Added `GET /:id` to the router. On the frontend, `UserLookup.jsx` has a controlled text input and a `handleSearch` function that fetches `/api/users/${searchId}` with its own loading and error state. The button is disabled while searching or when the input is empty, and a 404 is shown as "User not found". It is rendered under the dashboard in `App.jsx`.

## Challenges
The instructions mention both `seeds.js` and `seed.js`, and the pasted seed script imports `./config/db.js` and `./models/User.js`, which are wrong paths from inside `scripts/`. I used `scripts/seed.js` with imports `../config/db.js` and `../models/User.js`. The frontend `.env` also depends on the Codespace's forwarded address, which has to be set to public and recopied if the Codespace changes, and both servers must be restarted after editing it because Vite only reads environment variables at startup.

I confirmed the frontend builds with Vite and the routes return the right status codes (200, 404 for a missing user, 400 for a bad ID) with CORS headers present, using a stubbed database. I have not yet viewed the finished page in a browser against live MongoDB data, so that final check is still to be done in the Codespace.
