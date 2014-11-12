from django.http import HttpResponse
from django.contrib.auth.views import logout
from django.http import HttpResponseRedirect


def profile(request):
    return HttpResponse('profile page')

def page_logout(request):
    logout(request)
    return HttpResponseRedirect('/')
