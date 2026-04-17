'use client'
import { useConfig } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

export const BeforeDashboardClient = () => {
  const configContext = useConfig()
  const apiRoute = configContext?.config?.routes?.api ?? '/api'
  const serverUrl = configContext?.config?.serverURL

  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchMessage = async () => {
      const response = await fetch(`${apiRoute}/my-plugin-endpoint`)
      const result = await response.json()
      setMessage(result.message)
    }

    void fetchMessage()
  }, [serverUrl, apiRoute])

  return (
    <div>
      <h1>Added by the plugin: Before Dashboard Client</h1>
      <div>
        Message from the endpoint:
        <div>{message || 'Loading...'}</div>
      </div>
    </div>
  )
}
