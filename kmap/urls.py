from django.conf.urls import patterns, include, url

urlpatterns = patterns('',
    url(r'^net/$', 'kmap.views.get_net', name='net'),  # current default
    url(r'^net1/$', 'kmap.views.get_net1', name='net1'),
    url(r'^net2/$', 'kmap.views.get_net2', name='net2'),
)
