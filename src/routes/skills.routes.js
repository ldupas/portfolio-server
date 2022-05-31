const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query("SELECT * FROM skill", (err, result) => {
        if(err) {
            res.status(500).send("Error retrieving skills from database");
        } else {
            res.json(result);
        }
    })
});

router.get('/:id', (req, res) =>  {
    const skillId = req.params.id;
    connection.query('SELECT * FROM skill WHERE id=?', 
    [skillId], 
    (err, results) => {
        if(err) {
            res.status(500).send("Error retrieving skills from database");
        } else {
            if (results.length) res.json(results[0]);
            else res.status(404).send("Skill not found");
        }
    })
})

router.post('/', (req, res) => {
    const { name, picture } = req.body;
    connection.query(
    'INSERT INTO skill (name, picture) VALUES (?, ?)',
    [name, picture],
    (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving skills from database');
        }
        else 
        {
            const id = result.insertId;
            const createdSkill = { id, name, picture };
            res.status(201).json(createdSkill);
        }
    }
)
});

router.put('/:id', (req, res) => {
    const skillId = req.params.id;
    const db = connection.promise();
    let existingSkill = null;

    db.query('SELECT * FROM skill WHERE id = ?', 
    [skillId])
    .then(([results]) => {
        existingSkill = results[0];
        if (!existingSkill) return Promise.reject('Skill not found')
        return db.query('UPDATE skill SET ? WHERE id = ?', [req.body, skillId]);
    })
    .then(() => {
        res.status(200).json({...existingSkill, ...req.body});
    })
    .catch((err) => {
        console.log(err);
        if (err === 'Skill not found')
        res.status(404).send(`Skill with id ${skillId} not found.`)
        else {
            res.status(500).send('Error updating skill from database');
        }
    });
});

router.delete('/:id', (req, res) => {
    const skillId = req.params.id;
    connection.query(
        'DELETE FROM skill WHERE id = ?',
        [skillId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error while deleting a skill');
            }
            else
            {
                if(result.affectedRows) res.status(200).send('🎉 Skill deleted')
                else res.status(404).send('Skill not found!')
            }
        }
    )
});

module.exports = router;