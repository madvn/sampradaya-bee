alphabets = set()

with open("../../public/Ranu-dictionary.txt", "r") as f:
    for line in f:
        line = line.strip()
        for char in line:
            alphabets.add(char.strip().lower())


print(len(alphabets), alphabets)
alphabets = list(alphabets)
alphabets.sort()
print(len(alphabets), alphabets)

with open("../../public/tamil-alphabets.txt", "w") as f:
    for alphabet in alphabets:
        f.write(alphabet+"\n")