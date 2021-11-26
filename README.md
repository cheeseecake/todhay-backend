# Todo/Habit Incentive Webapp

## Getting Started

- Install Docker
- Clone this repo (or `git pull` if you've already cloned it)
- Create a `.env` file in `backend/backend` with your Django `SECRET_KEY` (i.e. `SECRET_KEY=XXXXX`)
- If this is the first time running the app, perform the necessary Django DB migrations to create the `db.sqlite3` file:
  - `cd backend`
  - If you haven't already, `pip install -r requirements.txt`
  - `python manage.py makemigrations`
  - `python manage.py migrate`
- Build docker-compose images:
  - `docker compose build`
- Run:
  - `docker compose up`
  - View the app at [localhost:10000](http://localhost:10000)

The DB (`db.sqlite3`) will be persisted across container restarts/deletes.

Note: After changing any code, you'll need to rebuild and re-run the `docker compose` commands to see the effect.

## Known Issues

- If you didn't create either the `.env` or `db.sqlite3` files and run `docker compose up`, Docker creates empty folders with the same name. You'll have to remove them manually and rerun `docker compose up --force-recreate` to restart the containers.

## Todo

See Issues