'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')


class LoginController {

  showLoginForm ({ view }) {
    return view.render('auth.login')
  }

  async login ({ request, auth, session, response }) {
    // get form data
    const { email, password, remember } = request.all()

    // retrieve user base on the form data
    const user = await User.query().where('email', email).first()
    if (user) {
      if (user.is_active) {
        // verify password
        const passwordVerified = await Hash.verify(password, user.password)

        if (passwordVerified) {
          // login user
          await auth.remember(!!remember).login(user)

          return response.route('home')
        }

        session.flash({
          notification: {
            type: 'negative',
            message: 'Mot de passe incorrect'
          }
        })

        return response.redirect('back')
      }

      session.flash({
        notification: {
          type: 'negative',
          message: 'Veuillez confirmer votre adresse Email'
        }
      })

      return response.redirect('back')
    }

    session.flash({
      notification: {
        type: 'negative',
        message: 'Adresse email incorrecte'
      }
    })

    return response.redirect('back')
  }
}

module.exports = LoginController
