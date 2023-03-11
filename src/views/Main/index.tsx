import React, { FC, useEffect, useState } from 'react'
import { Card, Button, Row, Col } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import NoData from '@/components/NoData'
import { ArticleApi } from '@/api'
import { formatDate } from '@/utils/tools'
import './main.less'

const PageTitle: FC = () => <div className="card-header">
    <span className="header-title">欢迎光临</span>【火星的青青草原-管理后台】
</div>

const MainAdmin = () => {
    const githubArr: Array<any> = [
        { name: '博主网站首页', link: 'http://rongcl.cn' },
        { name: '开源项目地址', link: 'https://github.com/rongcl9219' },
        {
            name: '前台项目地址',
            link: 'https://github.com/rongcl9219/blog-front-client'
        },
        {
            name: '管理后台项目地址',
            link: 'https://github.com/rongcl9219/blog-admin-react'
        },
        {
            name: '服务端项目地址',
            link: 'https://github.com/rongcl9219/my-blog-server'
        }
    ]

    const [currentArticles, setCurrentArticles] = useState<Array<any>>([])

    const [isLoadData, setLoadData] = useState<boolean>(false)

    useEffect(() => {
        if (!isLoadData) {
            ArticleApi.getCurrentArticles().then(res => {
                setCurrentArticles(res.data)
            }).catch(() => false).finally(() => setLoadData(true))
        }
    }, [isLoadData])

    return <div className="home-page">
        <Card className="box-card" title={<PageTitle />}>
            <Card title={<span className="header-title">关于开源项目【火星的青青草原】</span>}
                hoverable
                style={{ marginBottom: '20px' }}>
                <h3 className="header-title">项目相关</h3>
                <ul>
                    {
                        githubArr.map(item => <li className="list-item about" key={item.link}>
                            <Button type="link" target="_blank" href={item.link}>
                                <span className="list-item-title">
                                    <SvgIcon iconClass="circle" />
                                    { item.name }：
                                    <span>{ item.link }</span>
                                </span>
                            </Button>
                        </li>)
                    }
                </ul>
            </Card>
            <Row>
                <Col span={12}>
                    <Card hoverable title={<span className="header-title">最近发布</span>}>
                        <ul>
                            {
                                currentArticles.map(article => <li className="list-article" key={article.articleId}>
                                    <Button type="link" target="_blank" href={`//rongcl.cn/article?articleId=${article.articleId}`}>
                                        <span className="list-time">{ formatDate('yyyy-MM-dd hh:mm', article.createDate) }</span>
                                        <span className="article-title">{ article.articleTitle }</span>
                                    </Button>
                                </li>)
                            }
                            {
                                currentArticles.length === 0 && <NoData style={{ width: '200px', margin: '0 auto' }} />
                            }
                        </ul>
                    </Card>
                </Col>
            </Row>
        </Card>
    </div>
}

export default MainAdmin
