# Todo/Habit Incentive Webapp

## Getting Started

- Install Docker
- Clone this repo (or `git pull` if you've already cloned it)
- Install `npm` packages for the frontend locally:
  - Ensure you have the latest version of `npm` available on your system
  - `cd frontend`
  - `npm ci`
- Build docker-compose images:
  - `docker compose build`
- Run:
  - `docker compose up`
  - View the app at [localhost:10000](http://localhost:10000)

## Notes

- The DB (`db.sqlite3`) will be persisted across container restarts/deletes.
- After changing any code, you'll need to rebuild and re-run the `docker compose` commands to see the effect.
- If you installed new Python packages, you'll need to rebuild the container: `docker compose build` followed by `docker compose up --force-recreate`
- If you install new `npm` packages, rerun `npm i` from the `frontend/` directory.
- If you get the error `Error response from daemon: Ports are not available: listen tcp 0.0.0.0:10001: bind: An attempt was made to access a socket in a way forbidden by its access permissions.`:
  - Stop the docker containers: `docker compose down`
  - Open `cmd` as Administrator
  - `net stop winnat`
  - `net start winnat`
  - Restart the docker containers: `docker compose up`

## Issues

See Issues
