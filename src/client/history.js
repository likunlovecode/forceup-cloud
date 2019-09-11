import { createHashHistory as createHistory } from 'history'
import { alert } from '@beeleelee/myreactkit'

export const history = createHistory({
  getUserConfirmation: (message, callback) => {
    alert({
      content: message,
      onCancel: () => callback(false),
      onConfirm: () => callback(true)
    })
  }
})

export default history 