# encoding: utf-8

import re
from NiceToMeetYouToo import display

def tokenize(string):
    m = re.match(ur'(?P<func>\d+)\((?P<A>\w),(?P<B>\w),(?P<C>\w)\)', string)
    return (m.group('func'), [m.group('A'), m.group('B'), m.group('C')])

def parse(string):
    ans = string.split(' ')
#     print ans
    a, b, c = map(tokenize, ans)
    print 'display: '
    display(a, b)
    print '\nc: ', c, '\n'

with open('dataunit1.txt') as handle:
    for line in handle:
        if re.match(ur'\S', line) != None:
#             print line
            try:
                parse(line.strip()) 
            except:
                pass
