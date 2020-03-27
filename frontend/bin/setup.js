const spaceImport = require('contentful-import')
const exportFile = require('../contentful/export.json')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const { writeFileSync } = require('fs')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.development' })

const argv = require('yargs-parser')(process.argv.slice(2))

console.log(`
  To set up this project you need to provide your Space ID
  and the belonging API access tokens as well as your API key from from the Goole Cloud Console.
  You can find all the needed information in your Contentful space under:
  ${chalk.yellow(
    `app.contentful.com ${chalk.red('->')} Space Settings ${chalk.red(
      '->'
    )} API keys`
  )}
  The ${chalk.green('Content Management API Token')}
    will be used to import and write data to your space.
  The ${chalk.green('Content Delivery API Token')}
    will be used to ship published production-ready content in your Gatsby app.
  The ${chalk.green('Google Could API Key')}
    will be used to power the maps, autocomplete and places apis for the polling locator.
  Ready? Let's do it! 🎉
`)

const questions = [
  {
    name: 'spaceId',
    message: 'Your Space ID',
    when: !argv.spaceId && !process.env.CONTENTFUL_SPACE_ID,
    validate: input =>
      /^[a-z0-9]{12}$/.test(input) ||
      'Space ID must be 12 lowercase characters',
  },
  {
    name: 'managementToken',
    when: !argv.managementToken && !process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    message: 'Your Content Management API access token',
  },
  {
    name: 'accessToken',
    when: !argv.accessToken && !process.env.CONTENTFUL_ACCESS_TOKEN,
    message: 'Your Content Delivery API access token',
  },
  {
    name: 'googleCloudKey',
    when: !argv.googleCloudKey && !process.env.GOOGLE_CLOUD_KEY,
    message: 'Your Google Cloud Key',
  },
]

inquirer
  .prompt(questions)
  .then(({ spaceId, managementToken, accessToken, googleCloudKey }) => {
    const {
      CONTENTFUL_SPACE_ID,
      CONTENTFUL_ACCESS_TOKEN,
      CONTENTFUL_MANAGEMENT_TOKEN,
      GOOGLE_CLOUD_KEY,
    } = process.env

    // env vars are given precedence followed by args provided to the setup
    // followed by input given to prompts displayed by the setup script
    spaceId = CONTENTFUL_SPACE_ID || argv.spaceId || spaceId
    managementToken = CONTENTFUL_MANAGEMENT_TOKEN || managementToken
    accessToken = CONTENTFUL_ACCESS_TOKEN || argv.accessToken || accessToken
    googleCloudKey = GOOGLE_CLOUD_KEY || googleCloudKey

    console.log('Writing config file...')
    const configFiles = [`.env.development`, `.env.production`].map(file =>
      path.join(__dirname, '..', file)
    )

    const fileContents =
      [
        `# All environment variables will be sourced`,
        `# and made available to gatsby-config.js, gatsby-node.js, etc.`,
        `# Do NOT commit this file to source control`,
        `CONTENTFUL_SPACE_ID='${spaceId}'`,
        `CONTENTFUL_ACCESS_TOKEN='${accessToken}'`,
        `CONTENTFUL_MANAGEMENT_TOKEN='${managementToken}'`,
        `GOOGLE_CLOUD_KEY='${googleCloudKey}'`,
      ].join('\n') + '\n'

    configFiles.forEach(file => {
      writeFileSync(file, fileContents, 'utf8')
      console.log(`Config file ${chalk.yellow(file)} written`)
    })
    return { spaceId, managementToken }
  })
  .then(({ spaceId, managementToken }) =>
    spaceImport({ spaceId, managementToken, content: exportFile })
  )
  .then((_, error) => {
    console.log(
      `All set! You can now run ${chalk.yellow(
        'yarn run dev'
      )} to see it in action.`
    )
  })
  .catch(error => console.error(error))
