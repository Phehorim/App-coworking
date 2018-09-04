let events = undefined
let coworkingEvents = []
let officeEvents = []
let roomEvents = []
let notPaidEvents = []
let partiallyPaidEvents = []

fetch('http://localhost:3333/admin/data/schedule')
  .then(response => response.json())
  .then(data => {
    events = data
    displayCallendar()
  })

function displayCallendar() {
  $('.ui.active.loader').removeClass('active')
  $('#calendar').fullCalendar({
    weekends: false,
    locale: 'fr',
    displayEventTime: false,
    events: events
  })
  events.forEach(event => {
    if (event.type === 'coworking') {
      coworkingEvents.push(event)
    }
  })
  events.forEach(event => {
    if (event.type === 'office') {
      officeEvents.push(event)
    }
  })
  events.forEach(event => {
    if (event.type === 'room') {
      roomEvents.push(event)
    }
  })
  events.forEach(event => {
    if (event.paid === 'not') {
      notPaidEvents.push(event)
    }
  })
  events.forEach(event => {
    if (event.paid === 'partially') {
      partiallyPaidEvents.push(event)
    }
  })
}



$('#coworking').on('click', () => {
  $('#calendar').fullCalendar('removeEvents')
  $('#calendar').fullCalendar('addEventSource', coworkingEvents)
})

$('#office').on('click', () => {
  $('#calendar').fullCalendar('removeEvents')
  $('#calendar').fullCalendar('addEventSource', officeEvents)
})

$('#room').on('click', () => {
  $('#calendar').fullCalendar('removeEvents')
  $('#calendar').fullCalendar('addEventSource', roomEvents)
})

$('#all').on('click', () => {
  $('#calendar').fullCalendar('removeEvents')
  $('#calendar').fullCalendar('addEventSource', events)
})

$('#notPaid').on('click', () => {
  $('#calendar').fullCalendar('removeEvents')
  $('#calendar').fullCalendar('addEventSource', notPaidEvents)
})

$('#partiallyPaid').on('click', () => {
  $('#calendar').fullCalendar('removeEvents')
  $('#calendar').fullCalendar('addEventSource', partiallyPaidEvents)
})
