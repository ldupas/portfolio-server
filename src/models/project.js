const connection = require('../db-config');

const findAll = async () => {
    return connection.promise().query('SELECT * FROM project');
}

const insertProject = async ({ name, description, date, repo_front, repo_back, deploy_url, category_id }, picture) => {
    return connection.promise().query('INSERT INTO project (name, description, picture, date, repo_front, repo_back, deploy_url, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, picture, date, repo_front, repo_back, deploy_url, category_id])
};

module.exports = {
    findAll,
    insertProject
};