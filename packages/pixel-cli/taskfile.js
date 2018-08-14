export async function compile(task) {
  await task.parallel(['bin', 'server', 'build', 'lib', 'copy'])
}

export async function bin(task, opts) {
  await task
    .source(opts.src || 'bin/*')
    .babel()
    .target('dist/bin', { mode: '0755' })
}

export async function lib(task, opts) {
  await task
    .source(opts.src || 'lib/**/*.js')
    .babel()
    .target('dist/lib')
}

export async function server(task, opts) {
  await task
    .source(opts.src || 'server/**/*.js')
    .babel()
    .target('dist/server')
}

export async function build(task, opts) {
  await task
    .source(opts.src || 'build/**/*.js')
    .babel()
    .target('dist/build')
}

export async function copy(task, opts) {
  await task.source(opts.src || 'index.html').target('dist')
}

export default async function(task) {
  await task.start('compile')
  await task.watch('bin/*', 'bin')
  await task.watch('index.html', 'copy')
  await task.watch('server/**/*.js', 'server')
  await task.watch('build/**/*.js', 'build')
  await task.watch('lib/**/*.js', 'lib')
}
