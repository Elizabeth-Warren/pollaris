# Pollaris Frontend

This iteration of the frontend for the Pollaris polling locator uses Gatsby.js along with the contentful CMS plugin.

## Content Entry

The guidelines for our content entry process are available [here](https://docs.google.com/document/d/1-xJ4dSBToNud9vmYxv5CzBX-ezySJpzHSTcTXJe2j-Q/edit?usp=sharing) and the polling locator copy workbook is available [here](https://drive.google.com/file/d/1CiiYa36uve7qsK2Mb1y5ZEn3-Dl1slbQ/view?usp=sharing). A big thanks to [Adam Garner](https://twitter.com/garntastic) for putting these guides together.

## Setup

Run the following commands:

```
yarn install
yarn run setup
```

setup should populate contentful and your .env files then run:

```
yarn run dev
```

## Caveats

- The polling locator is currently solely populated with California specific content, search for an adddress in California.
- There is no fallback page currently for states without data.

## API Keys

### Contentful

Contentful keys can be find in Settings > API Keys.

### Google Cloud Console

Found in APIs & Services > Credentials.
You will need to enable static maps, places and static.

## Syncing Development Environment

Imports and exports with the `contentful/export.json` file.

### Export from Contentful

```
yarn run export
```

### Import into Contentful

```
yarn run import
```
