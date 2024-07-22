#!/bin/bash

rm -rf api/migrations
rm db.sqlite3
python manage.py makemigrations api
python manage.py migrate
python manage.py loaddata User
python manage.py loaddata ProjectType
python manage.py loaddata Project
python manage.py loaddata Condition
python manage.py loaddata DataFile
python manage.py loaddata Metadata
python manage.py loaddata AnalysisType
python manage.py loaddata Analysis
python manage.py loaddata ProjectAnalysisType
python manage.py loaddata ProjectTypeAnalysisType
python manage.py loaddata GSEALibrary
python manage.py loaddata AnalysisParameter
python manage.py loaddata AnalysisParameterValue
python manage.py loaddata Result
python manage.py loaddata MLModel
python manage.py loaddata Visualization
python manage.py loaddata Protein