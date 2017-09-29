module.exports = function buildConfig(env) {
  return require('./build/' + env + '.js')(env);
}
