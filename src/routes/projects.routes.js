const { append } = require("express/lib/response");
const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query("SELECT * FROM project", (err, result) => {
        if(err) {
            res.status(500).send("Error retrieving projects from database");
        } else {
            res.json(result);
        }
    })
});

router.get('/:id', (req, res) =>  {
    const projectId = req.params.id;
    connection.query('SELECT * FROM project WHERE id=?', 
    [projectId], 
    (err, results) => {
        if(err) {
            res.status(500).send("Error retrieving projects from database");
        } else {
            if (results.length) res.json(results[0]);
            else res.status(404).send("Project not found");
        }
    })
});

router.post('/', (req, res) => {
    const { name, description, picture, date, repo_front, repo_back, deploy_url, category_id } = req.body;
    connection.query(
    'INSERT INTO project (name, description, picture, date, repo_front, repo_back, deploy_url, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, picture, date, repo_front, repo_back, deploy_url, category_id],
    (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error retrieving project from database');
        }
        else 
        {
            const id = result.insertId;
            const createdProject = { id, name, description, picture, date, repo_front, repo_back, deploy_url, category_id };
            res.status(201).json(createdProject);
        }
    }
)
});

router.put('/:id', (req, res) => {
    const projectId = req.params.id;
    const db = connection.promise();
    let existingProject = null;

    db.query('SELECT * FROM project WHERE id = ?', 
    [projectId])
    .then(([results]) => {
        existingProject = results[0];
        if (!existingProject) return Promise.reject('Project not found')
        return db.query('UPDATE project SET ? WHERE id = ?', [req.body, projectId]);
    })
    .then(() => {
        res.status(200).json({...existingProject, ...req.body});
    })
    .catch((err) => {
        console.log(err);
        if (err === 'Project not found')
        res.status(404).send(`Project with id ${projectId} not found.`)
        else {
            res.status(500).send('Error updating user from database');
        }
    });
});

router.delete('/:id', (req, res) => {
    const projectId = req.params.id;
    connection.query(
        'DELETE FROM project WHERE id = ?',
        [projectId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error while deleting a project');
            }
            else
            {
                if(result.affectedRows) res.status(200).send('🎉 Project deleted')
                else res.status(404).send('Project not found!')
            }
        }
    )
});


module.exports = router;