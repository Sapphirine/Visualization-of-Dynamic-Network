from driver_3 import init, giveSign

clf1, clf2, voc1, voc2 = init()

row = "I am sad"
result = giveSign(clf2, voc2, row)
print(result)