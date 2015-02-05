from django.conf.urls import patterns, url
from django.contrib.auth.views import login, logout
from accounts.views import *

urlpatterns = patterns('',
                       #    url(r'^login$', login,
                       #       {"template_name": 'login.html'}),
                       #    url(r'^logout$', page_logout),
                       #   url(r'^reg$', login,
                       #       {"template_name": 'reg.html'}),
    url(r'^login$',login,name="login"),
    url(r'^reg$',reg, name="reg"),
)

#urlpatterns += patterns('accounts.views',
#    url(r'^$', 'profile'),
#    url(r'^profile$', 'profile'),
#)
