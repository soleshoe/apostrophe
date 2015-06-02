module.exports = function(self, options) {

  self.route('post', 'create', function(req, res) {

    var piece = self.create();

    return async.series({
      // hint: a partial object, or even passing no fields
      // at this point, is OK
      convert: function(callback) {
        return self.apos.schemas.convert(req, schema, req.body, piece, callback);
      },
      before: function(callback) {
        return self.beforeInsert(req, piece, callback);
      },
      insert: function(callback) {
        return self.insert(req, piece, callback);
      },
      after: function(callback) {
        return self.afterInsert(req, piece, callback);
      }
    }, function(err) {
      return self.apiResponse(res, err, piece);
    });

  });

  self.route('post', 'retrieve', self.requirePiece, function(req, res) {
    // is there any reason not to just use middleware here, since we are
    // retrieving a single piece by id?
    return self.apiResponse(res, err, req.piece);
  });

  self.route('post', 'list', function(req, res) {
    var pieces = [];

    return async.series({
      before: function(callback) {
        return self.beforeList(req, pieces, callback);
      },
      list: function(callback) {
        return self.list(req, pieces, callback);
      },
      after: function(callback) {
        return self.afterList(req, pieces, callback);
      }
    }, function(err) {
      return self.apiResponse(res, err, pieces);
    });
  });

  self.route('post', 'update', self.requirePiece, function(req, res) {
    var schema = self.schema;
    return async.series({
      convert: function(callback) {
        return self.apos.schemas.convert(req, schema, req.body, req.piece, callback);
      },
      before: function(callback) {
        return self.beforeUpdate(req, req.piece, callback);
      },
      update: function(callback) {
        return self.update(req, req.piece, callback);
      },
      after: function(callback) {
        return self.afterUpdate(req, req.piece, callback);
      },
    }, function(err) {
      return self.apiResponse(res, err, req.piece);
    });

  });

  self.route('post', 'trash', function(req, res) {
    // TODO implement
  });

};