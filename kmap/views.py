# -*- coding: utf-8-*-
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse

import json

def home(request):
    content = dict()
    return render_to_response('home.html', RequestContext(request, content))

def get_net(request):
    response_data = {}
    response_data['nodes'] = [
            {"id":"广义相对论"},
            {"id":"狭义相对论"},
            {"id":"电动力学"},
            {"id":"非相对论量子力学"},
            {"id":"固体物理"},
            {"id":"量子场论"}
            ]

    response_data['edges'] = [
            {"source":"狭义相对论","target":"量子场论"},
            {"source":"广义相对论","target":"狭义相对论"},
            {"source":"固体物理","target":"量子场论"}
            ]

    return HttpResponse(json.dumps(response_data), content_type="application/json")
