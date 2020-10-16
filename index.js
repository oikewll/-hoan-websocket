/**
 * @param {String} wsurl WebSocket连接地址
 * @param {Number} heartbeatIdleTime 心跳空闲时间
 * @param {Number} heartbeatInterval 心跳间隔时间
 * @param {String} heartbeatCMessage 心跳客户端字符串
 * @param {String} heartbeatSMessage 心跳服务端字符串
 * @param {String} reconnectTime 重连时间
 * @param {Boolean} isDestroy 是否销毁
 * @param {Boolean} isDebug debug模式会打印操作
 * @returns {send} 实例调用send，数据是对象
 * @returns {onmessage} 实例调用onmessage，第二个参数是只回调data[data] 
 * @returns {onopen} 实例调用onopen
 * @returns {onerror} 实例调用onerror
 */

export default class KaliSocket {
    constructor(wsurl){
        this.connectURL = wsurl || "";
        this.lastHealth = -1;               // 最后一次心跳时间
        this.heartbeatIdleTime = 25000;     // 30秒空闲时间
        this.heartbeatInterval = 10000;     // 心跳间隔，10秒一次心跳
        this.heartbeatCMessage = '~H#C~';   // 客户端心跳发送内容
        this.heartbeatSMessage = '~H#S~';   // 服务器心跳发送内容
        this.timeoutObj = null;             // 心跳定时器
        this.reconnectTime = 2000;          // 重连时间，2秒
        this.reconnectObj = null;           // 重连定时器
        this.isDestroy = false;             // 是否销毁
        this.isDebug = false;               // 是否打开调试功能
        this.init();
    }
    init(){
        this.webSocketObj = new WebSocket(this.connectURL);
        window.addEventListener('offline', function(e) { 
            console.log('offline');
        });
        window.addEventListener('online', function(e) {
            console.log('online'); 
        });
    }
    // 自定义WSC连接事件：服务端与前端连接成功后触发
    onopen(event){
        this.isDebug && console.log(event)
    }
    // 自定义WSC消息接收事件：服务端向前端发送消息时触发
    onmessage(event){
        this.isDebug && console.log(event)
    }
    // 自定义WSC异常事件：WSC报错后触发
    onerror(event){
        this.isDebug && console.log(event)
    }
    // 自定义WSC关闭事件：WSC关闭后触发
    onclose(event){
        this.isDebug && console.log(event)
    }
    send(msg){
        const MSG = typeof msg === 'string' ? msg : JSON.stringify(msg);
        this.webSocketObj.send(MSG)
        this.isDebug && console.warn(`ws发送消息==>：${MSG}`);
    }
    create(options){
        // 把options配置合并覆盖到原有的构造器
        if (options) {
            Object.assign(this, options);
        }
        const websocket = this.webSocketObj;
        websocket.onopen = (evnt)=>{
            this.onopen(evnt);
            this.heartStart();
        };
        websocket.onmessage = (evnt)=>{
            // 收到服务端消息，更新最后健康时间
            this.lastHealth = Date.now();
            this.heartReset();

            // 过滤服务器心跳
            if(evnt.data != this.heartbeatSMessage) {
                this.onmessage(evnt);
            }
        };
        websocket.onerror = (evnt)=>{
            this.onerror(evnt);
        };
        websocket.onclose = (evnt)=>{
            this.onclose(evnt);
            this.deteck();
        };
    }
    deteck(){
        if (!this.isDestroy) {
            this.isDestroy = true;
            this.webSocketObj.close();
            this.reconnectObj = setTimeout(()=>{
                this.reconnect();
            }, this.reconnectTime)
        }
    }
    destroy(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.reconnectObj);
        this.isDestroy = true;
        this.webSocketObj.close();
    }
    heartStart(){
        if (this.webSocketObj.readyState != 1) {
            return false;
        }
        this.timeoutObj = setInterval(()=>{ 
            // lastHealth不为-1，而且这一次的时间戳减上一次服务端返回的时间戳大于默认的心跳空余时间，就主动关闭ws进入重连
            if (this.lastHealth !== -1 && (Date.now() - this.lastHealth > this.heartbeatIdleTime)) {
                this.isDebug && console.log("服务器没有响应.");
                // 此时应该触发关闭，然后进入重连
                this.webSocketObj.close();
                return;
            }

            if (this.webSocketObj.readyState != 1) {
                // 这里可以做ajax请求触发链接断开日志，方便服务器排查问题
                this.isDebug && console.log("连接断开! " + new Date().toUTCString());
                return;
            }
            // 判断数据是否发送完毕
            if (this.webSocketObj.bufferedAmount === 0) {
                this.webSocketObj.send(this.heartbeatCMessage);
            } else  {
                console.log("数据未发送完毕! " + new Date().toUTCString());
            }
            this.isDebug && console.log("连接正常! " + new Date().toUTCString());

        }, this.heartbeatInterval);
    }
    heartReset() {
        clearTimeout(this.timeoutObj);
        this.heartStart();
    }
    reconnect() {
        this.isDebug && console.log("断线重连中...");
        this.timeoutObj && clearTimeout(this.timeoutObj);
        const wsurl = this.connectURL;
        this.webSocketObj = new WebSocket(wsurl);
        this.isDestroy = false;
        this.create();
    }
}