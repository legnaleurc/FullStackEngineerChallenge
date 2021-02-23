# Full Stack Developer Challenge
This is an interview challengs. Please feel free to fork. Pull Requests will be ignored.

## Setup Server Side

Please use Python 3.9.

```sh
# install dependenies
pip install -r requirements.txt
cd server
# create tables
./manage.py migrate
# add some users for testing
./manage.py createtestdata
# run the server, it will run on 8000
./manage.py runserver
```

## Setup Client Side

Please stable Node.js.

```sh
cd client
yarn install
# setup backend port, e.g. 8000. the client will run on 8080
BACKEND_PORT=8000 yarn start
```

## Access the site

Please access `http://localhost:8080/`.
