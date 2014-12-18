# -*- coding: utf-8-*-
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from kmap.models import kGraph

import json

def home(request):
    content = dict()
    return render_to_response('home.html', RequestContext(request, content))
def edit(request):
	content = dict()
	return render_to_response('edit.html', RequestContext(request, content))
def help(request):
	content = dict()
	return render_to_response('help.html', RequestContext(request, content))

def get_algorithm(request):
    response_data = [
            {'name': 'net', 'url': '/kmap/net/', 'brief': 'default algorithm'},
            {'name': 'net2', 'url': '/kmap/net2/', 'brief': 'detail relationship with operators'},
            {'name': 'net3', 'url': '/kmap/net3/', 'brief': 'net without operators'},
            ]
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def get_net(request):
    return get_net2(request)


def get_net1(request):
    p = kGraph.objects.all()
    nodes = []
    edges = []

    def insert_node(name, group=1):
        content = {"id": name}
        if content in nodes:
            return nodes.index(content)
        else:
            nodes.append(content)
            return len(nodes)-1

    def insert_op(opid, name):
        nodes.append({"id": '%s-%s' % (opid, name)})
        return len(nodes)-1

    for item in p:
        insert_op(item.id, item.edge.name)
        insert_node(item.prop1.name)
        insert_node(item.prop2.name)
        edges.extend([
            {"source": '%s-%s' % (item.id, item.edge.name),"target": item.prop1.name},
            {"source": '%s-%s' % (item.id, item.edge.name),"target": item.prop2.name},
            ])
        if item.prop3:
            insert_node(item.prop3.name)
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


def get_net3(request):
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

    for item in p:
        n1 = insert_node(item.prop1.name)
        n2 = insert_node(item.prop2.name)
        edges.append({"source": n1, "target": n2})
        if item.prop3:
            n3 = insert_node(item.prop3.name)
            edges.extend([
                {"source": n1, "target": n3},
                {"source": n2, "target": n3}
                ])

    response_data = {'nodes': nodes, 'links': edges}
    return HttpResponse(json.dumps(response_data), content_type="application/json")

