import fusion
import json

def tokenize(rstring):
    retval = rstring.strip().split('_')
    return (retval[0], retval[1:])

def parse(links):
    return map(lambda link:tokenize(link['path']), links)

def encodeToken((func, args)):
    for arg in args:
        func += '_' + arg
    return func

def encodeGraph(links):
    retval = []
    for link in links:
        retval.append({'path':link})
    return json.dumps(retval)
# print tokenize('1001_a_b')

def fuse(olds, addition):
    retval = []
    addition = tokenize(addition)
    for old in parse(olds):
        retval += fusion.fuse(old, addition)
    
    return encodeGraph(list(set(map(encodeToken, retval))))
    
# data = json.load(open('data.json'))
# nodes, links = data['nodes'], data['links']
# 
# print links
# 
# print fuse(links, '1011_A_B')
