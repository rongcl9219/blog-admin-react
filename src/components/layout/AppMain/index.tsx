import React from 'react'
import RouterBeforeEach from '@/router/routerBeforeEach'
import './appMain.less'

const AppMain = () => (
    <section className="app-main">
        <div className="app-main-content">
            <RouterBeforeEach />
        </div>
    </section>
)

export default AppMain
