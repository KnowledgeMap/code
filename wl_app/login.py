# -*- coding: utf-8 -*- 
import json,os
from django.http import HttpResponse
import DataBase

'''
Created on 2015-01-28
@author: whenlove
 --- happy birthday 亮亮 ---
'''

db = DataBase.DataBase()

def login(request):
    '''
    用户登陆
    ''' 
    username = request.REQUEST['username']
    password = request.REQUEST['pass']
    sql = """
        select  *
        from    m_user_info
        where   username = '%s'
        and     password = '%s'
        and     state = '0'
    """%(str(username),str(password))
    sql_result = db.doquery(sql)
    
    result = {}
    if(len(sql_result)>0):
        result['email'] = sql_result[0]['email']
        request.session["name"] = sql_result[0]['username']
        #request.session.set_expiry(7200)
        result['flag'] = 'succeed'
    else:
        result['flag'] = 'fault' 
    return HttpResponse(json.dumps(result))
