'use strict'

class AdminOnly {
  async handle ({ request, auth, response }, next) {

    const user = await auth.getUser()

    if (!user.is_admin) {
      return response.redirect('/')
    }
    await next()
  }
}

module.exports = AdminOnly
