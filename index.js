const express = require('express');
const app = express();
const PORT = 3000;
const { Pool } = require('pg');

app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DatabaseQAPThree',
    password: 'PostgresPassword',
    port: 5432,
});

async function createTable() {
    //Tasks
    await pool.query (`
      CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      description VARCHAR(255) NOT NULL,
      status VARCHAR(255)
     )`
    )
};
createTable();

// GET /tasks - Get all tasks
app.get("/tasks", async (request, response) => {
    //Select task
    try {
        const result = await pool.query('SELECT * FROM tasks');
        response.json(result.rows);
    } 
    //Make sure it works
    catch (error) {
        response.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /tasks - Add a new task
app.post('/tasks', async (request, response) => {
    const { id, description, status } = request.body;
    if (!id || !description || !status) {
        return response.status(400).json({ error: 'All fields (id, description, status) are required' });
    }
    try {
        const result = await pool.query('INSERT INTO tasks (id, description, status) VALUES ($1, $2, $3)', [id, description, status]);
        response.status(201).json({ message: 'Task added successfully' });
    } 
    catch (error) {
        response.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT /tasks/:id - Update a task's status
app.put('/tasks/:id', (request, response) => {
    const taskId = parseInt(request.params.id, 10);
    const { status } = request.body;
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return response.status(404).json({ error: 'Task not found' });
    }
    task.status = status;
    response.json({ message: 'Task updated successfully' });
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (request, response) => {
    const taskId = parseInt(request.params.id, 10);
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== taskId);

    if (tasks.length === initialLength) {
        return response.status(404).json({ error: 'Task not found' });
    }
    response.json({ message: 'Task deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
