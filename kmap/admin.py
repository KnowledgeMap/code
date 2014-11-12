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
    list_display = ('edge', 'prop1', 'prop2', 'prop3', 'editor')


admin.site.register(Proposition, PropositionAdmin)
admin.site.register(Relation, RelationAdmin)
admin.site.register(MyKnown, MyKnownAdmin)
admin.site.register(kGraph, kGraphAdmin)
