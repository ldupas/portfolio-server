const connection = require("../db-config");
const router = require("express").Router();
const Joi = require('joi');
const argon2 = require('argon2');

const { findUserByEmail, insertUser } = require('../models/user');
const checkJwt = require('../middlewares/checkJwt');
const { generateJwt } = require('../utils/auth');

// Je prépare un schéma de validation qui va renforcer la sécurité de mes inputs / postman / thunderclient (côté back)
// Je laisse une sécurité minimum pour le password en phase de développement 
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

router.get('/', checkJwt, (req, res) => {
    connection.query("SELECT * FROM user", (err, result) => {
        if(err) {
            res.status(500).send("Error retrieving users from database");
        } else {
            res.json(result, {message: "YES"});
        }
    })
});

router.get('/:id', checkJwt, (req, res) =>  {
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

router.post('/', async (req, res) => {
    // Je viens valider mon schéma écrit plus haut en analysant le req.body de ma requête post
    // Je vérifie donc la validité et l'intégrité des données que j'essaye d'envoyer
    const { value, error } = userSchema.validate(req.body);

    // Première étape, en cas d'erreur, je stop tout et affiche l'erreur en question dans la console
    if(error) {
        return res.status(400).json(error);
    };

    // J'aimerais déjà savoir si un utilisateur existe déjà avec le mail en question
    const [[existingUser]] = await findUserByEmail(value.email);
    if (existingUser) {
        return res.status(409).json({
            message: "L'utilisateur existe déjà en base de données."
        });
    };

    const hashedPassword = await argon2.hash(value.password);
    await insertUser(value.email, hashedPassword);

    // const jwtKey = generateJwt(value.email);
    // return res.json({
    //     credentials: jwtKey,
    // })

    return res.status(201).json({
        message: "L'utilisateur a bien été créé."
    });
});

router.post('/login', async (req, res) => {
    // Comme pour l'étape de création de compte, je veux vérifier le schéma du formulaire
    // ainsi que l'existence maintenant du mail dans la BDD
    const { value, error } = userSchema.validate(req.body);

    if(error) {
        res.status(400).json(error);
    };

    // car il faut bien avoir un compte existant pour pouvoir se logger
    const [[existingUser]] = await findUserByEmail(value.email);

    if(!existingUser) {
        res.status(403).json({
            message: "L'utilisateur n'existe pas."
        })
    };

    const verified = await argon2.verify(existingUser.password, value.password);
    if(!verified) {
        return res.status(403).json({
            message: "Le mot de passe n'existe ou ne correspond pas au mot de passe de l'utilisateur."
        });
    };

    // Lorsque je me connecte, je veux attacher un token à mon user
    const jwtKey = generateJwt(value.email);
    return res.json({
       credentials: jwtKey
    })
});

// // Maintenant, j'aimerais pouvoir ajouter de la data dans ma DB
// // sur ce thème précis évidemment
// router.post('/', (req, res) => {
//     // Ici je déscructure le corps de ma requête
//     // Corps de ma requête = propriétés de ma table DB
//     // (au moins, ce qui est en NOT NULL par défaut)
//     const { email, password } = req.body;
//     connection.query(
//     'INSERT INTO user (email, password) VALUES (?, ?)',
//     [email, password],
//     (err, result) => {
//         if (err) {
//             res.status(500).send('Error retrieving products from database');
//         }
//         else 
//         {
//             const id = result.insertId;
//             // Ici je définis ce que je veux voir en tant que retour json
//             const createdUser = { id, email, password };
//             res.status(201).json(createdUser);
//         }
//     }
// )
// });

// Maintenant, je veux pouvoir modifier des infos 
// concernant un produit 
router.put('/:id', (req, res) => {
    const userId = req.params.id;
    const db = connection.promise();
    let existingUser = null;

    db.query('SELECT * FROM user WHERE id = ?', 
    [userId])
    .then(([results]) => {
        existingUser = results[0];
        if (!existingUser) return Promise.reject('User not found')
        return db.query('UPDATE user SET ? WHERE id = ?', [req.body, userId]);
    })
    .then(() => {
        res.status(200).json({...existingUser, ...req.body});
    })
    .catch((err) => {
        console.log(err);
        if (err === 'User not found')
        res.status(404).send(`User with id ${userId} not found.`)
        else {
            res.status(500).send('Error updating user from database');
        }
    });
});

// Dernière étape d'un CRUD "basique", il faut pouvoir supprimer
// une ligne de la DB (tuple, sous entendu un objet)
router.delete('/:id', (req, res) => {
    const userId = req.params.id;
    connection.query(
        'DELETE FROM user WHERE id = ?',
        [userId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error while deleting a user');
            }
            else
            {
                // On va chercher la ligne affectée en question
                // Si tout va, on renvoie donc un status 200 de suppression
                if(result.affectedRows) res.status(200).send('🎉 User deleted')
                else res.status(404).send('User not found!')
            }
        }
    )
});

module.exports = router;