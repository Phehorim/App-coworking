'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')



//Home Page
Route.on('/').render('main.index').as('home')


//Auth -- Register
Route.get('register', 'Auth/RegisterController.showRegisterForm').middleware(['authenticated'])
Route.post('register', 'Auth/RegisterController.register').as('register')
Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail')

//Auth -- Login
Route.get('login', 'Auth/LoginController.showLoginForm').middleware(['authenticated'])
Route.post('login', 'Auth/LoginController.login').as('login')

//Auth -- Logout
Route.get('logout', 'Auth/AuthenticatedController.logout')

//Auth -- Password Reset
Route.get('password/reset', 'Auth/PasswordResetController.showLinkRequestForm')
Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail')
Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm')
Route.post('password/reset/', 'Auth/PasswordResetController.reset')

//Auth -- Profile page
Route.get('profile', 'Auth/ProfileController.profile').middleware(['auth'])
Route.put('profile', 'Auth/ProfileController.update').middleware(['auth'])


Route.group(() => {
  //Admin section
  //schedule
  Route.get('schedule', 'Admin/AdminController.schedule')
  Route.get('data/schedule', 'Admin/AdminController.scheduleBookings')
  //users
  Route.get('users', 'Admin/AdminController.userList')
  Route.get('user/:id', 'Admin/AdminController.userProfile')
  Route.put('user/:id', 'Admin/AdminController.isContractorToggle')
  //bookings -- details
  Route.get('booking/:id', 'Admin/AdminController.bookingDetails')
  Route.get('bookings', 'Admin/AdminController.bookingList')
  Route.put('booking/pay/:id', 'Admin/AdminController.paidSwitch')
  Route.delete('booking/:id', 'Admin/BookController.deleteBooking')
  //bookings -- book
  Route.get('book', 'Admin/BookController.index')
  Route.post('book', 'Admin/BookController.booking')
}).prefix('admin').middleware(['admin'])


//Contact
Route.on('contact').render('main.contact')


//Redirect
Route.on('redirect').render('main.redirect')


//Gallery
Route.get('news', 'Post/NewsController.showNews')


//Book -- Book
Route.get('book', 'Book/BookController.index').middleware(['auth'])
Route.post('book', 'Book/BookController.next').middleware(['auth'])
Route.get('book/next', 'Book/BookController.showNext').middleware(['auth'])
Route.post('book/next', 'Book/BookController.book').middleware(['auth'])


//Posts
Route.group(() => {
  //Create
  Route.get('add', 'Post/PostController.add')
  Route.post('/', 'Post/PostController.store')
  //Read
  Route.get('/', 'Post/PostController.index')
  Route.get(':id', 'Post/PostController.details')
  //Update
  Route.get('edit/:id', 'Post/PostController.edit')
  Route.put(':id', 'Post/PostController.update')
  //Delete
  Route.delete(':id', 'Post/PostController.destroy')
}).prefix('posts').middleware(['admin'])
