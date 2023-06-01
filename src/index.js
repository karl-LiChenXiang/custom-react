// import React, {Component} from "react";
// import ReactDOM from 'react-dom';
// import ReactDOM from './kreact/react-dom';
// import ReactDOM from './sreact/react-dom';
// import Component from './sreact/Component';

// import { useReducer } from './lreact';
// import ReactDOM from './lreact/react-dom';
// import Component from './lreact/Component';
import ReactDOM from './mreact/react-dom';
import Component from './mreact/Component';
import { useReducer } from './mreact';

import './index.css';

class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <p>{this.props.name}</p>
      </div>
    );
  }
}

function FunctionComponent(props) {
  const [count2, setCount2] = useReducer(x => x + 1, 0);

  return (
    <div className="border">
      <p>{props.name}</p>
      <p>{count2}</p>
      <button
        onClick={() => {
          setCount2(count2 + 1);
        }}
      >
        click
      </button>
    </div>
  );
}

function FF() {
  return (
    <>
      <li>0</li>
      <li>1</li>
    </>
  );
}

const jsx = (
  <div className="border">
    <h1>全栈</h1>
    <a href="https://www.kaikeba.com/">kkb</a>
    <FunctionComponent name="嘉恒" />
    <ClassComponent name="class" />
    {/* <FF /> */}

    <ul>
      <>
        <li>0</li>
        <li>1</li>
      </>
    </ul>
  </div>
);
// console.log('jsx', jsx);
ReactDOM.render(jsx, document.getElementById('root'));

// console.log("React", React.version); //sy-log

//原生标签
// 文本
// 函数组件
