import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'testTitle',
    author: 'testAuthor',
    url: 'testUrl'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('testTitle by testAuthor')
  expect(element).toBeDefined()
})

test('clicking like twice calls event handler two times', async () => {
    const blog = {
        title: 'testTitle',
        author: 'testAuthor',
        url: 'testUrl',
        user: { username: 'Markus'}
    }
    console.log("blog: ", blog)

    const mockHandler = jest.fn()
  
    render(
      <Blog blog={blog} handlelike={mockHandler}/>
    )
  
    const user = userEvent.setup()
    const button = screen.getByText('view more info')
    await user.click(button)

    const button2 = screen.getByText('Like')
    await user.click(button2)
    await user.click(button2)
  
    console.log("mock.calls: ", mockHandler.mock.calls)
    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('clicking the "view more info" button shows the additional information', async () => {
    const blog = {
      title: 'testTitle',
      author: 'testAuthor',
      url: 'testUrl',
      likes: 0,
      user: { username: 'Markus'},
    }
  
    const mockHandlerLike = jest.fn()
    const mockHandlerDelete = jest.fn()
  
    render(<Blog blog={blog} handlelike={mockHandlerLike} handleDelete={mockHandlerDelete} />)
    
    const user = userEvent.setup()
    const button = screen.getByText('view more info')
    await user.click(button)
  
    expect(screen.getByText('URL: testUrl')).toBeInTheDocument()
    expect(screen.getByText('likes: 0')).toBeInTheDocument()
    expect(screen.getByText('Markus')).toBeInTheDocument()
  })