module.exports = {
  // https://github.com/okonet/lint-staged#example-run-tsc-on-changes-to-typescript-files-but-do-not-pass-any-filename-arguments
  'src/**/*.ts': () => 'tsc --noEmit', 
  '*.ts': ['eslint --fix', 'prettier --write'],
}
