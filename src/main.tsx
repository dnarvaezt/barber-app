import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app.tsx'
import './infrastructure/assets/styles/main.scss'
import './infrastructure/components/icons/icon.init.ts'
import {
  TimeValueObject,
  TrackActivityComponent,
  TrackActivityProvider,
} from './infrastructure/components/track-activity'
import { config } from './infrastructure/config/environment.ts'

const children: React.ReactNode = (() => {
  return (
    <StrictMode>
      <TrackActivityProvider
        configuration={{
          minimumTime: TimeValueObject.fromSeconds(2),
          maxIdleTime: TimeValueObject.fromMinutes(5),
          updateInterval: TimeValueObject.fromSeconds(1),
        }}
        autoStart={true}
        options={{
          autoStart: true,
          onActivityStarted: record => {
            if (config.isDevelopment) {
              console.log('Activity started:', record)
            }
          },
          onActivityUpdated: record => {
            if (config.isDevelopment) {
              console.log('Activity updated:', record)
            }
          },
          onActivityFinished: record => {
            if (config.isDevelopment) {
              console.log('Activity finished:', record)
            }
          },
          onError: error => {
            console.error('Track activity error:', error)
          },
        }}
      >
        <TrackActivityComponent
          showControls={true}
          showStats={true}
          showConfiguration={true}
          showDebugInfo={true}
        />
        <BrowserRouter basename={config.basePath}>
          <App />
        </BrowserRouter>
      </TrackActivityProvider>
    </StrictMode>
  )
})()

createRoot(document.getElementById('root')!).render(children)
