const router = require('express').Router();
const firestore = require('../../firebase/firestore');

router.get('/', (req, res, next) => {
  firestore.collection('sections').orderBy('index').get().then(snapshot => {
    const sections = [];
    snapshot.forEach(doc => {
      sections.push(doc.data())
    });
    return res.status(200).json({ sections });
  }).catch(error => {
    console.error(error);
    return res.status(500).json({
      code: error.code,
      message: error.message
    })
  })
});

router.get('/:name', (req, res, next) => {
  firestore.collection('sections').where('name', '==', req.params.name).get().then(snapshot => {
    const sections = [];
    snapshot.forEach(doc => {
      sections.push(doc.data())
    });
    return res.status(200).json({ section: sections[0] });
  }).catch(error => {
    console.error(error);
    return res.status(500).json({
      code: error.code,
      message: error.message
    })
  })
});

// admin api
router.post('/', (req, res, next) => {
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
  }).catch(error => {
    console.error(error);
    res.status(500).json({
      code: error.code,
      message: error.message
    })
  })
});

module.exports = router;