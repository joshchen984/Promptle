# Promptle

## What is it?

## Installation
First create and activate a python virtual environment with Python 3.10.12
```
cd backend
./build.sh
```
Create a .env file in the backend directory and paste in these variables:
```
OPENAI_API_KEY=
MONGO_PASSWORD=
MONGO_USERNAME=
AZURE_STORAGE_ACCOUNT_KEY=
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_CONNECTION_STRING=
AZURE_CONTAINER_NAME=
```

## Deployment
* Flask site hosted on render.com
* Images stored in Azure blob storage
* Image data stored in Mongo Atlas
