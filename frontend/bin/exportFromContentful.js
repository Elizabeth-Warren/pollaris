const contentfulExport = require('contentful-export')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.development' })

const { CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN } = process.env

const options = {
  spaceId: CONTENTFUL_SPACE_ID,
  managementToken: CONTENTFUL_MANAGEMENT_TOKEN,
  exportDir: 'contentful',
  contentFile: 'export.json',
}

contentfulExport(options)
  .then(() => {
    console.log(
      'Contentful data successfully written to contentful/export.json.'
    )
  })
  .catch(err => {
    console.log('Error on contentful fetch', err)
  })
