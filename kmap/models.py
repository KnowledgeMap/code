# -*- coding: utf-8-*-
from django.db import models
from django.contrib.auth.models import User
import datetime


class Proposition(models.Model):
    name = models.CharField(u'名称', max_length=100)
    desc = models.TextField(u'简介', max_length=500) 

    def __unicode__(self):
        return u'%s' %(self.name)


class Relation(models.Model):  # edge
    name = models.CharField(u'名称', max_length=100)
    desc = models.TextField(u'简介', max_length=500) 

    def __unicode__(self):
        return u'%s' %(self.name)


class MyKnown(models.Model):
    owner = models.ForeignKey(User)
    known = models.ForeignKey(Proposition)
    timestamp = models.DateTimeField(u'时间', default=datetime.datetime.now)

    class Meta:
        ordering = ['known', '-timestamp']

    def __unicode__(self):
        return u'%s-%s' % (self.owner, self.known)


class kGraph(models.Model):
    edge = models.ForeignKey(Relation)
    prop1 = models.ForeignKey(Proposition, related_name='prop1')
    prop2 = models.ForeignKey(Proposition, related_name='prop2')
    prop3 = models.ForeignKey(Proposition, related_name='prop3')
    editor = models.ForeignKey(User)
    timestamp = models.DateTimeField(u'时间', default=datetime.datetime.now)

    def __unicode__(self):
        if self.prop3:
            return u'%s(%s, %s, %s)' % (self.edge, self.prop1, self.prop2, self.prop3)
        else:
            return u'%s(%s, %s)' % (self.edge, self.prop1, self.prop2)

