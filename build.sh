ng build
cp src/manifest.webapp dist/
cd dist/
zip -x \*.js.map -r idsr-report.zip .
cd ..
