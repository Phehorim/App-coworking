'use strict'

const User = use('App/Models/User')
const Booking = use('App/Models/Booking')
const Database = use('Database')
const moment = require('moment')


class AdminController {

  index({ view }) {
    return view.render('admin.index')
  }

  async userList({ view }) {
    const users = await User.query().where('is_admin', '0').fetch()

    return view.render('admin.users', {
      users: users.toJSON()
    })
  }

  async userProfile({ view, params }) {
    const user = await User.findBy('id', params.id)

    const bookings = await Booking.query().where('user_id', user.id)
    bookings.forEach(booking => {
      booking.start = moment(booking.start).subtract(1, 'day').format('YYYY-MM-DD')
      booking.end = moment(booking.end).subtract(1, 'day').format('YYYY-MM-DD')
    })

    const part1 = user.phone_number.slice(0, 2)
    const part2 = user.phone_number.slice(2, 4)
    const part3 = user.phone_number.slice(4, 6)
    const part4 = user.phone_number.slice(6, 8)
    const part5 = user.phone_number.slice(8, 10)

    const betterNumber = part1 + ' ' + part2 + ' ' + part3 + ' ' + part4 + ' ' + part5

    return view.render('admin.user_profile', {
      user: user,
      bookings: bookings.reverse(),
      betterNumber: betterNumber
    })
  }

  async isContractorToggle({ request, session, params, response }) {
    if (request.input('is_contractor') == 'true') {
      await Database.table('users').where('id', params.id).update('is_contractor', '1')
    } else {
      await Database.table('users').where('id', params.id).update('is_contractor', '0')
    }

    session.flash({
      notification: {
        type: 'success',
        message: 'La modification a bien été enregistré'
      }
    })

    return response.redirect('back')
  }

  schedule({ view }) {
    return view.render('admin.schedule')
  }

  async scheduleBookings() {
    const events = await Booking.all()
    return events
  }

  async bookingList({ view }) {
    const bookings = await Booking.query()
    bookings.reverse()

    return view.render('admin.booking-list', {
      bookings: bookings
    })
  }

  async bookingDetails({ params, view }) {

    const booking = await Booking.findBy('id', params.id)
    booking.start = moment(booking.start).subtract(1, 'day').format('DD-MM-YYYY')
    booking.end = moment(booking.end).subtract(1, 'day').format('DD-MM-YYYY')

    return view.render('admin.booking_details', {
      booking: booking
    })
  }

  async paidSwitch({ request, session, params, response }) {
    if (request.input('paid') == 'not') {
      await Database.table('bookings').where('id', params.id).update({paid: 'not', borderColor: 'red'})
    } else if (request.input('paid') == 'partially') {
      await Database.table('bookings').where('id', params.id).update({paid: 'partially', borderColor: 'yellow'})
    } else {
      await Database.table('bookings').where('id', params.id).update({paid: 'totally', borderColor: 'green'})
    }

    session.flash({
      notification: {
        type: 'success',
        message: 'La modification a bien été enregistré'
      }
    })

    return response.redirect('back')
  }
}

module.exports = AdminController
