# -*- coding: utf-8-*-
from django.contrib import admin
from kmap.models import Proposition, Relation, MyKnown, kGraph


class PropositionAdmin(admin.ModelAdmin):
    list_display = ('name', 'desc')


class RelationAdmin(admin.ModelAdmin):
    list_display = ('name', 'desc')


class MyKnownAdmin(admin.ModelAdmin):
    list_display = ('owner', 'known')


class kGraphAdmin(admin.ModelAdmin):
    list_display = ('relation', 's1', 's2', 'target', 'editor')


admin.site.register(Proposition, PropositionAdmin)
admin.site.register(Relation, RelationAdmin)
admin.site.register(MyKnown, MyKnownAdmin)
admin.site.register(kGraph, kGraphAdmin)
