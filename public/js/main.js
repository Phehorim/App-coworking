//enable semantic ui dropdown (menu, select)
$('.ui.dropdown').dropdown()
//enable semantic ui checkbox
$('.ui.checkbox').checkbox()
//enable semantic ui tab


$('#fake-submit').on('click', () => {
  $('.ui.modal').modal('show')
})
$('.ui.ok.button').on('click', () => {
  $('form').submit()
})

$('#toggle-button').on('click', () => {
  $('.ui.labeled.icon.sidebar')
  .sidebar('toggle')
})
