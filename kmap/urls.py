from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^net/$', 'kmap.views.get_net', name='net'),
)
