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

    def insert_node(name, group=1):
        content = {"name": name, "group": group}
        if content in nodes:
            return nodes.index(content)
        else:
            nodes.append(content)
            return len(nodes)-1

    def insert_op(name):
        nodes.append({"name": name})
        return len(nodes)-1

    for item in p:
        n_op = insert_op(item.edge.name)
        edges.extend([
            {"source": n_op, "target": insert_node(item.prop1.name)},
            {"source": n_op, "target": insert_node(item.prop2.name)},
            ])
        if item.prop3:
            edges.append({"source": n_op, "target": insert_node(item.prop3.name)})

    response_data = {'nodes': nodes, 'links': edges}
    return HttpResponse(json.dumps(response_data), content_type="application/json")
