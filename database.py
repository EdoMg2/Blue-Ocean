import sqlite3

db_name = "BlueOcean.db"

table_schema = """
    DROP TABLE IF EXISTS Sensores;

    CREATE TABLE Sensores(
        SensorID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        Timestamp DATETIME NOT NULL,
        ValorPH REAL NOT NULL,
        ValorTurbidez REAL NOT NULL,
        ValorTDS REAL NOT NULL
    );

    DROP TABLE IF EXISTS Alarmas;

    CREATE TABLE Alarmas(
        AlarmaID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        TipoDeAlarma TEXT NOT NULL,
        Prioridad INTEGER NOT NULL,
        Estado BOOLEAN NOT NULL,
        Limite REAL NOT NULL,
        SensorID INTEGER NOT NULL,
        FOREIGN KEY(SensorID) REFERENCES Sensores(SensorID)
    );
"""

con = sqlite3.connect(db_name)
cur = con.cursor()

sqlite3.complete_statement(table_schema)
cur.executescript(table_schema)

cur.close()
con.close()
