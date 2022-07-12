const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query("SELECT * FROM category", (err, result) => {
        if(err) {
            res.status(500).send("Error retrieving categories from database");
        } else {
            res.json(result);
        }
    })
});

router.get('/:id', (req, res) =>  {
    const categoryId = req.params.id;
    connection.query('SELECT * FROM category WHERE id=?', 
    [categoryId], 
    (err, results) => {
        if(err) {
            res.status(500).send("Error retrieving categories from database");
        } else {
            if (results.length) res.json(results[0]);
            else res.status(404).send("Category not found");
        }
    })
})

router.post('/', (req, res) => {
    const { name } = req.body;
    connection.query(
    'INSERT INTO category (name) VALUES (?)',
    [name],
    (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving categories from database');
        }
        else 
        {
            const id = result.insertId;
            const createdCategory = { id, name };
            res.status(201).json(createdCategory);
        }
    }
)
});

router.put('/:id', (req, res) => {
    connection.query(
      'UPDATE category SET ? WHERE id = ?',
      [req.body, req.params.id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error updating a category');
        } else {
          if (result.affectedRows) {
            const updatedCategory = {
              id: req.params.id,
              name: req.body.name,
            };
            res.status(200).json(updatedCategory);
          } else res.status(404).send('category not found.');
        }
      }
    );
  });

// router.put('/:id', (req, res) => {
//     const categoryId = req.params.id;
//     const db = connection.promise();
//     let existingCategory = null;

//     db.query('SELECT * FROM category WHERE id = ?', 
//     [categoryId])
//     .then(([results]) => {
//         existingCategory = results[0];
//         if (!existingCategory) return Promise.reject('Category not found')
//         return db.query('UPDATE category SET ? WHERE id = ?', [req.body, categoryId]);
//     })
//     .then(() => {
//         res.status(200).json({...existingCategory, ...req.body});
//     })
//     .catch((err) => {
//         console.log(err);
//         if (err === 'Category not found')
//         res.status(404).send(`Category with id ${categoryId} not found.`)
//         else {
//             res.status(500).send('Error updating category from database');
//         }
//     });
// });

router.delete('/:id', (req, res) => {
    const categoryId = req.params.id;
    connection.query(
        'DELETE FROM category WHERE id = ?',
        [categoryId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error while deleting a category');
            }
            else
            {
                if(result.affectedRows) res.status(200).send('🎉 Category deleted')
                else res.status(404).send('Category not found!')
            }
        }
    )
});

module.exports = router;