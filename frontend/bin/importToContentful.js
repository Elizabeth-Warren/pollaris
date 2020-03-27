const spaceImport = require('contentful-import')
const dotenv = require('dotenv')
const exportFile = require('../contentful/export.json')

dotenv.config({ path: '.env.development' })

const { CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN } = process.env

spaceImport({
  spaceId: CONTENTFUL_SPACE_ID,
  managementToken: CONTENTFUL_MANAGEMENT_TOKEN,
  content: exportFile,
})
