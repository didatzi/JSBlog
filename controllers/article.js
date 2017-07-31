const Article = require('mongoose').model('Article');

module.exports = {
    createGet: (reg, res) => {
        res.render('article/create');
    },
    createPost: (reg, res) => {
        let articleArgs = reg.body;
        let errorMsg = '';

        if (!reg.isAuthenticated()) {
            errorMsg = 'You shoud be logged in to make articles!';
        } else if (!articleArgs.title) {
            errorMsg = 'Invalid title!';
        } else if (!articleArgs.content) {
            errorMsg = 'Invalid content!';
        }
        if (errorMsg) {
            res.render('article/create', {error: errorMsg});
            return;
        }
        articleArgs.author = reg.user.id;
        Article.create(articleArgs).then(article => {
            reg.user.articles.push(article.id);
            reg.user.save(err => {
                if (err) {
                    res.redirect('/', {error: err.message});
                } else {
                    res.redirect('/');
                }
            });
        })
    },
    details: (reg, res) => {
        let id = reg.params.id;
        Article.findById(id).populate('author').then(article => {
            res.render('article/details', article)
        });
    }
};
