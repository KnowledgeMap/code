# -*- coding: utf-8-*-
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from kmap.models import kGraph

import json

def get_result(request):
    return HttpResponse(json.dumps("abc"), content_type="application/json")
