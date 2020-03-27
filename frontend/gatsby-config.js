require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

const path = require('path')

const contentfulConfig = {
  spaceId: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  host: process.env.CONTENTFUL_HOST,
}

const { spaceId, accessToken } = contentfulConfig

if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful spaceId and the access token need to be provided.'
  )
}

module.exports = {
  siteMetadata: {
    title: 'Pollaris Frontend',
  },
  pathPrefix: '/',
  plugins: [
    'gatsby-plugin-styled-components',
    'gatsby-transformer-remark',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-root-import',
      options: {
        wr: path.join(__dirname, 'src'),
        '@ewarren/persist': path.join(__dirname, 'src/components/persist'),
        '@ewarren/unitedstatesofamerica': path.join(
          __dirname,
          'src/utils/unitedstatesofamerica'
        ),
      },
    },
    {
      resolve: 'gatsby-source-contentful',
      options: contentfulConfig,
    },
  ],
}
