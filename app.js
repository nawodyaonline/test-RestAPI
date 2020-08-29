const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/apiClone', { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Book = mongoose.model('Book', bookSchema);

app.route('/books')
    .get((req, res) => {
        Book.find(function(err, response) {
            if (!err) {
                res.send(response);
            } else {
                console.log(err);
            }
        })
    })
    .post((req, res) => {
        const newBook = new Book({
            title: req.body.title,
            content: req.body.content
        });
        newBook.save(function(err) {
            if (!err) {
                res.send('Succesfully added new book');
            } else {
                console.log(err);
            }
        });
    })
    .delete((req, res) => {
        Book.deleteMany(function(err, response) {
            if (!err) {
                res.send('Succesfully Deleted all books');
            } else {
                res.send(response);
            }
        })
    });


// ----------------- A diferent route ---------------------
app.route('/books/:bookTitle')
    .get((req, res) => {
        Book.findOne({ title: req.params.bookTitle }, function(err, response) {
            if (!err) {
                if (response) {
                    res.send(response);
                } else {
                    res.send('No sucha book found');
                }
            } else {
                console.log(err);
            }
        })
    })
    .delete((req, res) => {
        Book.deleteOne({ title: req.params.bookTitle }, function(err) {
            if (!err) {
                res.send('Succesfully Deleted');
            } else {
                res.send(err);
            }
        })
    })
    .put((req, res) => {
        Book.update({ title: req.params.bookTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true },
            function(err) {
                if (!err) {
                    res.send('Succesfully updated');
                } else {
                    res.send(err);
                }
            }
        )
    })
    .patch((req, res) => {
        Book.update({ title: req.params.bookTitle }, { $set: req.body },
            function(err) {
                if (!err) {
                    res.send('Succesfully patched');
                } else {
                    res.send(err);
                }
            }
        )
    });



app.listen(process.env.PORT || 3000, () => console.log('Server is running on port 3000'));