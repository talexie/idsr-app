ng build --prod=true
cp src/manifest.webapp dist/
cd dist/
zip -x \*.js.map -r idsr-app.zip .
cd ..
