// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import Todo from './Todo'

afterEach(() => {
  cleanup()
})

describe('Todo component', () => {
  it('renders the todo text', () => {
    const todo = {
      text: 'Learn Docker',
      done: false
    }

    render(
      <Todo
        todo={todo}
        deleteTodo={() => {}}
        completeTodo={() => {}}
      />
    )

    expect(screen.getByText('Learn Docker')).toBeDefined()
  })

  it('calls deleteTodo when delete button is clicked', () => {
    const todo = {
      text: 'Learn Docker',
      done: false
    }

    const deleteTodo = vi.fn()

    render(
      <Todo
        todo={todo}
        deleteTodo={deleteTodo}
        completeTodo={() => {}}
      />
    )

    fireEvent.click(screen.getByText('Delete'))

    expect(deleteTodo).toHaveBeenCalledWith(todo)
  })
})