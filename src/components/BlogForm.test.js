import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('form calls the callback with correct data on blog creation', async () => {
    const createBlog = jest.fn();
  
    render(<BlogForm createBlog={createBlog} />)
  
    const inputs = screen.getAllByRole('textbox')
    const titleInput = inputs[0]
    const authorInput = inputs[1]
    const urlInput = inputs[2]
    const saveButton = screen.getByText('save')
  
    await userEvent.type(titleInput, 'test title')
    await userEvent.type(authorInput, 'test author')
    await userEvent.type(urlInput, 'test URL')
  
    await userEvent.click(saveButton)
  
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'test title',
      author: 'test author',
      url: 'test URL'
    })
})