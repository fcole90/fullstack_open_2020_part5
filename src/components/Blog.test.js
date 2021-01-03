import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

const blogExample = {
  'likes': 999,
  'title': 'Test blog',
  'author': 'Test author',
  'url': 'http://testurl.blog.org',
  'user': {
    'blogs': ['many', 'test', 'blogs'],
    'username': 'jestTester',
    'name': 'Jest Tester',
    'id': '5fd4da2e75c39f4fac36a01f'
  },
  'id': '5fd640ca9c76c8148c4afbbe'
}

test('checks that a blog renders the title and author, but not url or likes', () => {
  const component = render(
    <Blog blog={blogExample} handleClickLike={() => null} handleClickDelete={() => null}/>
  )

  // Check
  expect(component.container).toHaveTextContent('Test blog')
  expect(component.container).toHaveTextContent('Test author')

  expect(component.container).not.toHaveTextContent('http://testurl.blog.org')
  expect(component.container).not.toHaveTextContent('Likes')
})


test('checks that a blog renders the title and author, and upon click, also url or likes', () => {
  const component = render(
    <Blog blog={blogExample} handleClickLike={() => null} handleClickDelete={() => null}/>
  )

  // Expand by clicking view
  const button = component.container.querySelector('.view-button')
  fireEvent.click(button)

  // Check
  expect(component.container).toHaveTextContent('Test blog')
  expect(component.container).toHaveTextContent('Test author')

  expect(component.container).toHaveTextContent('http://testurl.blog.org')
  expect(component.container).toHaveTextContent('Likes')
})


test('if like is clicked twice, the event handler is called twice', () => {
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blogExample} handleClickLike={mockHandler} handleClickDelete={() => null}/>
  )

  // Expand by clicking view
  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)

  const likeButton = component.getByText('Like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  // Check
  expect(mockHandler.mock.calls).toHaveLength(2)
})