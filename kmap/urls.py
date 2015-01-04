from django.conf.urls import patterns, include, url

urlpatterns = patterns('',

    url(r'^edit/$', 'kmap.views.edit', name = 'edit'),
    url(r'^help/$', 'kmap.views.help', name = 'help'),
    url(r'^admin/$', 'kmap.views.admin', name = 'admin'),

    url(r'^net/$', 'kmap.views.get_net', name='net'),  # current default
    url(r'^net1/$', 'kmap.views.get_net1', name='net1'),
    url(r'^net2/$', 'kmap.views.get_net2', name='net2'),
    url(r'^net3/$', 'kmap.views.get_net3', name='net3'),
    url(r'^result/$', 'kmap.views.get_result', name='result'),

    url(r'^ls-algorithm/$', 'kmap.views.get_algorithm', name='ls-algorithm'),  # current default
)
