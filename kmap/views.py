from django.shortcuts import render_to_response
from django.template import RequestContext

def home(request):
    content = dict()
    return render_to_response('home.html', RequestContext(request, content))
