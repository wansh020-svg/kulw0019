import express from 'express';
const app = express();

// ---- Core middleware ----
app.use(express.json());

// Task 4: Logger middleware
function logger(req, res, next) {
    console.log(`[LOG] ${req.method} request received at ${req.url}`);
    next();
}
app.use(logger);

// Task 1: In-memory "database"
let students = [
    { id: 1, name: "Ada Lovelace", major: "Mathematics" },
    { id: 2, name: "Alan Turing", major: "Computer Science" }
];

// Task 5: Auth gatekeeper middleware
function checkAuth(req, res, next) {
    if (req.headers.authorization === "admin123") {
        next();
    } else {
        res.status(401).json({ error: "Unauthorized: missing or invalid token." });
    }
}

// ---- Task 2: GET routes ----

// GET all students (supports ?major= filter)
app.get('/api/students', (req, res) => {
    if (req.query.major) {
        const filtered = students.filter(st => st.major === req.query.major);
        return res.status(200).json(filtered);
    }
    res.status(200).json(students);
});

// GET single student by id
app.get('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(st => st.id === id);

    if (!student) {
        return res.status(404).json({ error: "Student not found." });
    }
    res.status(200).json(student);
});

// ---- Task 3: POST / PUT / DELETE routes ----

// POST create a new student
app.post('/api/students', (req, res) => {
    const newStudent = {
        id: Date.now(),
        name: req.body.name,
        major: req.body.major
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// PUT update an existing student
app.put('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(st => st.id === id);

    if (!student) {
        return res.status(404).json({ error: "Student not found." });
    }

    student.name = req.body.name || student.name;
    student.major = req.body.major || student.major;

    res.status(200).json(student);
});

// DELETE a student (Task 5: protected by checkAuth)
app.delete('/api/students/:id', checkAuth, (req, res) => {
    const targetId = parseInt(req.params.id);
    students = students.filter(st => st.id !== targetId);
    res.status(204).send();
});

// ---- Task 4: Test error route ----
app.get('/api/test-error', (req, res, next) => {
    next(new Error("This is a deliberate test error!"));
});

// ---- Task 4: Global error handler (must be last, 4 params) ----
app.use((err, req, res, next) => {
    console.error("Critical System Failure: ", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

// ---- Start server ----
const PORT = 5100;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});