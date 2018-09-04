'use strict'

const Post = use('App/Models/Post')


class NewsController {
  async showNews({ view }) {
    const posts = await Post.all()

    return view.render('posts.news', {
      posts: posts.toJSON().reverse()
    })
  }
}

module.exports = NewsController
