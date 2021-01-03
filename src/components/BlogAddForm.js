import React from 'react'
const BlogAddForm = ({ createBlog, title, setTitle, author, setAuthor, url, setUrl, id }) => {

  const handleAddBlog = (event) => {
    event.preventDefault()
    console.log('Creating new blog with:')
    console.log('Author:', author)
    console.log('Title:', title)
    console.log('Url:', url)

    createBlog({
      title,
      author,
      url
    })
  }

  return (
    <form id={id} onSubmit={handleAddBlog}>
      <h2>Create new</h2>
      <div>
        title:
        <input
          id="blog-add-form__title"
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          id="blog-add-form__author"
          type="text"
          value={author}
          name="title"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          id="blog-add-form__url"
          type="text"
          value={url}
          name="title"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button id="blog-add-form__submit" type="submit">create</button>
    </form>)
}

export default BlogAddForm