const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query("SELECT * FROM user", (err, result) => {
        if(err) {
            res.status(500).send("Error retrieving users from database");
        } else {
            res.json(result);
        }
    })
})

router.get('/:id', (req, res) =>  {
    const userId = req.params.id;
    connection.query('SELECT * FROM user WHERE id=?', 
    [userId], 
    (err, results) => {
        if(err) {
            res.status(500).send("Error retrieving users from database");
        } else {
            if (results.length) res.json(results[0]);
            else res.status(404).send("User not found");
        }
    })
})

// Maintenant, j'aimerais pouvoir ajouter de la data dans ma DB
// sur ce thème précis évidemment
router.post('/', (req, res) => {
    // Ici je déscructure le corps de ma requête
    // Corps de ma requête = propriétés de ma table DB
    // (au moins, ce qui est en NOT NULL par défaut)
    const { email, password } = req.body;
    connection.query(
    'INSERT INTO user (email, password) VALUES (?, ?)',
    [email, password],
    (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving products from database');
        }
        else 
        {
            const id = result.insertId;
            // Ici je définis ce que je veux voir en tant que retour json
            const createdUser = { id, email, password };
            res.status(201).json(createdUser);
        }
    }
)
})

module.exports = router;