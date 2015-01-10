#!/bin/bash

rm -f db.sqlite3
python manage.py syncdb --noinput
python manage.py createsuperuser --username=root --email=jiekunyang@gmail.com
