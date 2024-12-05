//Initialize application 
const express = require('express');
const app = express();
const PORT = 3000;
const { Pool } = require('pg');
app.use(express.json());


//Postgres information 
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DatabaseQAPThree',
    password: 'PostgresPassword',
    port: 5432,
});


//Create table in a step-by-step process
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
    //Validate input
    const { id, description, status } = request.body;
    if (!id || !description || !status) {
        return response.status(400).json({ error: 'All fields (id, description, status) are required' });
    }
    //Add task
    try {
        const result = await pool.query('INSERT INTO tasks (id, description, status) VALUES ($1, $2, $3)', [id, description, status]);
        response.status(201).json({ message: 'Task added successfully' });
    } 
    //Make sure it works
    catch (error) {
        response.status(500).json({ error: "Internal Server Error" });
    }
});


// PUT /tasks/:id - Update a task's status
app.put('/tasks/:id', async (request, response) => {
    const { id } = request.params;
    const { status } = request.body;
    //Update task
    try {
        const result = await pool.query('UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
        response.json({ message: 'Task updated successfully' });
    } 
    //Make sure it works
    catch (error) {
        response.status(500).json({ error: "Internal Server Error" });
    }
});


// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (request, response) => {
    const { id } = request.params;
    //Delete task
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        response.json({ message: 'Task deleted successfully' });
    } 
    //Make sure it works
    catch (error) {
        response.status(500).json({ error: "Internal Server Error" });
    }
});


//Server creation
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
