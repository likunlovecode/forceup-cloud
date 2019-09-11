import React from 'react'
import IconTrash from 'Images/trash.png'

export default function Empty(props) {
  return (
    <div className="empty-trash" style={{ borderTop: '1px solid #B6B6B6' }}>
      <div className="empty-trash-inner flex-column flex-center" style={{ fontSize: '0.18rem', color: '#707070' }}>
        <div>
          <img src={IconTrash} alt="trash" style={{ width: '1.28rem' }} />
        </div>
        <div style={{ paddingTop: 15 }}>
          您的回收站很干净哦~
        </div>
        <div style={{ paddingTop: 25 }}>
          ForceUp为你保存30天内删除的文件，不小心删除的文件记得及时找回哦~
        </div>
      </div>
    </div>
  )
}