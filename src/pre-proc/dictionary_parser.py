alphabets = set()
words = set()

with open("../../public/Ramanusa Nootranthathi - 06May25.txt", "r") as f:
    for line in f:
        line = line.strip()
        if len(line) == 1:
            continue
        for char in line:
            alphabets.add(char.strip().lower())
        for word in line.split(" "):
            words.add(word.strip().lower())

print(len(alphabets), alphabets)
alphabets = list(alphabets)
alphabets.sort()
print(len(alphabets), alphabets)

with open("../../public/Ranu-full.txt", "w") as f:
    for word in words:
        f.write(word+"\n")

with open("../../public/Ranu-alphabets.txt", "w") as f:
    for alphabet in alphabets:
        f.write(alphabet+"\n")
