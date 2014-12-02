# -*- coding: utf-8-*-
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from kmap.models import kGraph

import json

def home(request):
    content = dict()
    return render_to_response('home.html', RequestContext(request, content))

def get_net1(request):
    p = kGraph.objects.all()
    nodes = []
    edges = []
    for item in p:
        nodes.extend([
            {"id": '%s-%s' % (item.id, item.edge.name)},
            {"id": item.prop1.name},
            {"id": item.prop2.name},
            ])
        edges.extend([
            {"source": '%s-%s' % (item.id, item.edge.name),"target": item.prop1.name},
            {"source": '%s-%s' % (item.id, item.edge.name),"target": item.prop2.name},
            ])
        if item.prop3:
            nodes.append({"id": item.prop3.name})
            edges.append({"source": '%s-%s' % (item.id, item.edge.name),"target": item.prop3.name})

    response_data = {'nodes': nodes, 'edges': edges}
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def get_net2(request):
    p = kGraph.objects.all()
    nodes = []
    edges = []
    for item in p:
        n = len(nodes)
        nodes.extend([
            {"name": item.edge.name},
            {"name": item.prop1.name, "group": 1},
            {"name": item.prop2.name, "group": 1},
            ])
        edges.extend([
            {"source": n, "target": n+1},
            {"source": n, "target": n+2}
            ])
        if item.prop3:
            nodes.append({"name": item.prop3.name, "group": 1})
            edges.append({"source": n,"target": n+3})

    response_data = {'nodes': nodes, 'links': edges}
    return HttpResponse(json.dumps(response_data), content_type="application/json")
