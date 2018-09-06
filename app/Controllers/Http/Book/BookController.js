'use strict'

const moment = require('moment')
const Booking = use('App/Models/Booking')
const { validateAll } = use('Validator')


class BookController {

  index({ view }) {
    return view.render('book.index')
  }

  async next({ request, auth, session, response }) {
    //validate form inputs
    const validation = await validateAll(request.all(), {
      type: 'required',
      duration: 'required',
      start: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages())

      session.flash({
        notification: {
          type: 'negative',
          message: 'Il manque des informations.'
        }
      })

      return response.redirect('back')
    }

    const startInput = moment(request.input('start'))
    const duration = request.input('duration')

    //prevent from weekend bookings
    if (startInput.day() == 6 || startInput.day() == 0) {

      session.flash({
        notification: {
          type: 'negative',
          message: 'Impossible de réserver en ligne le weekend, veuillez nous contacter'
        }
      })

      return response.redirect('back')
    }

    const type = request.input('type')
    let maxSeat = 0
    let backgroundColor = ''

    //check if the type is correct and set maxSeat and backgroundColor based on it
    if (type == 'coworking') {
      maxSeat = 10
      backgroundColor = '#2185D0'
    } else if (type == 'office') {
      maxSeat = 2
      backgroundColor ='#6435C9'
    } else if (type == 'room') {
      maxSeat = 1
      backgroundColor ='#767676'
    } else {
      session.flash({
        notification: {
          type: 'negative',
          message: 'Une erreur a eu lieu'
        }
      })

      return response.redirect('back')
    }

    let half = ''
    if (request.input('which') == 'morning' && duration == 'half_day') {
      half = 'MATIN '
    } else if (request.input('which') == 'afternoon' && duration == 'half_day') {
      half = 'APRÈS-MIDI '
    }

    const user = await auth.getUser()
    const title = half + user.firstname + ' ' + user.lastname
    const start = moment(request.input('start')).add(1, 'day')
    let end = moment(request.input('start')).add(1, 'day')

    //set end based on duration
    switch (duration) {
      case 'half_day':
        break;
      case 'day':
        break;
      case 'week':
        end.add(6, 'day')
        break;
      case 'month':
        end.add(1, 'month')
        break;
      default:
        session.flash({
          notification: {
            type: 'negative',
            message: 'Une erreur a eu lieu'
          }
        })
        return response.redirect('back')
    }

    //check disponibility
    const query = await Booking.query().where('type', type)
    let bookings = []
    query.forEach(booking => {
      const bookedStart = moment(booking.start)
      const bookedEnd = moment(booking.end)
      if ((start >= bookedStart && start <= bookedEnd) || (end >= bookedStart && end <= bookedEnd) || (start <= bookedStart && end >= bookedEnd)) {
        bookings.push(booking)
      }
    })

    if (bookings.length == maxSeat) {
      session.flash({
        notification: {
          type: 'negative',
          message: 'Il n\'y a plus de place disponible à la date souhaitée'
        }
      })

      return response.redirect('back')
    }

    session.put('userID', user.id)
    session.put('title', title)
    session.put('type', type)
    session.put('backgroundColor', backgroundColor)
    session.put('start', start.format('YYYY-MM-DD'))
    session.put('end', end.format('YYYY-MM-DD'))
    session.put('duration', duration)
    session.put('startInput', startInput.format('YYYY-MM-DD'))

    return response.redirect('book/next')
  }

  showNext({ session, view }) {

    return view.render('book.next', {
      type: session.get('type'),
      startInput: session.get('startInput'),
      duration: session.get('duration')
    })
  }

  async book({ request, session, response }) {

    //create the booking
    const booking = await Booking.create({
      user_id: session.get('userID'),
      title: session.get('title'),
      duration: session.get('duration'),
      type: session.get('type'),
      backgroundColor: session.get('backgroundColor'),
      start: session.get('start'),
      end: session.get('end'),
      paid: 'not',
      borderColor: 'red'
    })

    booking.url =  `/admin/booking/${booking.id}`
    await booking.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'La réservation a bien été enregistrée'
      }
    })

    return response.redirect('/book')
  }
}

module.exports = BookController
