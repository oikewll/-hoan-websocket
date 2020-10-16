# WebSocket插件封装
> 平时常用的业务情景封装了下websocket；
>
> 兼容低版本JS，基于rollup/babel build/minify；
> 
> 支持CMD、AMD、commonJS、ES6方式引入使用；

## 安装
```
// CDN
$ git clone git@github.com:oikewll/-hoan-websocket.git
$ cd -hoan-websocket && npm i
$ npm run build

// es6
$ npm install hoan-websocket -S

// or
$ yarn add hoan-websocket -S
```

## 引入
```
// CDN
<script src="./lib/HoanSocket-{version}.js"></script>

// ES6
import HoanSocket from 'hoan-websocket';

// CommonJS
const HoanSocket = require('hoan-websocket')
```

## 使用
```
const socket = new HoanSocket('{wsurl}');
socket.create({
    isDebug: true,
    reconnectTime: 2000,
    onopen: (event)=>{
        // 监听ws open
    },
    onmessage: (event)=>{
        const {data} = JSON.parse(event.data);
        console.log(data);
    },
    onclose: (err)=>{
    	// 监听ws close，业务做什么
    }
}); 
```

### For NuxtJs
```
// nuxt.config.js
plugins: [
    '@/plugins/websocket'
  ]
```
```
// websocket.js
import HoanSocket from 'hoan-websocket';
const socket = new HoanSocket('{wsurl}');
socket.create({
    ...
}); 
export default ({ app }, inject) => {
	inject('socket', socket);
}
```
```
// 或者在layout.vue
this.$socket.create({
    ...
}); 
```


## 配置
| 参数    | 类型      | 说明                                                 | 默认值 |
| --------- | --------- | ------- | ------- |
| `isDebug ` | `Boolean `   | Debug模式 | false    |
| `wsurl ` | `String`   | ws连接地址 | <空>    |
| `heartbeatIdleTime ` | `Number `   | 空闲时间 | 25s |
| `heartbeatInterval ` | `Number`   | 心跳间隔 | 10s |
| `heartbeatCMessage ` | `String`   | 客户端心跳发送内容 | `~H#C~` |
| `heartbeatSMessage ` | `String`   | 服务器心跳回复内容 | `~H#S~` |
| `reconnectTime ` | `Number`   | 重连时间 | 2s |

### 配置建议
 
> 建议 `heartbeatIdleTime` 为 `heartbeatCheckInterval` 的两倍多一点。这个两倍是为了进行容错，允许丢一个包。而多一点是考虑到网络的延时。可以跟据实际的业务来调整这个容错率（允许丢几个包）
> 
> 心跳最大的空闲时间，如果最后一个心跳包的时间与当前时间之差超过这个值，则认为该连接失效

## 版本日志

#### v1.0.3

- 优化配置方式

#### v1.0.1

- 初始化使用

## 已应用

![狼人杀助手](https://www.langrensha.game/imgs/pad-ico.png)

## License
ISC