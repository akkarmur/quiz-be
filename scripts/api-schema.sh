yarn openapi-generator-cli generate -i api-docs/_openapi.json -g typescript-fetch -o src/domain/swagger

cd src/domain/swagger

find . -mindepth 1 -maxdepth 1 ! -name 'models' -exec rm -r {} +