'''This module contains plenty of frequently used function which accelerate calculating.

@author: Lambdell
'''

def __memory__(func):
    cache = {}
    def decorator(*args, **kargs):
        cache[args] = func(*args, **kargs)
        return cache[args]
    return decorator

@__memory__
def add(a, b):
    return a + b

@__memory__
def power(a, b):
    assert b >= 0
    if b == 0:
        return 1
    else:
        ans = pow(a, b / 2)
        if b % 2 == 0:
            return ans * ans
        else:
            return ans * ans * a
        
# print power(2, -1)

# print power(2, 100)
# print add(2, 100)
# 
# print power(2, 100)
# print add(2, 100)
