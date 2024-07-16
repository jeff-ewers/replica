#!/bin/bash

# Start the Django server
poetry run python manage.py runserver &

# Start the Vite dev server
cd replica-client && npm run dev &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?