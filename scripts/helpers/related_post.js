/**
 * Butterfly
 * Related Posts
 * According the tag
 */

'use strict'

hexo.extend.helper.register('related_posts', function (currentPost, allPosts) {
  let relatedPosts = []
  const tagsData = currentPost.tags
  tagsData.length && tagsData.forEach(function (tag) {
    allPosts.forEach(function (post) {
      if (currentPost.path !== post.path && isTagRelated(tag.name, post.tags)) {
        const relatedPost = {
          title: post.title,
          path: post.path,
          cover: post.cover,
          cover_type: post.cover_type,
          weight: 1,
          updated: post.updated,
          created: post.date
        }
        const index = findItem(relatedPosts, 'path', post.path)
        if (index !== -1) {
          relatedPosts[index].weight += 1
        } else {
          relatedPosts.push(relatedPost)
        }
      }
    })
  })

  if (relatedPosts.length === 0) {
    return ''
  }
  let result = ''
  const hexoConfig = hexo.config
  const config = hexo.theme.config

  const limitNum = config.related_post.limit || 6
  const dateType = config.related_post.date_type || 'created'
  const headlineLang = this._p('post.recommend')

  relatedPosts = relatedPosts.sort(compare('weight'))

  if (relatedPosts.length > 0) {
    result += '<div class="relatedPosts">'
    result += `<div class="headline"><i class="fas fa-thumbs-up fa-fw"></i><span>${headlineLang}</span></div>`
    result += '<div class="relatedPosts-list">'

    for (let i = 0; i < Math.min(relatedPosts.length, limitNum); i++) {
      const cover = relatedPosts[i].cover || 'var(--default-bg-color)'
      const title = this.escape_html(relatedPosts[i].title)
      result += `<a href="${this.url_for(relatedPosts[i].path)}" title="${title}">`
      if (relatedPosts[i].cover_type === 'img') {
        result += `<img class="cover" src="${this.url_for(cover)}" alt="cover">`
      } else {
        result += `<div class="cover" style="background: ${cover}"></div>`
      }
      if (dateType === 'created') {
        result += `<div class="content is-center"><div class="date"><i class="far fa-calendar-alt fa-fw"></i> ${this.date(relatedPosts[i].created, hexoConfig.date_format)}</div>`
      } else {
        result += `<div class="content is-center"><div class="date"><i class="fas fa-history fa-fw"></i> ${this.date(relatedPosts[i].updated, hexoConfig.date_format)}</div>`
      }
      result += `<div class="title">${title}</div>`
      result += '</div></a>'
    }

    result += '</div></div>'
    return result
  }
})

function isTagRelated (tagName, tags) {
  return tags.some(tag => tag.name === tagName)
}

function findItem (arrayToSearch, attr, val) {
  return arrayToSearch.findIndex(item => item[attr] === val)
}

function compare (attr) {
  return (a, b) => b[attr] - a[attr]
}
