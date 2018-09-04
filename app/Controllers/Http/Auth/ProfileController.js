'use strict'

const { validateAll } = use('Validator')
const Booking = use('App/Models/Booking')
const moment = require('moment')


class ProfileController {

  async profile({ view, auth }) {
    const user = await auth.getUser()
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

    return view.render('auth.profile', {
      bookings: bookings.reverse(),
      betterNumber: betterNumber
    })
  }

  async update({ auth, request, session, response}) {

    //validate form inputs
    const validation = await validateAll(request.all(), {
      firstname: 'required',
      lastname: 'required',
      phone_number: 'required|min:10|max:10',
      address: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages())

      session.flash({
        notification: {
          type: 'negative',
          message: 'Tous les champs doivent être remplis, le numero de téléphone doit comporter 10 chiffres et aucun espace'
        }
      })

      return response.redirect('back')
    }

    const user = await auth.getUser()

    user.firstname = await request.input('firstname')
    user.lastname = await request.input('lastname')
    user.address = await request.input('address')
    user.phone_number = await request.input('phone_number')

    await user.save()

    return response.redirect('back')
  }
}

module.exports = ProfileController
