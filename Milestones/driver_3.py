import os
import csv
import glob
import string
import numpy as np
from scipy.sparse import csr_matrix, lil_matrix
from sklearn.linear_model import SGDClassifier
import pickle
import pandas as pd

train_path = "./aclImdb/train/" # source data
# test_path = "./imdb_te.csv" # test data for grade evaluation. 

# transfrom a line into a processed word list
deleteFile = open('./stopwords.en.txt')
content = deleteFile.readlines()
wordList = [x.strip() for x in content] 
myPunc = ["'t","'s","'m", "'re", "<br />"]

def save_sparse_csr(filename,array):
	np.savez(filename, data = array.data ,indices=array.indices,
			 indptr =array.indptr, shape=array.shape )

def load_sparse_csr(filename):
	loader = np.load(filename)
	return csr_matrix((  loader['data'], loader['indices'], loader['indptr']),
						 shape = loader['shape'])

def lineProcess( line ):

	line = line.lower()
	for wordC in myPunc:
		line = line.replace(wordC,"")
	for wordC in string.punctuation:
		line= line.replace(wordC,"")
	line = line.split()

	for wordA in wordList:
		for wordB in line:
			if wordB == wordA:
				line.remove(wordB)
	return line

def unigram( line, indptr, indices, data, vocabulary, docu) :
	a = set()
	for term in line:
		if term in vocabulary:
			index = vocabulary[term]
		else:
			index = len(vocabulary)
			vocabulary[term] = index
			docu[index] = 0
		a.add(index)
		indices.append(index)
		data.append(1)
	indptr.append(len(indices))
	for ind in a:
		docu[ind] = docu[ind] + 1

def unigramtest( line, indptr, indices, data, vocabulary, docu) :
	a = set()
	for term in line:
		if term in vocabulary:
			index = vocabulary[term]
			a.add(index)
			indices.append(index)
			data.append(1)
	indptr.append(len(indices))
	for ind in a:
		docu[ind] = docu[ind] + 1

def bigram( line, indptr, indices, data, vocabulary, docu ) :
	a = set()
	for i in range( len(line)- 1 ):
		if (line[i],line[i+1]) in vocabulary:
			index = vocabulary[(line[i],line[i+1])]
		else:
			index = len(vocabulary)
			vocabulary[(line[i],line[i+1])] = index
			docu[index] = 0
		a.add(index)
		indices.append(index)
		data.append(1)
	indptr.append(len(indices)) 
	for ind in a:
		docu[ind] = docu[ind] + 1

def bigramtest( line, indptr, indices, data, vocabulary, docu ) :
	a = set()
	for i in range( len(line)- 1 ):
		if (line[i],line[i+1]) in vocabulary:
			index = vocabulary[(line[i],line[i+1])]
			a.add(index)
			indices.append(index)
			data.append(1)
	indptr.append(len(indices)) 
	for ind in a:
		docu[ind] = docu[ind] + 1

# tr.csv, dictionary is produced in this process
def train12(inpath):
	indptr = [0]
	indices = []
	data = []
	vocabulary = {}
	docu = {}

	indptr2 = [0]
	indices2 = []
	data2 = []
	vocabulary2 = {}
	docu2 = {}

	outFile = open('./imbd_tr.csv', 'a')
	writer = csv.writer(outFile)
	writer.writerow(["text"])

	j = 0
	for eachTxt in sorted( glob.glob(os.path.join(inpath + "pos", '*.txt')) ):
		inFile = open( eachTxt , 'r', encoding = "ISO-8859-1")
		line = inFile.readline().lower()
		writer.writerow([line])
	
		line = lineProcess( line )
		
		# unigram
		unigram( line, indptr, indices, data, vocabulary, docu)

		#bigram
		bigram( line, indptr2, indices2, data2, vocabulary2, docu2)

		inFile.close()
		print("train12", j)
		j = j+1

	for eachTxt in sorted( glob.glob(os.path.join(inpath + "neg", '*.txt')) ):
		inFile = open( eachTxt , 'r', encoding = "ISO-8859-1")
		line = inFile.readline().lower()

		writer.writerow([line])

		line = lineProcess( line )
		# unigram		
		unigram( line, indptr, indices, data, vocabulary, docu)
		#bigram
		bigram( line, indptr2, indices2, data2, vocabulary2, docu2)

		inFile.close()
		print("train12", j)
		j = j + 1
	
	return ( vocabulary, docu, csr_matrix((data, indices, indptr), dtype=int), vocabulary2, docu2, csr_matrix( (data2, indices2, indptr2), dtype=int) )

