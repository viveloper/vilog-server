const router = require('express').Router();
const firestore = require('../../firebase/firestore');

router.get('/', (req, res, next) => {
  firestore.collection('sections').orderBy('index').get().then(snapshot => {
    const sections = [];
    snapshot.forEach(doc => {
      sections.push(doc.data())
    });
    res.status(200).json(sections);
  }).catch(err => {
    res.status(500).json(err)
  })
});

router.post('/', (req, res, next) => {

  // admin api
  if(req.user.email !== 'viveloper@chova.com'){
    return res.status(401).json({
      message: 'You need administrator privileges.'
    })
  }

  const section = {
    index: req.body.index,
    name: req.body.name,
    description: req.body.description
  }
  const docRef = firestore.collection('sections').doc();
  docRef.set(section).then(() => {
    res.status(201).json({
      status: 'created'
    })
  }).catch(err => {
    res.status(500).json(err)
  })
});

module.exports = router;