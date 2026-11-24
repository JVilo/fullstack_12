import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationContextProvider } from '../NotificationContext'
import blogService from '../services/blogs'
import BlogForm from './BlogForm'

vi.mock('../services/blogs', () => ({
  default: {
    create: vi.fn(),
  },
}))

test('Calls blogService.create with right details when blog is created', async () => {
  const user = userEvent.setup()
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const createdBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/',
  }

  blogService.create.mockResolvedValueOnce(createdBlog)

  render(
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <BlogForm />
      </NotificationContextProvider>
    </QueryClientProvider>
  )

  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('create')

  await user.type(inputs[0], createdBlog.title)
  await user.type(inputs[1], createdBlog.author)
  await user.type(inputs[2], createdBlog.url)

  await user.click(createButton)

  await waitFor(() => {
    expect(blogService.create).toHaveBeenCalledTimes(1)
  })

  expect(blogService.create.mock.calls[0][0]).toEqual({
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/',
  })
})