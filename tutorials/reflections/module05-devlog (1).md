# Module 4 Devlog

## Proof of completion

<!-- Store images in tutorials/imgs/ and reference them below with a descriptive filename + caption.
     Suggested captures from this tutorial (pick your best 2, or a GIF under 10s):
     - ScoreBoard after several increment/plusFive clicks
     - UserForm with a live-updating name preview
     - DataFetcher rendering the fetched user list
     - LiveClock running, then toggled off/on to show the count reset (best evidence of cleanup) -->

![ScoreBoard component showing score after multiple increment and plusFive clicks](../imgs/module4-scoreboard.png)
*Caption: Score updated via functional state update after three clicks each on increment and plusFive.*

![LiveClock toggled off and back on, showing timer reset to zero](../imgs/module4-liveclock.png)
*Caption: Extension task — toggling LiveClock off/on confirms the useEffect cleanup function stops the interval on unmount.*

- **Extension task completed successfully:** [Yes/No] <!-- Task 5: LiveClock show/hide toggle with cleanup -->
- **Description of media:** The screenshots show the ScoreBoard's functional state updates working correctly across multiple clicks, and the LiveClock component being toggled off and on to confirm the setInterval is cleared on unmount rather than continuing to run in the background.

## Concept mapping

- **Concept 1:** (Lecture slide #__) — State via `useState`: standard JS variables don't trigger re-renders when changed, so React needs a dedicated hook that both stores a value and provides a setter that schedules a re-render. This was implemented in `ScoreBoard.jsx` to track a numeric score.

```js
const [score, setScore] = useState(0);
const increment = () => {
  setScore(score + 1);
};
```

- **Concept 2:** (Lecture slide #__) — Functional state updates: React batches state updates for performance, so calling a setter multiple times off a stale closed-over value under-counts the result. Passing a callback (`prevScore => prevScore + 5`) to the setter guarantees each update reads the latest state rather than a stale snapshot.

```js
const plusFive = () => {
  setScore((prevScore) => prevScore + 5);
};
```

- **Concept 3:** (Lecture slide #__) — Immutability and controlled inputs: React state objects must never be mutated directly, so updating one field of `formData` requires spreading the previous object into a new one and overwriting just the changed key. Binding each `<input>`'s `value` and `onChange` to that state makes React the single source of truth for the form.

```js
const handleChange = (evt) => {
  setFormData({
    ...formData,
    [evt.target.name]: evt.target.value,
  });
};
```

- **Concept 4:** (Lecture slide #__) — Side effects and quarantining with `useEffect`: fetching data is a side effect that must run outside the render body, or it triggers an infinite fetch → setState → re-render loop. Passing an empty dependency array (`[]`) restricts the effect to run once on mount, and an inner async function is used since the effect callback itself can't be `async`.

```js
useEffect(() => {
  const fetchUsers = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const result = await response.json();
    setUsers(result);
  };
  fetchUsers();
}, []);
```

- **Concept 5:** (Lecture slide #__) — Cleanup functions: side effects like `setInterval` persist in browser memory after a component unmounts unless explicitly stopped, causing a memory leak. Returning a cleanup function from `useEffect` that calls `clearInterval` ensures the timer is destroyed when `LiveClock` is removed from the screen.

```js
useEffect(() => {
  const id = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);
```

## AI transparency and critical reflection

### Table 1: AI tool usage log

| AI tool used | Purpose | Prompt used | Did you use the output "as is" or modify it? How? |
|---|---|---|---|
| Claude | Step-by-step guidance building ScoreBoard, UserForm, DataFetcher, and LiveClock components | Asked for the tutorial steps to be broken down one at a time and for code to paste for each component | Modified: adjusted and corrected the pasted code myself before it worked correctly, including fixing duplicated imports/declarations in App.jsx and server.js caused by paste errors, and verifying each component's behaviour in the browser before moving on |

### Analysis and Implications

**Reflection:** This module clarified why React can't just watch for changes to ordinary variables and why state, the setter function, and re-renders are treated as a single package — I hadn't previously registered that a "re-render" is a distinct, triggerable event rather than something that just happens automatically whenever a variable's value changes. The part I was most confused by was the batching behaviour behind functional updates (`prevScore => prevScore + 5`): I could follow the mechanical fix, but it took deliberately breaking it (calling `setScore(score + 1)` multiple times in a row) to actually see why the raw-variable version silently fails. Using Claude for step-by-step guidance sped up getting the code in correctly, but it also meant I encountered fewer of my own bugs organically — the two paste-duplication errors I did hit (in App.jsx and server.js) were more instructive for understanding how the file actually executes than the working code itself, which suggests the copy-paste workflow may have thinned out some of the productive struggle the exercise was designed to create.


---


# Module 5 Devlog
## Proof of completion

<!-- Store images in tutorials/imgs/ and reference them below with a descriptive filename + caption -->

![GET /api/status route returning a 200 response](../imgs/module5-get-status.png)
*Caption: REST Client "Send Request" showing a 200 OK response from the GET /api/status route.*

![POST /api/search combining query params and JSON body](../imgs/module5-post-search.png)
*Caption: Extension task — POST /api/search returning a single object combining the URL query string (category, sort) and the JSON body (searchTerm, pageNumber).*

- **Extension task completed successfully:** [Yes]
- **Description of media:** The screenshots show the Express GET route returning a 200 status with a JSON status payload, and the extension task's POST route merging both `req.query` and `req.body` into one combined object returned with a 200 status.

## Concept mapping

- **Concept 1:** (Lecture slide #__) — Express as a web framework: Node.js alone requires substantial manual code to handle HTTP traffic, so Express was used to streamline server setup, route definitions, and request/response handling. This was implemented by instantiating an Express app object and binding it to a port with `app.listen()`.

```js
import express from 'express';
const app = express();

const PORT = 5100;
app.listen(PORT, () => {
    console.log(`Server actively running on port ${PORT}`);
});
```

- **Concept 2:** (Lecture slide #__) — RESTful GET routes: a GET route is a network endpoint dedicated to retrieving data, distinct from other HTTP verbs like POST. `app.get()` was used to define `/api/status`, with a route handler callback receiving `req` and `res` and responding with a 200 status and JSON payload.

```js
app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'API Online',
        timestamp: Date.now()
    });
});
```

- **Concept 3:** (Lecture slide #__) — Middleware and parsing request bodies: Node doesn't automatically parse incoming JSON payloads, so `express.json()` middleware was registered to intercept and translate the request body before route handlers can use it. Without this, `req.body` would be undefined in the POST route.

```js
app.use(express.json());
```

- **Concept 4:** (Lecture slide #__) — RESTful POST routes and status codes: a POST route is used for a client to send new data to the server, and the convention is to respond with a 201 status (Created) rather than 200, signalling that a new resource was successfully created. The handler read `req.body` and echoed it back to the client alongside a confirmation message.

```js
app.post('/api/users', (req, res) => {
    const incomingData = req.body;
    res.status(201).json({
        message: "User successfully created",
        data: incomingData
    });
});
```

- **Concept 5:** (Lecture slide #__) — Combining query parameters and request body: a single route can accept data from more than one source at once — a URL query string (`req.query`) and a JSON body (`req.body`) — which need to be merged before responding. The spread operator was used to combine both objects into a single response payload.

```js
app.post('/api/search', (req, res) => {
    const queryParams = req.query;
    const bodyData = req.body;
    const combined = { ...queryParams, ...bodyData };
    res.status(200).json(combined);
});
```

## AI transparency and critical reflection

### Table 1: AI tool usage log

| AI tool used | Purpose | Prompt used | Did you use the output "as is" or modify it? How? |
|---|---|---|---|
| Claude | Step-by-step guidance setting up the Express server, routes, and package.json configuration | Asked for the tutorial steps broken down one at a time, and code to paste for server.js and package.json | Modified: adjusted and corrected the pasted code myself before it worked, including fixing a duplicated import/app/listen block in server.js caused by a paste error, and testing each route with the REST Client extension before moving on to the next task |

### Analysis and Implications

**Reflection:** This module made the request-response cycle concrete — seeing `req` and `res` actually populated by Express for a real request clarified what those objects represent, rather than treating them as abstract parameters passed into a function. The most useful realisation was that middleware like `express.json()` isn't optional boilerplate; without it `req.body` is simply undefined, which explained why a POST route can silently fail to read incoming data if the middleware line is missed or placed after the route definitions. Debugging the duplicated code from the paste error in server.js was more useful for understanding Express's startup sequence than the working code was, since tracing why the server wouldn't restart cleanly forced me to actually read through what each line was doing rather than assuming it was correct.
