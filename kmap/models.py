# -*- coding: utf-8-*-
from django.db import models
from django.contrib.auth.models import User
import datetime


class Proposition(models.Model):
    name = models.CharField(u'名称', max_length=100)
    desc = models.TextField(u'简介', max_length=500, null=True, blank=True)

    def __unicode__(self):
        return u'%s--%s' %(self.id, self.name)


class Relation(models.Model):  # edge
    name = models.CharField(u'名称', max_length=100, primary_key=True)
    desc = models.TextField(u'简介', max_length=500, null=True, blank=True)

    def __unicode__(self):
        return u'%s-%s' %(self.id, self.name)


class MyKnown(models.Model):
    owner = models.ForeignKey(User)
    known = models.ForeignKey(Proposition)
    timestamp = models.DateTimeField(u'时间', default=datetime.datetime.now)

    class Meta:
        ordering = ['known', '-timestamp']

    def __unicode__(self):
        return u'%s-%s' % (self.owner, self.known)


class kGraph(models.Model):
    relation = models.ForeignKey(Relation)
    target = models.ForeignKey(Proposition, related_name='target')
    s1 = models.ForeignKey(Proposition, related_name='source_1')
    s2 = models.ForeignKey(Proposition, related_name='source_2', null=True, blank=True)
    editor = models.ForeignKey(User)
    timestamp = models.DateTimeField(u'时间', default=datetime.datetime.now)

    def __unicode__(self):
        if self.s2:
            return u'%s(%s, %s, %s)' % (self.relation, self.s1, self.s2, self.target)
        else:
            return u'%s(%s, %s)' % (self.relation, self.s1, self.target)
