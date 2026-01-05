import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './page'

describe('Home (TODO List)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期レンダリング', () => {
    it('タイトルが表示される', () => {
      render(<Home />)
      expect(screen.getByText('TODOリスト')).toBeInTheDocument()
    })

    it('空の状態メッセージが表示される', () => {
      render(<Home />)
      expect(screen.getByText('タスクがありません。新しいタスクを追加してください。')).toBeInTheDocument()
    })

    it('入力フィールドと追加ボタンが表示される', () => {
      render(<Home />)
      expect(screen.getByPlaceholderText('新しいタスクを入力...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
    })

    it('期限日入力フィールドが表示される', () => {
      render(<Home />)
      expect(screen.getByLabelText('期限日:')).toBeInTheDocument()
    })
  })

  describe('タスクの追加', () => {
    it('テキストを入力してタスクを追加できる', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      const addButton = screen.getByRole('button', { name: '追加' })

      await user.type(input, '買い物に行く')
      await user.click(addButton)

      expect(screen.getByText('買い物に行く')).toBeInTheDocument()
      expect(input).toHaveValue('')
    })

    it('Enterキーでタスクを追加できる', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')

      await user.type(input, '洗濯をする{Enter}')

      expect(screen.getByText('洗濯をする')).toBeInTheDocument()
      expect(input).toHaveValue('')
    })

    it('空の入力では追加ボタンを押してもタスクが追加されない', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const addButton = screen.getByRole('button', { name: '追加' })

      await user.click(addButton)

      expect(screen.getByText('タスクがありません。新しいタスクを追加してください。')).toBeInTheDocument()
    })

    it('空白のみの入力では追加ボタンを押してもタスクが追加されない', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      const addButton = screen.getByRole('button', { name: '追加' })

      await user.type(input, '   ')
      await user.click(addButton)

      expect(screen.getByText('タスクがありません。新しいタスクを追加してください。')).toBeInTheDocument()
    })

    it('期限日付きでタスクを追加できる', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      const dueDateInput = screen.getByLabelText('期限日:')
      const addButton = screen.getByRole('button', { name: '追加' })

      await user.type(input, '書類を提出する')
      await user.type(dueDateInput, '2026-12-31')
      await user.click(addButton)

      expect(screen.getByText('書類を提出する')).toBeInTheDocument()
      expect(screen.getByText(/期限: 2026\/12\/31/)).toBeInTheDocument()
    })

    it('複数のタスクを追加できる', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      const addButton = screen.getByRole('button', { name: '追加' })

      await user.type(input, 'タスク1')
      await user.click(addButton)

      await user.type(input, 'タスク2')
      await user.click(addButton)

      await user.type(input, 'タスク3')
      await user.click(addButton)

      expect(screen.getByText('タスク1')).toBeInTheDocument()
      expect(screen.getByText('タスク2')).toBeInTheDocument()
      expect(screen.getByText('タスク3')).toBeInTheDocument()
    })
  })

  describe('タスクの完了/未完了切り替え', () => {
    it('チェックボックスをクリックしてタスクを完了にできる', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      await user.type(input, 'テストタスク{Enter}')

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()

      await user.click(checkbox)

      expect(checkbox).toBeChecked()
      const taskText = screen.getByText('テストタスク')
      expect(taskText).toHaveClass('line-through')
      expect(taskText).toHaveClass('text-gray-500')
    })

    it('完了したタスクをチェックボックスで未完了に戻せる', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      await user.type(input, 'テストタスク{Enter}')

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)
      expect(checkbox).toBeChecked()

      await user.click(checkbox)
      expect(checkbox).not.toBeChecked()

      const taskText = screen.getByText('テストタスク')
      expect(taskText).not.toHaveClass('line-through')
    })
  })

  describe('タスクの削除', () => {
    it('削除ボタンでタスクを削除できる', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      await user.type(input, '削除されるタスク{Enter}')

      expect(screen.getByText('削除されるタスク')).toBeInTheDocument()

      const deleteButton = screen.getByRole('button', { name: '削除' })
      await user.click(deleteButton)

      expect(screen.queryByText('削除されるタスク')).not.toBeInTheDocument()
      expect(screen.getByText('タスクがありません。新しいタスクを追加してください。')).toBeInTheDocument()
    })

    it('複数タスクのうち特定のタスクを削除できる', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')

      await user.type(input, 'タスク1{Enter}')
      await user.type(input, 'タスク2{Enter}')
      await user.type(input, 'タスク3{Enter}')

      const deleteButtons = screen.getAllByRole('button', { name: '削除' })
      await user.click(deleteButtons[1])

      expect(screen.getByText('タスク1')).toBeInTheDocument()
      expect(screen.queryByText('タスク2')).not.toBeInTheDocument()
      expect(screen.getByText('タスク3')).toBeInTheDocument()
    })
  })

  describe('タスクの統計表示', () => {
    it('タスクがない時は統計が表示されない', () => {
      render(<Home />)
      expect(screen.queryByText(/完了:/)).not.toBeInTheDocument()
    })

    it('タスク数と完了数が正しく表示される', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')

      await user.type(input, 'タスク1{Enter}')
      await user.type(input, 'タスク2{Enter}')

      expect(screen.getByText(/完了: 0 \/ 全体: 2/)).toBeInTheDocument()

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])

      expect(screen.getByText(/完了: 1 \/ 全体: 2/)).toBeInTheDocument()
    })

    it('すべてのタスクを完了すると統計が正しく更新される', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')

      await user.type(input, 'タスク1{Enter}')
      await user.type(input, 'タスク2{Enter}')

      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])
      await user.click(checkboxes[1])

      expect(screen.getByText(/完了: 2 \/ 全体: 2/)).toBeInTheDocument()
    })
  })

  describe('期限切れタスクの表示', () => {
    let dateNowSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      const mockDate = new Date('2026-01-10T00:00:00')
      const RealDate = Date
      dateNowSpy = vi.spyOn(global.Date, 'now').mockImplementation(() => mockDate.getTime())
      // @ts-ignore
      global.Date = class extends RealDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(mockDate.getTime())
          } else {
            super(...args)
          }
        }
      }
    })

    afterEach(() => {
      dateNowSpy.mockRestore()
      vi.restoreAllMocks()
    })

    it('期限切れのタスクは赤い背景で表示される', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      const dueDateInput = screen.getByLabelText('期限日:')

      await user.type(input, '期限切れタスク')
      await user.type(dueDateInput, '2026-01-05')
      await user.click(screen.getByRole('button', { name: '追加' }))

      const taskElement = screen.getByText('期限切れタスク').closest('div')?.parentElement
      expect(taskElement).toHaveClass('bg-red-50')
    })

    it('期限切れタスクには「期限切れ」表示がある', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      const dueDateInput = screen.getByLabelText('期限日:')

      await user.type(input, '遅れているタスク')
      await user.type(dueDateInput, '2026-01-05')
      await user.click(screen.getByRole('button', { name: '追加' }))

      expect(screen.getByText(/\(期限切れ\)/)).toBeInTheDocument()
    })

    it('期限内のタスクは通常の背景で表示される', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      const dueDateInput = screen.getByLabelText('期限日:')

      await user.type(input, '期限内タスク')
      await user.type(dueDateInput, '2026-01-15')
      await user.click(screen.getByRole('button', { name: '追加' }))

      const taskElement = screen.getByText('期限内タスク').closest('div')?.parentElement
      expect(taskElement).toHaveClass('bg-gray-50')
      expect(taskElement).not.toHaveClass('bg-red-50')
      expect(screen.queryByText(/期限切れ/)).not.toBeInTheDocument()
    })

    it('完了済みタスクは期限切れでも赤背景にならない', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      const dueDateInput = screen.getByLabelText('期限日:')

      await user.type(input, '完了済み期限切れタスク')
      await user.type(dueDateInput, '2026-01-05')
      await user.click(screen.getByRole('button', { name: '追加' }))

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      const taskElement = screen.getByText('完了済み期限切れタスク').closest('div')?.parentElement
      expect(taskElement).toHaveClass('bg-gray-50')
      expect(taskElement).not.toHaveClass('bg-red-50')
    })

    it('期限がないタスクは期限切れにならない', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      await user.type(input, '期限なしタスク{Enter}')

      const taskElement = screen.getByText('期限なしタスク').closest('div')?.parentElement
      expect(taskElement).toHaveClass('bg-gray-50')
      expect(taskElement).not.toHaveClass('bg-red-50')
      expect(screen.queryByText(/期限:/)).not.toBeInTheDocument()
    })
  })

  describe('日付フォーマット', () => {
    it('日本語形式で日付が表示される', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      const dueDateInput = screen.getByLabelText('期限日:')

      await user.type(input, 'フォーマットテスト')
      await user.type(dueDateInput, '2026-03-15')
      await user.click(screen.getByRole('button', { name: '追加' }))

      expect(screen.getByText(/期限: 2026\/3\/15/)).toBeInTheDocument()
    })
  })

  describe('タスクID生成', () => {
    it('各タスクにユニークなIDが割り当てられる', async () => {
      const user = userEvent.setup()

      const dateNowSpy = vi.spyOn(Date, 'now')
      dateNowSpy.mockReturnValueOnce(1000)
      dateNowSpy.mockReturnValueOnce(2000)

      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')

      await user.type(input, 'タスク1{Enter}')
      await user.type(input, 'タスク2{Enter}')

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(2)

      dateNowSpy.mockRestore()
    })
  })

  describe('入力フィールドのクリア', () => {
    it('タスク追加後にテキスト入力がクリアされる', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      await user.type(input, 'テストタスク')
      await user.click(screen.getByRole('button', { name: '追加' }))

      expect(input).toHaveValue('')
    })

    it('タスク追加後に期限日入力がクリアされる', async () => {
      const user = userEvent.setup()
      render(<Home />)

      const input = screen.getByPlaceholderText('新しいタスクを入力...')
      const dueDateInput = screen.getByLabelText('期限日:')

      await user.type(input, 'テストタスク')
      await user.type(dueDateInput, '2026-12-31')
      await user.click(screen.getByRole('button', { name: '追加' }))

      expect(input).toHaveValue('')
      expect(dueDateInput).toHaveValue('')
    })
  })
})
