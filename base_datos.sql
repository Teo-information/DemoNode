-- Create the Distritos table
CREATE TABLE Distritos (
    id_dis INT PRIMARY KEY,
    nom_dis VARCHAR(255) NOT NULL
);

-- Create the Vendedores table
CREATE TABLE Vendedores (
    id_ven INT PRIMARY KEY,
    nom_ven VARCHAR(255) NOT NULL,
    ape_ven VARCHAR(255) NOT NULL,
    id_dis INT,
    cel_ven VARCHAR(20),
    FOREIGN KEY (id_dis) REFERENCES Distritos(id_dis)
);
-----------Buscar vendedor por id o nombre
DELIMITER $$

CREATE PROCEDURE sp_busven(
    IN pid_ven INT,
    IN pnom_ven VARCHAR(50)
)
BEGIN
    SELECT v.id_ven, v.nom_ven, v.ape_ven, v.cel_ven, d.nom_dis
    FROM Vendedores v
    JOIN Distritos d ON v.id_dis = d.id_dis
    WHERE (pid_ven IS NULL OR v.id_ven = pid_ven)
      AND (pnom_ven IS NULL OR v.nom_ven LIKE CONCAT('%', pnom_ven, '%'));
END$$

DELIMITER ;

------------Eliminar vendedor por ID
DELIMITER $$

CREATE PROCEDURE sp_delven(IN pid_ven INT)
BEGIN
    DELETE FROM Vendedores WHERE id_ven = pid_ven;
END$$

DELIMITER ;

----------Insertar nuevo vendedor
DELIMITER $$

CREATE PROCEDURE sp_ingven(
    IN pnom_ven VARCHAR(50),
    IN pape_ven VARCHAR(50),
    IN pid_dis INT,
    IN pcel_ven VARCHAR(15)
)
BEGIN
    INSERT INTO Vendedores(nom_ven, ape_ven, id_dis, cel_ven)
    VALUES(pnom_ven, pape_ven, pid_dis, pcel_ven);
END$$

DELIMITER ;

-------Modificar datos de un vendedor
DELIMITER $$

CREATE PROCEDURE sp_modven(
    IN pid_ven INT,
    IN pnom_ven VARCHAR(50),
    IN pape_ven VARCHAR(50),
    IN pid_dis INT,
    IN pcel_ven VARCHAR(15)
)
BEGIN
    UPDATE Vendedores
    SET nom_ven = pnom_ven,
        ape_ven = pape_ven,
        id_dis = pid_dis,
        cel_ven = pcel_ven
    WHERE id_ven = pid_ven;
END$$

DELIMITER ;
----Listar todos los vendedores con su distrito
DELIMITER $$

CREATE PROCEDURE sp_selven()
BEGIN
    SELECT v.id_ven, v.nom_ven, v.ape_ven, v.cel_ven, d.nom_dis
    FROM Vendedores v
    JOIN Distritos d ON v.id_dis = d.id_dis;
END$$

DELIMITER ;


