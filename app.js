//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const loadash = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent =
  'Blogging has become an interesting phenomenon, a natural outgrowth of the world wide web. It’s popular because it is easy. And with all the various platforms today, it’s accessible to nearly anyone.I remember when people were criticizing email because it was “destroying language” and wrecking good grammar, good English etc. Then texting came along and academics began to gasp.Has texting destroyed the language? Everything has a pro and con, including email, texting and blogging. I think it’s great that people are communicating. How many letters would people send in a day if they had to type, print, fold, and insert into an envelope that they must still address and stamp? What a hassle. By email, I can maintain contacts with fifty or more people a day. At the office it used to be a hundred or more.';
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

const app = express();

app.set('view engine', 'ejs');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = mongoose.Schema({
  title: String,
  content: String,
});
const Post = mongoose.model('Post', postSchema);

app.get('/', (req, res) => {
  res.render('home', {
    para1: homeStartingContent,
    // posts :posts,
  });
  // console.log(posts);
});
app.get('/about', (req, res) => {
  res.render('about', {
    para2: aboutContent,
  });
});
app.get('/contact', (req, res) => {
  res.render('contact', {
    para3: contactContent,
  });
});
app.get('/compose', (req, res) => {
  res.render('compose');
});

// express routing parameter..

app.get('/post/:postname', (req, res) => {
  const requestedtitle = loadash.lowerCase(req.params.postname);
  posts.forEach((post) => {
    var storedTitle = loadash.lowerCase(post.Title);
    if (requestedtitle === storedTitle) {
      // to render created posts inside post tab
      res.render('post', {
        postHeading: post.Title,
        postBody: post.Content,
      });
    }
  });
});
app.get('/myposts', (req, res) => {
  Post.find({}, function (err, posts) {
    res.render('myposts', {
      posts: posts,
    });
  });
});
// --------------------UPDATE POST ---------------------------------
//LOAD EDIT FORM
app.get('/edit/:id', (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    res.render('editpost', {
      post: post,
      postHeading: post.title,
      postBody: post.content,
    });
  });
});

//UPDATE SUBMIT
app.post('/edit/:id', (req, res) => {
  let post = {};
  post.title = req.body.postTitle;
  post.content = req.body.postBody;

  let query = {
    _id: req.params.id,
  };

  Post.updateOne(query, post, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/myposts');
    }
  });
});

// ------------------------------------------------------------------
app.post('/compose', (req, res) => {
  const post = new Post({
    title: loadash.capitalize(req.body.postTitle),
    content: loadash.capitalize(req.body.postBody),
  });
  // posts.push(post);
  post.save(function (err) {
    if (!err) {
      res.redirect('/myposts');
    }
  });
});

// DELETE POST
app.post('/delete', (req, res) => {
  const postId = req.body.deletebtn;
  Post.findByIdAndRemove(postId, (err) => {
    if (err) {
      console.log(err);
      console.log(postId);
    } else {
      // console.log(postId);
      res.redirect('/myposts');
      console.log('Post Successfully Deleted');
    }
  });
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}
app.listen(port, function () {
  console.log('Server started on port 3000');
});
