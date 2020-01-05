const router = require('express').Router();
const firestore = require('../../firebase/firestore');

router.get('/:section', (req, res, next) => {
  firestore.collection('posts').where('section', '==', req.params.section).orderBy('createdAt', 'desc').get().then(snapshot => {
    const posts = [];
    snapshot.forEach(doc => {
      posts.push({
        ...doc.data(),
        id: doc.id
      })
    });
    return res.status(200).json({ posts });
  }).catch(error => {
    console.error(error);
    return res.status(500).json({
      code: error.code,
      message: error.message
    })
  })
});

router.post('/:section', (req, res, next) => {
  const { title, content, author, image } = req.body;
  firestore.collection('posts').doc().set({
    title,
    content,
    author,
    image,
    section: req.params.section,
    createdAt: new Date().toISOString()
  })
  .then(() => {        
    return res.status(201).json({ success: true });
  })
  .catch(error => {
    console.error(error);
    return res.status(500).json({
      code: error.code,
      message: error.message
    })
  })
});

module.exports = router;