''' Fusion module

@author: Lambdell
'''

import ymath

def __str__(func):
    '''decorator: [a] -> (+ str(a))'''
    def decorator(*args, **kargs):
        return str.join('', func(*args, **kargs))
    return decorator

@__str__
def yNot(a):
    '''str->str
    @return: !a'''
    return map(lambda a_i:a_i == '0' and '1' or '0', a)

# print yNot('10101')

@__str__
def yAnd(a, b):
    '''str->str->str
    @return: a&b'''
    return map(lambda a_i, b_i:(a_i == '1' and b_i == '1') and '1' or '0', a, b)

# print yAnd('1011', '0011')

@__str__
def yOr(a, b):
    '''str->str->str
    @return a|b'''
    return map(lambda a_i, b_i:(a_i == '1' or b_i == '1') and '1' or '0', a, b)

# print yOr('10101', '01010')

def normalizeByLength((func_a, args_a), (func_b, args_b)):
    '''(str,[str])->(str,[str])->((str,[str]),(str,[str]))
    unique the length of a and b, by doubling the length of each function and parameter'''
    args_a, as_a = args_a[:], frozenset(args_a)
    args_b, as_b = args_b[:], frozenset(args_b)
        
    func_a *= ymath.power(2, len(as_b - as_a))
    args_a += list(as_b - as_a)
    func_b *= ymath.power(2, len(as_a - as_b))
    args_b += list(as_a - as_b)
    
    while len(func_a) < len(func_b):
        func_a *= 2
    while len(func_a) > len(func_b):
        func_b *= 2
    
    return (func_a, args_a), (func_b, args_b)

# print normalizeByLength(('1011', ['a', 'b']), ('11101111', ['a', 'b', 'c']))

def swap2_1x2((func, args)):
    '''(str,[str])->(str,[str])
    swap the first and second parameter in 2-gram operator'''
    func = list(func)
    func[1], func[2] = func[2], func[1]
    args[0], args[1] = args[1], args[0]
    return str.join('', func), args

def swap3_1x2((func, args)):
    '''(str,[str])->(str,[str])
    swap the first and second parameter in 3-gram operator'''
    func = list(func)
    func[1], func[2] = func[2], func[1]
    func[5], func[6] = func[6], func[5]
    args[0], args[1] = args[1], args[0]
    return str.join('', func), args

def swap3_1x3((func, args)):
    '''(str,[str])->(str,[str])
    swap the first and third parameter in 3-gram operator'''
    func = list(func)
    func[1], func[4] = func[4], func[1]
    func[3], func[6] = func[6], func[3]
    args[0], args[2] = args[2], args[0]
    return str.join('', func), args

def swap3_2x3((func, args)):
    '''(str,[str])->(str,[str])
    swap the second and third parameter in 3-gram operator'''
    func = list(func)
    func[2], func[4] = func[4], func[2]
    func[3], func[5] = func[5], func[3]
    args[1], args[2] = args[2], args[1]
    return str.join('', func), args

def normalizeByOrder((func_a, args_a), (func_b, args_b)):
    '''(str,[str])->(str,[str])->((str,[str]),(str,[str]))
    equate parameters' order of boolean function a and b'''
    (func_a, args_a), (func_b, args_b) = normalizeByLength((func_a, args_a), (func_b, args_b))
    
    if len(args_a) == 2:
        if args_a[0] == args_b[1]:
            func_b, args_b = swap2_1x2((func_b, args_b))
    elif len(args_a) == 3:
        if args_a[0] == args_b[1]:
            func_b, args_b = swap3_1x2((func_b, args_b))
        if args_a[0] == args_b[2]:
            func_b, args_b = swap3_1x3((func_b, args_b))
        if args_a[1] == args_b[2]:
            func_b, args_b = swap3_2x3((func_b, args_b))

    return (func_a, args_a), (func_b, args_b)

'''standard operator of 2-gram and 3-gram'''

standard_2 = set(['1011', '1001'])
standard_3 = set(['11101111', '11101011', '11001011', '11100001', '11101001'])

