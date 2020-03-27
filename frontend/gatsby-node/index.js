const Promise = require('bluebird')
const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  createRedirect({
    fromPath: `/`,
    toPath: `/vote`,
    redirectInBrowser: true,
    isPermanent: true,
  })

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allContentfulPage {
              nodes {
                path
                id
                templateName
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        result.data.allContentfulPage.nodes.forEach(node => {
          createPage({
            path: node.path,
            component: path.resolve(`./src/templates/${node.templateName}.js`),
            context: {
              id: node.id,
            },
          })
        })
      })
    )
  })
}
