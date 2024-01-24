const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const net = require('net');

const app = express();
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));


let db = new sqlite3.Database('BlueOcean.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos SQLite.');
});

app.get('/lecturas', (req, res) => {
    const sql = `SELECT * FROM Sensores ORDER BY Timestamp DESC LIMIT 20`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(5050, () => {
    console.log('Servidor HTTP corriendo en http://localhost:5050/');
});

// Configuración del servidor TCP
const tcpServer = net.createServer((socket) => {
    console.log('Cliente TCP conectado');

    socket.on('data', (data) => {
        const mensaje = data.toString();
        const [valorPH, valorTurbidez, valorTDS, Timestamp] = mensaje.split(',');

        // Insertar datos en la base de datos
        const sql = `INSERT INTO Sensores (Timestamp, ValorPH, ValorTurbidez, ValorTDS) VALUES (?, ?, ?, ?)`;
        db.run(sql, [Timestamp, valorPH, valorTurbidez, valorTDS], (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Registro insertado con éxito: ${valorPH}, ${valorTurbidez}, ${valorTDS}, ${Timestamp}`);
        });

        console.log(`Datos recibidos: pH: ${valorPH}, Turbidez: ${valorTurbidez}, TDS: ${valorTDS}, Tiempo: ${Timestamp}`);
    });

    socket.on('end', () => {
        console.log('Cliente TCP desconectado');
    });
});

tcpServer.on('error', (err) => {
    throw err;
});

// Iniciar servidor TCP en el puerto 81
tcpServer.listen(81, '0.0.0.0', () => {
    console.log('Servidor TCP escuchando en 0.0.0.0:81');
});
