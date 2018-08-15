export async function compile(task) {
  await task.parallel([
    'core',
    'ecs',
    'gfx',
    'io',
    'math',
    'sprite',
    'state',
    'utils',
  ])
}

export async function core(task, opts) {
  await task
    .source(opts.src || 'src/core/**/*.js')
    .babel()
    .target('core')
}

export async function ecs(task, opts) {
  await task
    .source(opts.src || 'src/ecs/**/*.js')
    .babel()
    .target('ecs')
}

export async function gfx(task, opts) {
  await task
    .source(opts.src || 'src/gfx/**/*.js')
    .babel()
    .target('gfx')
}

export async function io(task, opts) {
  await task
    .source(opts.src || 'src/io/**/*.js')
    .babel()
    .target('io')
}

export async function math(task, opts) {
  await task
    .source(opts.src || 'src/math/**/*.js')
    .babel()
    .target('math')
}

export async function sprite(task, opts) {
  await task
    .source(opts.src || 'src/sprite/**/*.js')
    .babel()
    .target('sprite')
}

export async function state(task, opts) {
  await task
    .source(opts.src || 'src/state/**/*.js')
    .babel()
    .target('state')
}

export async function utils(task, opts) {
  await task
    .source(opts.src || 'src/utils/**/*.js')
    .babel()
    .target('utils')
}

export default async function(task) {
  await task.start('compile')
  await task.watch('src/core/**/*.js', 'core')
  await task.watch('src/ecs/**/*.js', 'ecs')
  await task.watch('src/gfx/**/*.js', 'gfx')
  await task.watch('src/io/**/*.js', 'io')
  await task.watch('src/math/**/*.js', 'math')
  await task.watch('src/sprite/**/*.js', 'sprite')
  await task.watch('src/state/**/*.js', 'state')
  await task.watch('src/utils/**/*.js', 'utils')
}