def test12(inpath, vocabulary, vocabulary2 ):
	inFile = open( inpath, 'r', encoding = "ISO-8859-1")
	reader = csv.reader(inFile)
	vocLen1 = len(vocabulary)
	print(vocLen1)
	vocLen2 = len(vocabulary2)
	#unigram
	indptr = [0]
	indices = []
	data = []
	docu = np.zeros(vocLen1)
	#bigram
	indptr2 = [0]
	indices2 = []
	data2 = []
	docu2 = np.zeros(vocLen2)
	
	j = 0
	for row in reader:
		print("test12", j)
		if j!= 0:
			line = lineProcess( row[1] )
			#unigram
			unigramtest( line, indptr, indices, data, vocabulary, docu)
			#bigram
			bigramtest( line, indptr2, indices2, data2, vocabulary2, docu2)
		j = j + 1

	inFile.close()
	return ( docu, csr_matrix((data, indices, indptr), dtype=int,  shape=(25000, vocLen1) ), docu2, csr_matrix((data2, indices2, indptr2), dtype=int,  shape=(25000, vocLen2)) )

def for34( df, xTrain ):
	print("34")
	xTrain[np.nonzero(xTrain)] = np.log( xTrain[np.nonzero(xTrain)] ) + 1
	# tf = 1 + np.log( xTrain1 )
	# tf[ np.isinf(tf) ] = 0
	docN = 25000
	vocN = df.shape[0]
	df[np.nonzero(df)] = np.log( docN / df[np.nonzero(df)] )
	idf = lil_matrix((vocN,vocN))
	idf.setdiag(df)
	print(xTrain.shape)
	print(idf.shape)
	xTrain3 = xTrain * idf
	print(xTrain3.shape)
	return xTrain3


def init():
	with open('clf1.pickle', 'rb') as handle:
		clf1 = pickle.load(handle)
	with open('clf2.pickle', 'rb') as handle:
		clf2 = pickle.load(handle)

	with open('dictionary1.pickle', 'rb') as handle:
		voc1 = pickle.load(handle)
	with open('dictionary2.pickle', 'rb') as handle:
		voc2 = pickle.load(handle)
	return clf1,clf2,voc1,voc2

def giveSign( clf2, voc2, row ):
	line = lineProcess(row)
	data = np.zeros( len( voc2 ) )
	for term in line:
		if term in voc2:
			data[voc2[term]] = data[voc2[term]] + 1
	return clf2.predict(data)




