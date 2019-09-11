import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import '@beeleelee/common-css';
import '$common/style/index.less'
import App from './App';
import * as serviceWorker from './serviceWorker';
import { rem } from 'mytoolkit';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Loading from '$common/components/Loading'

// import i18n (needs to be bundled ;))
import './i18n';

rem({
  designWidth: 1920,
  designDPR: 1,
  rem2px: 100,
  bodyFontSize: 14,
  maxAdaptedWidth: 1920,
  minAdaptedWidth: 0,
  win: window,
  doc: window.document
})

ReactDOM.render(
  <Suspense fallback={<Loading />}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Suspense>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