def standardize((func, args), standard_2=standard_2, standard_3=standard_3):
    '''(str,[str])->set(str)->set(str)->(str,[str])
    convert function and parameter to standard function, ascribed above'''
    if len(args) == 2:
        for _ in range(2):
            if func in standard_2:
                break
            func, args = swap2_1x2((func, args))
    elif len(args) == 3:
        for _ in range(2):
#             print func, args
            if func in standard_3:
                break
            func, args = swap3_1x2((func, args))
#             print func, args
            if func in standard_3:
                break
            func, args = swap3_1x3((func, args))
#             print func, args
            if func in standard_3:
                break
            func, args = swap3_2x3((func, args))
    
    return func, args

def simplify((func, args)):
    '''(str,[str])->(str,[str])'''
    retval = []
    if len(args) == 3:
        
        func, args = standardize((func, args), [],
                                  ['10111011',
                                   '10011001',
                                   '10101011',
                                   '10001111',
                                   '10001011',
                                   '10000011',
                                   '11000001',
                                   '10000001']) 
        a, b, c = args
        
        if func == '10111011':
            retval.append(('1011', [a, b]))
        elif func == '10011001':
            retval.append(('1001', [a, b]))
        elif func == '10101011':
            retval.append(('1011', [a, b]))
            retval.append(('1011', [a, c]))
        elif func == '10001111':
            retval.append(('1011', [a, c]))
            retval.append(('1011', [b, c]))
        elif func == '10001011':
            retval.append(('1011', [a, b]))
            retval.append(('1011', [a, c]))
            retval.append(('1011', [b, c]))
        elif func == '10000011':
            retval.append(('1011', [a, b]))
            retval.append(('1011', [a, c]))
            retval.append(('1001', [b, c]))
        elif func == '11000001':
            retval.append(('1011', [b, a]))
            retval.append(('1011', [c, a]))
            retval.append(('1001', [b, c]))
        elif func == '10000001':
            retval.append(('1001', [a, b]))
            retval.append(('1001', [a, c]))
            retval.append(('1001', [b, c]))
        else:
            retval.append((func, args))
    else:
        retval.append((func, args))
    return retval

def fuse((func_a, args_a), (func_b, args_b)):
    as_a = frozenset(args_a)
    as_b = frozenset(args_b)
    if len(as_a & as_b) == 2:
        (func_a, args_a), (func_b, args_b) = normalizeByOrder((func_a, args_a), (func_b, args_b))
        return simplify(standardize((yAnd(func_a, func_b), args_a[:])))
    else:
        print 'ap'
        return map(lambda item:simplify(item)[0], ((func_a, args_a), (func_b, args_b)))

func_2 = ['1011', '1001']
args_2 = [['a', 'b'], ['b', 'a']]

func_3 = ['11101111', '11101011', '11001011', '11100001', '11101001']
args_3 = [['a', 'b', 'c'], ['a', 'c', 'b'], ['b', 'a', 'c'], ['b', 'c', 'a'], ['c', 'a', 'b'], ['c', 'b', 'a']]

data = zip(func_2, args_2) + zip(func_3, args_3)

def display((func_a, args_a), (func_b, args_b)):
    print func_a, args_a, ' + ', func_b, args_b
    print fuse((func_a, args_a), (func_b, args_b))

# for func_a in func_2:
#     for args_a in [['a', 'b']]:
#         for func_b, args_b in data:
#             display((func_a, args_a), (func_b, args_b))
#                  
# for func_a in func_3:
#     for args_a in [['a', 'b', 'c']]:
#         for func_b, args_b in data:
#             display((func_a, args_a), (func_b, args_b))
#              
# display(('1001', ['a', 'b']), ('1011', ['a', 'c']))
#   
# display(('11101011', ['a', 'b', 'c']), ('10111011', ['b', 'c', 'a']))
#   
# display(('11101011', ['a', 'b', 'c']), ('10111011', ['c', 'a', 'b']))