if __name__ == "__main__":
	
	# save pickles
	(voc1, docu1, xTrain1, voc2, docu2, xTrain2 )= train12(train_path)
	# save_sparse_csr("xTrain1.npz", xTrain1)
	# save_sparse_csr("xTrain2.npz", xTrain2)
	with open('dictionary1.pickle', 'wb') as handle:
		pickle.dump(voc1, handle, protocol=pickle.HIGHEST_PROTOCOL)
	with open('dictionary2.pickle', 'wb') as handle:
		pickle.dump(voc2, handle, protocol=pickle.HIGHEST_PROTOCOL)
	# with open('docu1.pickle', 'wb') as handle:
	# 	pickle.dump(docu1, handle, protocol=pickle.HIGHEST_PROTOCOL)
	# with open('docu2.pickle', 'wb') as handle:
	# 	pickle.dump(docu2, handle, protocol=pickle.HIGHEST_PROTOCOL)

	#open pickles
	# with open('dictionary1.pickle', 'rb') as handle:
	# 	voc1 = pickle.load(handle)
	# with open('dictionary2.pickle', 'rb') as handle:
	# 	voc2 = pickle.load(handle)
	# with open('docu1.pickle', 'rb') as handle:
	# 	docu1 = pickle.load(handle)
	# with open('docu2.pickle', 'rb') as handle:
	# 	docu2 = pickle.load(handle)
	# xTrain1 = load_sparse_csr("xTrain1.npz")
	# xTrain2 = load_sparse_csr("xTrain2.npz")

	# df1 = pd.Series(docu1).values 
	# df2 = pd.Series(docu2).values 

	# xTrain3 = for34(df1, xTrain1)
	# xTrain4 = for34(df2, xTrain2)

	yTrain = np.concatenate( [ np.ones(12500), np.zeros(12500) ] )

	# save pickles

	# (dftest1, xTest1, dftest2, xTest2 ) = test12( test_path, voc1, voc2)

	# with open('dftest1.pickle', 'wb') as handle:
	# 	pickle.dump(dftest1, handle, protocol=pickle.HIGHEST_PROTOCOL)
	# with open('dftest2.pickle', 'wb') as handle:
	# 	pickle.dump(dftest2, handle, protocol=pickle.HIGHEST_PROTOCOL)
	# with open('xTest1.pickle', 'wb') as handle:
	# 	pickle.dump(xTest1, handle, protocol=pickle.HIGHEST_PROTOCOL)
	# with open('xTest2.pickle', 'wb') as handle:
	# 	pickle.dump(xTest2, handle, protocol=pickle.HIGHEST_PROTOCOL)

	#open pickles
	# with open('dftest1.pickle', 'rb') as handle:
	# 	dftest1 = pickle.load(handle)
	# with open('dftest2.pickle', 'rb') as handle:
	# 	dftest2 = pickle.load(handle)
	# with open('xTest1.pickle', 'rb') as handle:
	# 	xTest1= pickle.load(handle)
	# with open('xTest2.pickle', 'rb') as handle:
	# 	xTest2 = pickle.load(handle)

	# xTest3 = for34(dftest1, xTest1)
	# xTest4 = for34(dftest2, xTest2)

	clf1 = SGDClassifier(loss = 'hinge', penalty = 'l2' )
	clf1.fit(xTrain1, yTrain)

	clf2 = SGDClassifier(loss = 'hinge', penalty = 'l2' )
	clf2.fit(xTrain2, yTrain)

	# clf3 = SGDClassifier(loss = 'hinge', penalty = 'l2' )
	# clf3.fit(xTrain3, yTrain)

	# clf4 = SGDClassifier(loss = 'hinge', penalty = 'l2' )
	# clf4.fit(xTrain4, yTrain)

	with open('clf1.pickle', 'wb') as handle:
		pickle.dump(clf1, handle, protocol=pickle.HIGHEST_PROTOCOL)
	with open('clf2.pickle', 'wb') as handle:
		pickle.dump(clf2, handle, protocol=pickle.HIGHEST_PROTOCOL)
	# with open('clf3.pickle', 'wb') as handle:
	# 	pickle.dump(clf3, handle, protocol=pickle.HIGHEST_PROTOCOL)
	# with open('clf4.pickle', 'wb') as handle:
	# 	pickle.dump(clf4, handle, protocol=pickle.HIGHEST_PROTOCOL)

	print("end")


	# outFile1 = open('./unigram.output.txt', 'a')
	# outFile2 = open('./bigram.output.txt', 'a')
	# outFile3 = open('./unigramtfidf.output.txt', 'a')
	# outFile4 = open('./bigramtfidf.output.txt', 'a')
	
	# for row in xTest1:
	# 	outFile1.write( str( int( clf1.predict(row)[0] )) + '\n' )
	# for row in xTest2:
	# 	outFile2.write( str( int( clf2.predict(row)[0] ) )+ '\n' )
	# for row in xTest3:
	# 	outFile3.write( str( int( clf3.predict(row)[0]) ) + '\n' )
	# for row in xTest4:
	# 	outFile4.write( str( int( clf4.predict(row)[0] ) ) + '\n' )

	# outFile1.close()
	# outFile2.close()
	# outFile3.close()
	# outFile4.close()
