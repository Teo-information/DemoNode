// models/vendedor.js
// This file could be used to define the structure of a Vendedor object
// or contain static methods related to vendor data if not using stored procedures directly in controllers.

class Vendedor {
    constructor(id_ven, nom_ven, ape_ven, id_dis, cel_ven) {
        this.id_ven = id_ven;
        this.nom_ven = nom_ven;
        this.ape_ven = ape_ven;
        this.id_dis = id_dis;
        this.cel_ven = cel_ven;
    }

    // You could add methods here if needed, e.g., validation
}

module.exports = Vendedor;

// However, given your controller uses stored procedures directly,
// this file might not be actively used in your current setup.