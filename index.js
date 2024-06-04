import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';

const app = express();
app.use(express.json());
app.use(express.static('public'));

(async () => {
    const db = await sqlite.open({
        filename: './data_plan.db',
        driver: sqlite3.Database
    });

    await db.migrate();

    // Define the POST endpoint for inserting data into the music table
    app.post('/api/music/create', async (req, res) => {
        const { song_name, year_, artist } = req.body;

        const sql = 'INSERT INTO music(song_name, year_, artist) VALUES (?, ?, ?)';

        try {
            const run_database = await db.run(sql, [song_name, year_, artist]);
            console.log('Values successfully added');
            res.json({ status: 'success', id: run_database.lastID });
        } catch (error) {
            console.error('Failed to add values into the table', error);
            res.status(500).json({ error: 'Failed to add values into the table' });
        }
    });

    // Define the DELETE endpoint for deleting a record from the music table
    app.delete('/api/music/delete/:id', async (req, res) => {
        const { id } = req.params;

        const sql = 'DELETE FROM music WHERE id = ?';

        try {
            const result = await db.run(sql, id);
            if (result.changes === 0) {
                res.status(404).json({ error: 'Record not found' });
            } else {
                console.log('Music deleted successfully', id);
                res.json({ status: 'success' });
            }
        } catch (error) {
            console.error('Error deleting record from table:', error);
            res.status(500).json({ error: 'Failed to delete record from the table' });
        }
    });

    // Define the GET endpoint for fetching all music records
    app.get('/api/music', async (req, res) => {
        const sql = 'SELECT id, song_name AS name, year_, artist FROM music';

        try {
            const music = await db.all(sql);
            res.json({ music });
        } catch (error) {
            console.error('Failed to fetch music records', error);
            res.status(500).json({ error: 'Failed to fetch music records' });
        }
    });

    // Define a simple GET endpoint to check if the API is running
    app.get('/api', (req, res) => {
        res.send('Running with API!');
    });

    let PORT = process.env.PORT || 3765;

    app.listen(PORT, function () {
        console.log('Port running on:', PORT);
    });
})();
