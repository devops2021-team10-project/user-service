function handleError(err, res) {
  if(typeof(err) === 'string') {
    if(err === 'Forbidden') {
      return res.sendStatus(403);
    } else if(err === 'Unauthorized') {
      return res.sendStatus(401);
    } else if(err === 'Not Found') {
      return res.sendStatus(404);
    } else {
      return res.status(400).json({ msg: err });
    }
  } else {
    console.log(err);
    return res.status(500).json({ msg: err.toString() });
  }
}

module.exports.handleError = handleError