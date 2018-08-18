export default (app, viewsPath = './views') => {
  app.set('view engine', 'pug')
  app.set('views', viewsPath)

  return app
}
