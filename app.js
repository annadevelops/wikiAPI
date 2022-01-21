const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

main().catch(err => console.log(err));
async function main() {
        await mongoose.connect('mongodb://localhost:27017/wikiDB');
};

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model('Article', articleSchema);

// Requests Targetting All Articles
app.route('/articles')
    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                console.log(err);
            }
        })
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added the article");
            } else {
                res.send(err)
            }
        })
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Sucessfully deleted all articles");
            } else {
                res.send(err);
            }
        })
    });


// Requests Targetting A Specific Article
app.route('/articles/:articleTitle')
    
    .get((req,res) => {
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
            if(foundArticle){
                res.send(foundArticle);
            } else {
                res.send("Cannot find such article");
            }
        })
    })
    .put((req,res) => {
        Article.replaceOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            (err) => {
                if(!err){
                    res.send("Sucessfully made the whole changes")
                };
            });
    })
    .patch((req,res) => {
        Article.updateOne(
            {title: req.params.articleTitle},
            req.body, //MongoDB will update whatever comes through here as we are not replacing the whole doc (which is what put does) so whatever changes pass through here will reflects here
            (err) => {
                if(!err){
                    res.send("I have updated the article for you!")
                }
            }
        )
    })
    .delete((req,res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if(!err){
                    res.send("Successfully deleted the article!")
                }
            }
        );
    });

app.listen(PORT, () => {
    console.log(PORT + ' is running');
})