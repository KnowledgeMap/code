"""
WSGI config for kmap project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/howto/deployment/wsgi/
"""

import os
import sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")

current_dir = os.path.dirname(__file__)
if current_dir not in sys.path:
    sys.path.append(current_dir) 

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
