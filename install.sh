#!/bin/bash

sudo pip install -r requirement.txt
python manage.py syncdb
