from django.conf.urls import patterns, url
from django.contrib.auth.views import login, logout

urlpatterns = patterns('',
    url(r'^login$', login,
        {"template_name": 'login.html'}),
    url(r'^logout$', logout,
        {"next_page": 'login'}),
)

urlpatterns += patterns('accounts.views',
    url(r'^$', 'profile'),
    url(r'^profile$', 'profile'),
)
