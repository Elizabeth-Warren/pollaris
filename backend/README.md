# Pollaris Backend

This directory is the Django app for the Pollaris backend.

If you're browsing the code, check out [urls.py](pollaris/urls.py), [search_views.py](pollaris/app/views/search_views.py), and [models.py](pollaris/app/models.py) to get started.

## Data Model

To have results to serve you'll need to populate the database with data.

Different states assign polling locations in different ways, and Pollaris is able to handle day-of-election polling locations, early vote centers, and drop boxes.
It can handle either one or multiple polling locations per precinct.

The data model has two main sections:

1. Mapping a person's address to the precinct they live in. This is represented in the tables `StreetSegment` and `Zip9ToPrecinct`.
2. Mapping a precinct to the polling location(s) for that precinct. This is represented in `PollingLocation`, `PrecinctToPollingLocation`, and the corresponding tables for early vote locations and drop boxes.

## Local Development

To set up the basic environment variables needed, you can start with the example env variables. Run:

```bash
cp example.env .env
```

We use pipenv to manage dependencies. To install dependencies:

```bash
pipenv install -d
```

Start the DB:

```bash
docker-compose up -d
```

Run the migrations to initialize the database:

```bash
pipenv run python manage.py migrate
```

Run the server:

```bash
pipenv run python manage.py runserver
```

Run tests, not including tests marked as "slow":

```bash
pipenv run pytest -m "not slow"
```

Run all tests:

```bash
pipenv run pytest
```

## Deployment

On the Warren campaign, we ran this app on AWS using Lambda and Aurora Postgres Serverless, and used Serverless to deploy.
