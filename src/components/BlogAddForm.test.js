import React, { useState } from 'react'
import '@testing-library/jest-dom/extend-expect'
import {
  render,
  fireEvent
} from '@testing-library/react'
import BlogAddForm from './BlogAddForm'

test('form calls the event handler it received as props with the right details when a new blog is created', () => {

  const createBlog = jest.fn()
  // const createBlog = (...props) => {console.log('What?', ...props)}

  const Wrapper = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')


    return (
      <BlogAddForm
        createBlog = {createBlog}
        title = {title}
        setTitle = {setTitle}
        author = {author}
        setAuthor = {setAuthor}
        url = {url}
        setUrl = {setUrl}
      />
    )
  }

  const component = render(
    <Wrapper />
  )

  const form = component.container.querySelector('#blog-add-form')
  const titleInput = component.container.querySelector('#blog-add-form__title')
  const authorInput = component.container.querySelector('#blog-add-form__author')
  const urlInput = component.container.querySelector('#blog-add-form__url')

  fireEvent.change(titleInput, { target: { value: 'testing title' } })
  fireEvent.change(authorInput, { target: { value: 'testing author' } })
  fireEvent.change(urlInput, { target: { value: 'testing url' } })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: 'testing title',
    author: 'testing author',
    url: 'testing url'
  })
})