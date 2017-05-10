# inPut1 = open("input.txt","r"); 
# inPut1 = open("chinese.txt","r"); 
# inPut1 = open("german.txt","r"); 
# inPut1 = open("french.txt","r"); 
# inPut1 = open("japanese.txt","r"); 
# inPut1 = open("korean.txt","r"); 
# inPut1 = open("spanish.txt","r"); 
# inPut1 = open("greek.txt","r"); 
# inPut1 = open("thai.txt","r"); 
# inPut1 = open("italian.txt","r"); 
# inPut1 = open("hindi.txt","r"); 
# inPut1 = open("russian.txt","r"); 
inPut1 = open("portuguese.txt","r"); 
inPut2 = open("number.txt","r");
outPut = open("output.txt","a");


a = [];
for i in range(2477):
	a.append([inPut1.readline().rstrip('\n'), inPut2.readline().rstrip('\n')]);
	
outPut.write('"'+a[0][0]+'"'+':' + a[0][1]+','+'\n');
for i in range( 2476 ):
	if not a[i+1][0] == "":
		if not a[i+1] == a[i]:
			outPut.write('"'+a[i+1][0]+'"'+':' + a[i+1][1]+','+'\n');

a1 = []
for line in inPut1:
	a1.append(line);

print(a1)
