import React from 'react';
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';

Nprogress.configure({ showSpinner: false });

class TopProgressBar<P> extends React.Component<P> {
    constructor(props: P) {
        super(props);
        Nprogress.start();
    }

    componentWillUnmount() {
        Nprogress.done();
    }

    render() {
        return null;
    }
}

export default TopProgressBar;
