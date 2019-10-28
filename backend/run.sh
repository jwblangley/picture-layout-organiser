export PORT_BASE=8008

echo "Evaluating absolute working directory"
wd=$(cat .config/directory.txt | envsubst)
echo "$wd" > ".config/absoluteDirectory.txt"

bash ./serveData.sh & node index.js &
