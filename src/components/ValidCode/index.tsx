import React, { Component } from 'react'
import { CommonApi } from '@/api'
import './validCode.less'

interface ValidCodeItem {
    id: number;
    code: string;
    color: string;
    fontSize: string;
    padding: string;
    transform: string;
}

interface ValidCodeList {
    codeList: Array<ValidCodeItem>;
}

interface IProps {
    width?: number;
    height?: number;
    refresh?: number;
    onChange?: (validCode: string) => void
}

class ValidCode extends Component<IProps, ValidCodeList> {
    static defaultProps = {
        width: 150,
        height: 40,
        refresh: 0,
        onChange: () => false
    }

    static getStyle = (data: ValidCodeItem) =>
        ({
            color: data.color,
            fontSize: data.fontSize,
            padding: data.padding,
            transform: data.transform
        })

    constructor(props: IProps) {
        super(props)
        this.state = {
            codeList: []
        }
    }

    componentDidMount() {
        this.getCode()
    }

    shouldComponentUpdate(nextProps: Readonly<IProps>): boolean {
        const { refresh } = this.props
        if (refresh !== nextProps.refresh) {
            this.getCode()
        }
        return true
    }

    getCode = (): void => {
        CommonApi.getValidCode().then((res) => {
            this.createCode(res.data.validCode)
        })
    }

    createCode = (codeArr: string[]): void => {
        const { onChange } = this.props
        let codeList: Array<ValidCodeItem> = []
        codeArr.forEach((code: string, index) => {
            const rgb = [
                Math.round(Math.random() * 200),
                Math.round(Math.random() * 220),
                Math.round(Math.random() * 200)
            ]
            codeList.push({
                id: index + 1,
                code: code,
                color: `rgb(${rgb})`,
                fontSize: `${10 + (Number([Math.floor(Math.random() * 10)]) + 8)}px`,
                padding: `${[Math.floor(Math.random() * 10)]}px`,
                transform: `rotate(${
                    Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)
                }deg)`
            })
        })

        this.setState({
            codeList: codeList
        })

        const code = codeList.map((item: ValidCodeItem) => item.code).join('')

        if (onChange) {
            onChange(code)
        }
    }

    render() {
        const { width, height } = this.props
        const { codeList } = this.state
        return <div className="valid-code-module" style={{ width: `${width}px`, height: `${height}px` }} onClick={this.getCode}>
            <div className="valid-code-box">
                {
                    codeList.map((code) => <span key={code.id} style={ValidCode.getStyle(code)}>{ code.code }</span>)
                }
            </div>
        </div>
    }
}

export default ValidCode
