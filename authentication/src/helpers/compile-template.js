import fs from 'fs'
import handlebars from 'handlebars'

export default function(file, locals = {}) {
  var source = fs.readFileSync(file, 'utf8')
  var template = handlebars.compile(source)

  return template(locals)
}
