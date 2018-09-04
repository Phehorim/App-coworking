'use strict'

const moment = require('moment')
const Booking = use('App/Models/Booking')
const User = use('App/Models/User')
const Database = use('Database')
const { validateAll } = use('Validator')


class BookController {

  async index({ view }) {
    const users = await User.query().where('is_admin', '0').fetch()

    return view.render('admin.book', {
      users: users.toJSON()
    })
  }

  async booking({ auth, request, session, response }) {

    //validate form inputs
    const validation = await validateAll(request.all(), {
      type: 'required',
      duration: 'required',
      start: 'required'
    })

    if (validation.fails() || (!(request.input('lastname') || !request.input('firstname')) && !request.input('user_id'))) {
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
          message: 'Impossible de réserver en ligne le weekend'
        }
      })

      return response.redirect('back')
    }

    const type = request.input('type')
    let maxSeat = undefined
    let backgroundColor = ''

    //check if the type is correct and set maxSeat and backgroundColor based on it
    if (type == 'coworking') {
      maxSeat = 10
      backgroundColor = '#2185D0'
    } else if (type == 'office') {
      maxSeat = 2
      backgroundColor = '#6435C9'
    } else if (type == 'room') {
      maxSeat = 1
      backgroundColor = '#767676'
    } else {
      session.flash({
        notification: {
          type: 'negative',
          message: 'Une erreur a eu lieu'
        }
      })

      return response.redirect('back')
    }

    const start = moment(request.input('start')).add(1, 'day')
    let end = moment(request.input('start')).add(1, 'day')

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

    let user = undefined
    let lastname = undefined
    let firstname = undefined

    if (request.input('user_id')) {
      user = await User.find(request.input('user_id'))
      lastname = user.lastname
      firstname = user.firstname
    } else {
      user = await auth.getUser()
      lastname = request.input('lastname')
      firstname = request.input('firstname')
    }

    let half = ''
    if (request.input('which') == 'morning' && duration == 'half_day') {
      half = 'MATIN '
    } else if (request.input('which') == 'afternoon' && duration == 'half_day') {
      half = 'APRÈS-MIDI '
    }

    const title = half + firstname + ' ' + lastname
    const paid = request.input('paid')
    let borderColor = undefined

    if (paid == 'not') {
      borderColor = 'red'
    } else if (paid == 'partially') {
      borderColor = 'yellow'
    } else {
      borderColor = 'green'
    }

    //save de booking in database
    const booking = await Booking.create({
      user_id: user.id,
      title: title,
      duration: duration,
      type: type,
      backgroundColor: backgroundColor,
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD'),
      paid: paid,
      borderColor: borderColor
    })

    booking.url =  `/admin/booking/${booking.id}`
    await booking.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'La réservation a bien été enregistrée'
      }
    })

    return response.redirect('back')
  }

  async deleteBooking({ session, params, response}) {
    const booking = await Booking.find(params.id)

    await booking.delete()

    session.flash({
      notification: {
        type: 'success',
        message: 'La réservation a été supprimé'
      }
    })

    return response.redirect('/admin/schedule')
  }
}

module.exports = BookController
