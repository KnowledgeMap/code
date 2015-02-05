from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse

#def profile(request):
#    return HttpResponse('profile page')

#def page_logout(request):
#    logout(request)
#    return HttpResponseRedirect('/')

def login(request):
    content = {}
    return render_to_response('login.html', RequestContext(request, content));
def reg(request):
    content = {}
    return render_to_response('reg.html',RequestContext(request,content));
