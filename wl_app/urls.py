from django.conf.urls import patterns, include, url

urlpatterns = patterns('',

    url(r'^login/$', 'wl_app.login.login'),
)
