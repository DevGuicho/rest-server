const path = require('path')
const { v4: uuidv4 } = require('uuid')

const defaultExtensions = ['png', 'jpg', 'jpeg', 'gif']

const uploadValidator = ({
  files,
  extensionesValidas = defaultExtensions,
  dir = ''
}) =>
  new Promise((resolve, reject) => {
    const { file } = files
    const shortName = file.name.split('.')
    const extension = shortName[shortName.length - 1]

    if (!extensionesValidas.includes(extension)) {
      return reject(new Error('Extensión no permitida'))
    }

    const tempName = uuidv4() + '.' + extension
    const uploadPath = path.join(__dirname, '../uploads', dir, tempName)

    file.mv(uploadPath, function (err) {
      if (err) {
        reject(err)
      }

      resolve(tempName)
    })
  })

module.exports = uploadValidator
