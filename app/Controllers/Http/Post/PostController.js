'use strict'

const Post = use('App/Models/Post')
const Helpers = use('Helpers')
const { validate } = use('Validator')
const moment = require('moment')


class PostController {

  async index({ view }) {

    const posts = await Post.all()

    return view.render('posts.index', {
      posts: posts.toJSON()
    })
  }

  async details({ params, view }) {

    const post = await Post.find(params.id)

    return view.render('posts.details', {
      post: post
    })
  }

  async add({ view }) {
    return view.render('posts.add')
  }

  async store({ request, response, session }) {

    const validation = await validate(request.all(), {
      title: 'required|min:3|max:100',
      body: 'required|min:5'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const post = new Post()

    post.title = request.input('title')
    post.body = request.input('body')

    //upload process
    const fileToUpload = request.file('image', {
      types: ['image'],
      maxSize: '2mb'
    })

    const imageName = `${moment()}.${fileToUpload.subtype}`

    post.imgUrl = `uploads/${imageName}`

    await fileToUpload.move(Helpers.publicPath('uploads'), {
      name: imageName
    })

    if (!fileToUpload.moved()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    await post.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Post ajouté'
      }
    })

    return response.redirect('/posts')
  }

  async edit({ params, view }) {
    const post = await Post.find(params.id)

    return view.render('posts.edit', {
      post: post
    })
  }

  async update({ params, request, response, session }) {
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:100',
      body: 'required|min:5'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const post = await Post.find(params.id)

    post.title = request.input('title')
    post.body = request.input('body')

    //upload process
    const fileToUpload = request.file('image', {
      types: ['image'],
      maxSize: '2mb'
    })

    const imageName = `${moment()}.${fileToUpload.subtype}`

    post.imgUrl = `uploads/${imageName}`

    await fileToUpload.move(Helpers.publicPath('uploads'), {
      name: imageName
    })

    if (!fileToUpload.moved()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    await post.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Post modifié'
      }
    })

    return response.redirect('/posts')
  }

  async destroy({ params, session, response }) {
    const post = await Post.find(params.id)

    //delete the post
    await post.delete()


    session.flash({
      notification: {
        type: 'success',
        message: 'Post supprimé'
      }
    })

    return response.redirect('/posts')
  }
}

module.exports = PostController
