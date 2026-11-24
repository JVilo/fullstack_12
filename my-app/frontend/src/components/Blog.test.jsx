import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { NotificationContextProvider } from '../NotificationContext'
import { useUser } from '../UserContext'
import Blog from './Blog'

vi.mock('../UserContext', () => ({
  useUser: vi.fn(),
}))

const renderBlog = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </NotificationContextProvider>
    </QueryClientProvider>
  )
}

describe('<Blog />', () => {
  const blog = {
    id: '1',
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'https://react-testing.com',
    likes: 10,
    comments: [],
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    },
  }

  test('renders blog details and likes for unauthenticated user, but no buttons', () => {
    useUser.mockReturnValue(null)
    renderBlog(<Blog blog={blog} />)

    expect(
      screen.getByText('Testing React Components', { exact: false })
    ).toBeDefined()
    expect(screen.getByText('Test Author', { exact: false })).toBeDefined()
    expect(
      screen.getByText('https://react-testing.com', { exact: false })
    ).toBeDefined()
    expect(screen.getByText('10 likes', { exact: false })).toBeDefined()

    const likeButton = screen.queryByRole('button', { name: /^like$/i })
    const removeButton = screen.queryByRole('button', { name: /^remove$/i })

    expect(likeButton).toBeNull()
    expect(removeButton).toBeNull()
  })

  test('renders only like button for logged in user who is not the creator', () => {
    useUser.mockReturnValue({
      username: 'otheruser',
      name: 'Other User',
    })

    renderBlog(<Blog blog={blog} />)

    const likeButton = screen.getByRole('button', { name: /^like$/i })
    expect(likeButton).toBeDefined()

    const removeButton = screen.queryByRole('button', { name: /^remove$/i })
    expect(removeButton).toBeNull()
  })

  test('renders both like and remove buttons for creator of the blog', () => {
    useUser.mockReturnValue({
      username: 'mluukkai',
      name: 'Matti Luukkainen',
    })

    renderBlog(<Blog blog={blog} />)

    const likeButton = screen.getByRole('button', { name: /^like$/i })
    const removeButton = screen.getByRole('button', { name: /^remove$/i })

    expect(likeButton).toBeDefined()
    expect(removeButton).toBeDefined()
  })
})