# -*- coding:UTF-8 -*- #
import MySQLdb
import MySQLdb.cursors  
'''
Created on 2012-05-02
@author: whenlove
'''

config = {
    'd_database': 'kmap',  
    'd_user': 'root',
    'd_password': 'probo11312',
    'd_host': '127.0.0.1',    
}

class DataBase:
    host, user, password, database, port ,charset= '', '', '', '', '', ''

    def __init__(self, host = '', user = '', password = '',database = '', port = 3306, charset="utf8"):
        """
        类初始化方法()
            __init__(host, user, password, database, port)
        """
        self.host, self.user, self.password, self.database ,self.port ,self.charset= config['d_host'], config['d_user'], config['d_password'], config['d_database'] , port, charset
        
    def getconn(self):
        """ 
        获得新数据库链接
            getconn(host, user, password, database, port)
        """
        conn = MySQLdb.connect(host = self.host, user = self.user, passwd = self.password, db = self.database, port= self.port, charset=self.charset)
        mydb = conn.cursor()
        return mydb

    def doquery_tuple(self, sql_str):
        """
        执行str 内容并返回查询结果
            doquery(sql_str)
        """
        conn = MySQLdb.connect(host = self.host, user = self.user, passwd = self.password, db = self.database, port= self.port, charset=self.charset)
        #获得数据库链接,设置主机地址/用户名/密码/库名称/编码格式.
        cur = conn.cursor() #获得 cursor(dict形式).
        cur.execute(sql_str) #通过cursor执行SQL语句.
        result = cur.fetchall() #获得数据库操作返回结果.
        cur.close()
        conn.close()
        return result #返回查询结果.
        
    def doquery(self, sql_str):
        """
        执行str 内容并返回查询结果
            doquery(sql_str)
        """
        conn = MySQLdb.connect(host = self.host, user = self.user, passwd = self.password, db = self.database, port= self.port, charset=self.charset)
        #获得数据库链接,设置主机地址/用户名/密码/库名称/编码格式.
        cur = conn.cursor(cursorclass = MySQLdb.cursors.DictCursor) #获得 cursor(dict形式).
        cur.execute(sql_str) #通过cursor执行SQL语句.
        result = cur.fetchall() #获得数据库操作返回结果.
        cur.close()
        conn.close()
        return result #返回查询结果.      

    def execsql(self,sql):
        '''
           简单执行单一的sql
        '''
        conn = MySQLdb.connect(host = self.host, user = self.user, passwd = self.password, db = self.database, port= self.port, charset=self.charset)
        cur = conn.cursor()
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        return True

    def execsqllist(self, sqllist):
        '''
            批量执行sql,sqllist是数组
            sqllist
            execsql(sqllist)
        '''
        conn = MySQLdb.connect(host = self.host, user = self.user, passwd = self.password, db = self.database, port= self.port, charset=self.charset)
        cur = conn.cursor()
        cur.execute('START TRANSACTION')
        for sql in sqllist:
            try:
                cur.execute(sql)
            except Exception, e:
                pass
                #utils.trace(e)
        cur.execute('COMMIT')
        cur.close()
        conn.close()
        return True
    
if __name__ == '__main__':
    import DataBase
    db = DataBase.DataBase()