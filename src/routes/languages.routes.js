const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query("SELECT * FROM language", (err, result) => {
        if(err) {
            res.status(500).send("Error retrieving languages from database");
        } else {
            res.json(result);
        }
    })
});

router.get('/:id', (req, res) =>  {
    const languageId = req.params.id;
    connection.query('SELECT * FROM language WHERE id=?', 
    [languageId], 
    (err, results) => {
        if(err) {
            res.status(500).send("Error retrieving languages from database");
        } else {
            if (results.length) res.json(results[0]);
            else res.status(404).send("Language not found");
        }
    })
})

router.post('/', (req, res) => {
    const { name, picture } = req.body;
    connection.query(
    'INSERT INTO language (name, picture) VALUES (?, ?)',
    [name, picture],
    (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving languages from database');
        }
        else 
        {
            const id = result.insertId;
            const createdLanguage = { id, name, picture };
            res.status(201).json(createdLanguage);
        }
    }
)
});

router.put('/:id', (req, res) => {
    const languageId = req.params.id;
    const db = connection.promise();
    let existingLanguage = null;

    db.query('SELECT * FROM language WHERE id = ?', 
    [languageId])
    .then(([results]) => {
        existingLanguage = results[0];
        if (!existingLanguage) return Promise.reject('Language not found')
        return db.query('UPDATE language SET ? WHERE id = ?', [req.body, languageId]);
    })
    .then(() => {
        res.status(200).json({...existingLanguage, ...req.body});
    })
    .catch((err) => {
        console.log(err);
        if (err === 'Language not found')
        res.status(404).send(`Language with id ${languageId} not found.`)
        else {
            res.status(500).send('Error updating language from database');
        }
    });
});

router.delete('/:id', (req, res) => {
    const languageId = req.params.id;
    connection.query(
        'DELETE FROM language WHERE id = ?',
        [languageId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error while deleting a language');
            }
            else
            {
                if(result.affectedRows) res.status(200).send('🎉 Language deleted')
                else res.status(404).send('Language not found!')
            }
        }
    )
});

module.exports = router;